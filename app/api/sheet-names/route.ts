// app/api/sheet-names/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSheetNamesWithJ2Values } from "@/lib/getIdNameCategory";

const COMMUNITY_SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLESHEETS_ID!;
const PRODUCTS_SPREADSHEET_ID =
  process.env.NEXT_PUBLIC_GOOGLESHEETS_TODAYPICKS_ID!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "community";

    let spreadsheetId: string;
    let sheets: Array<{ id: string; name: string }> = [];

    if (type === "products") {
      if (!PRODUCTS_SPREADSHEET_ID) {
        throw new Error("Products spreadsheet ID not configured");
      }
      spreadsheetId = PRODUCTS_SPREADSHEET_ID;
    } else if (type === "community") {
      if (!COMMUNITY_SPREADSHEET_ID) {
        throw new Error("Community spreadsheet ID not configured");
      }
      spreadsheetId = COMMUNITY_SPREADSHEET_ID;
    } else {
      return NextResponse.json(
        { error: `Invalid type: ${type}. Must be 'community' or 'products'` },
        { status: 400 }
      );
    }

    // Fetch sheet names using your existing function
    sheets = await getSheetNamesWithJ2Values(spreadsheetId);

    if (!Array.isArray(sheets)) {
      throw new Error("Invalid response format from getSheetNamesWithJ2Values");
    }

    return NextResponse.json({
      sheets,
      type,
      total: sheets.length,
      spreadsheetId: spreadsheetId.substring(0, 10) + "...", // Partial ID for logging
    });
  } catch (error) {
    console.error("Error in sheet-names API:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch sheet names",
        details: errorMessage,
        sheets: [], // Fallback empty array
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST method for batch requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { types } = body; // e.g., ['community', 'products']

    if (!Array.isArray(types)) {
      return NextResponse.json(
        { error: "Types must be an array" },
        { status: 400 }
      );
    }

    const results = await Promise.allSettled(
      types.map(async (type: string) => {
        const spreadsheetId =
          type === "products"
            ? PRODUCTS_SPREADSHEET_ID
            : COMMUNITY_SPREADSHEET_ID;
        const sheets = await getSheetNamesWithJ2Values(spreadsheetId);
        return { type, sheets };
      })
    );

    const data: Record<string, any> = {};

    results.forEach((result, index) => {
      const type = types[index];
      if (result.status === "fulfilled") {
        data[type] = result.value.sheets;
      } else {
        console.error(`Failed to fetch ${type} sheets:`, result.reason);
        data[type] = [];
      }
    });

    return NextResponse.json({
      data,
      success: true,
    });
  } catch (error) {
    console.error("Error in sheet-names POST:", error);

    return NextResponse.json(
      { error: "Failed to fetch batch sheet names" },
      { status: 500 }
    );
  }
}
