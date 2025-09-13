import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transaction_id,
      tx_ref,
      product_id,
      product_name,
      amount,
      quantity,
    } = body;

    // Validate required fields
    if (!transaction_id || !tx_ref) {
      console.error("Missing required fields:", { transaction_id, tx_ref });
      return NextResponse.json(
        {
          success: false,
          message: "Missing transaction ID or reference",
        },
        { status: 400 }
      );
    }

    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment configuration error",
        },
        { status: 500 }
      );
    }
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Flutterwave API error: ${response.status} ${response.statusText}`,
        },
        { status: 400 }
      );
    }

    const data = await response.json();
    if (data.status === "success" && data.data.status === "successful") {
      const paymentData = data.data;
      if (paymentData.tx_ref === tx_ref) {
        const paidAmount = parseFloat(paymentData.amount);
        const expectedAmount = parseFloat(amount);
        const amountDifference = Math.abs(paidAmount - expectedAmount);
        if (amountDifference < 0.01) {
          const spreadsheetId = process.env.GOOGLESHEETS_TODAYPICKS_ID;
        

          if (spreadsheetId) {
            await logPaymentToSheet(
              {
                transaction_id,
                tx_ref,
                amount: paymentData.amount,
                currency: paymentData.currency,
                status: paymentData.status,
                customer_email: paymentData.customer.email,
                customer_name: paymentData.customer.name,
                product_id,
                product_name,
                quantity,
              },
              spreadsheetId
            );
          }

          return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
            data: {
              transaction_id,
              tx_ref,
              amount: paymentData.amount,
              currency: paymentData.currency,
              status: paymentData.status,
              customer: {
                email: paymentData.customer.email,
                name: paymentData.customer.name,
              },
            },
          });
        } else {
          console.error("Amount mismatch:", {
            paid: paidAmount,
            expected: expectedAmount,
            difference: amountDifference,
          });

          return NextResponse.json(
            {
              success: false,
              message: `Payment verification failed - amount mismatch. Expected: ${expectedAmount}, Received: ${paidAmount}`,
            },
            { status: 400 }
          );
        }
      } else {
        console.error("Transaction reference mismatch:", {
          received: paymentData.tx_ref,
          expected: tx_ref,
        });

        return NextResponse.json(
          {
            success: false,
            message:
              "Payment verification failed - transaction reference mismatch",
          },
          { status: 400 }
        );
      }
    } else {
      console.error("Payment not successful:", {
        status: data.status,
        data_status: data.data?.status,
        message: data.message,
      });

      return NextResponse.json(
        {
          success: false,
          message: `Payment was not successful. Status: ${
            data.data?.status || "unknown"
          }`,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);

    // More specific error handling
    let errorMessage = "An error occurred while verifying payment";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

async function logPaymentToSheet(
  paymentData: {
    transaction_id: string;
    tx_ref: string;
    amount: string | number;
    currency: string;
    status: string;
    customer_email: string;
    customer_name: string;
    product_id?: string;
    product_name?: string;
    quantity?: number;
  },
  spreadsheetId: string
): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString();

    // Prepare row data in the order you want in your sheet
    const rowData = [
      timestamp,
      paymentData.transaction_id,
      paymentData.tx_ref,
      paymentData.amount,
      paymentData.currency,
      paymentData.status,
      paymentData.customer_email,
      paymentData.customer_name,
      paymentData.product_id || "",
      paymentData.product_name || "",
      paymentData.quantity || "",
    ];

    const keyFile = JSON.parse(
      Buffer.from(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY_ENCODED!,
        "base64"
      ).toString()
    );
    keyFile.private_key = keyFile.private_key.replace(/\\n/g, "\n");
    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    console.log("got here", rowData);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "payments",
      valueInputOption: "RAW",
      requestBody: {
        values: [rowData],
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("❌ Error logging payment to Google Sheets:", error);
    return false;
  }
}
