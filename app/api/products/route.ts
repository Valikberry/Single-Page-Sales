// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSheetNamesWithJ2Values } from "@/lib/getIdNameCategory";
import {
  getAllCategoriesDataById,
  getAllProductSheetsByName,
} from "@/lib/googleSheets";
import { extractCategoriesWithDescription } from "@/lib/data";
import { CategoryWithDescription } from "@/lib/types";

const SPREADSHEET_ID = process.env.GOOGLESHEETS_TODAYPICKS_ID!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";

    let sheetData: (string | number | null)[][] = [];
    let categories: CategoryWithDescription[] = [];
    let currentName: string | number | null = "";
    let currentDesc: string | number | null = "";

    if (category === "all") {
      // Handle "all" category - fetch all sheets and category metadata
      const [categoryMeta, dynamicAllCategories] = await Promise.all([
        getSheetNamesWithJ2Values(SPREADSHEET_ID),
        getAllCategoriesDataById("Categories", SPREADSHEET_ID),
      ]);

      if (!dynamicAllCategories) {
        console.error("Failed to fetch category metadata");
        return NextResponse.json(
          { error: "Failed to fetch category metadata" },
          { status: 500 }
        );
      }

      const allSheetIds = categoryMeta.map((cat: any) => cat.id);

      // Pass the SPREADSHEET_ID to getAllSheetsByName
      const allData = await getAllProductSheetsByName(
        allSheetIds,
        SPREADSHEET_ID
      );

      if (!allData || Object.keys(allData).length === 0) {
        console.error("Failed to fetch sheet data");
        return NextResponse.json(
          { error: "No data available" },
          { status: 404 }
        );
      }

      // Flatten all sheet data (only non-empty sheets)
      sheetData = Object.values(allData)
        .filter((data) => Array.isArray(data) && data.length > 0)
        .flat();

      categories = extractCategoriesWithDescription(allData);
      currentName = dynamicAllCategories.allTitle;
      currentDesc = dynamicAllCategories.allDescription;
    } else {
      // Handle specific category
      // First validate that the category exists
      const categoryMeta = await getSheetNamesWithJ2Values(SPREADSHEET_ID);
      const isValidCategory = categoryMeta.some(
        (cat: { id: string; name: string }) => cat.id === category
      );

      if (!isValidCategory) {
        console.error(`Invalid category: ${category}`);
        return NextResponse.json(
          { error: `Category "${category}" not found` },
          { status: 404 }
        );
      }

      // Fetch the specific sheet data - PASS THE SPREADSHEET_ID
      const data = await getAllProductSheetsByName([category], SPREADSHEET_ID);

      if (!data || !data[category] || data[category].length === 0) {
        console.error(`No data found for category: ${category}`);
        return NextResponse.json(
          { error: `No products found for category "${category}"` },
          { status: 404 }
        );
      }

      sheetData = data[category];
      categories = extractCategoriesWithDescription(data);

      // Find the current category details
      const categoryInfo = categories.find((c) => c.id === category);
      if (!categoryInfo) {
        // Fallback to category meta if not found in extracted data
        const metaInfo = categoryMeta.find(
          (cat: { id: string; name: string }) => cat.id === category
        );
        currentName = metaInfo?.name || category;
        currentDesc = `Explore our ${category} collection`;
      } else {
        currentName = categoryInfo.name;
        currentDesc = categoryInfo.description;
      }
    }

    // Return the data
    const response = {
      sheetData,
      currentName,
      currentDesc,
      categories,
      category,
      totalItems: sheetData.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error in products route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch product data",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
