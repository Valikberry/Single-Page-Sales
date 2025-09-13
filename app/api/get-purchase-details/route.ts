// app/api/get-purchase-details/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get("tx_ref");
    if (!txRef) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction reference is required",
        },
        { status: 400 }
      );
    }

    const purchaseData = await getPurchaseByTxRef(txRef);

    if (!purchaseData) {
      return NextResponse.json(
        {
          success: false,
          message: "Purchase not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: purchaseData,
    });
  } catch (error) {
    console.error("Error fetching purchase details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching purchase details",
      },
      { status: 500 }
    );
  }
}

async function getPurchaseByTxRef(txRef: string) {
  try {
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLESHEETS_TODAYPICKS_ID;
    const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_ENCODED;

    if (!spreadsheetId || !encoded) {
      throw new Error("Missing required environment variables");
    }

    // Use your existing authentication pattern
    const keyFile = JSON.parse(Buffer.from(encoded, "base64").toString());
    keyFile.private_key = keyFile.private_key.replace(/\\n/g, "\n");

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Get all data from the payments sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "payments", // Your sheet name
    });

    const rows = response.data.values;

    if (!rows || rows.length < 2) {
      console.log("No data found in payments sheet");
      return null;
    }

    // Assuming your sheet structure matches what we set up earlier:
    // [Timestamp, Transaction ID, TX Ref, Amount, Currency, Status, Customer Email, Customer Name, Product ID, Product Name, Quantity]
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Find the row with matching tx_ref
    const purchaseRow = dataRows.find((row) => {
      const txRefIndex = headers.findIndex((header) =>
        header.toLowerCase().includes("tx_ref")
      );
      return txRefIndex !== -1 && row[txRefIndex] === txRef;
    });

    if (!purchaseRow) {
      console.log(`Purchase with tx_ref ${txRef} not found`);
      return null;
    }

    // Extract data based on header positions
    const getValueByHeader = (headerName: string) => {
      const index = headers.findIndex((header) =>
        header.toLowerCase().includes(headerName.toLowerCase())
      );
      return index !== -1 ? purchaseRow[index] : "";
    };

    // Map the data to your expected format
    const purchaseData = {
      transaction_id: getValueByHeader("transaction_id"),
      tx_ref: txRef,
      amount: getValueByHeader("amount"),
      currency: getValueByHeader("currency") || "USD",
      customer: {
        email: getValueByHeader("email") || getValueByHeader("customer_email"),
        name: getValueByHeader("name") || getValueByHeader("customer_name"),
      },
      product: {
        id: getValueByHeader("product_id") || getValueByHeader("product id"),
        name:
          getValueByHeader("product_name") || getValueByHeader("product name"),
        quantity: parseInt(getValueByHeader("quantity") || "1"),
      },
    };

    return purchaseData;
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    return null;
  }
}
