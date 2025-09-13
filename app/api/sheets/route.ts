import { NextRequest, NextResponse } from "next/server";
import {
  getOptimizedAllData,
  getOptimizedSheetData,
} from "@/lib/optimizedSheets";
import { extractCategoriesWithDescription } from "@/lib/data";

export async function GET(req: NextRequest) {
  const sheetId = req.nextUrl.searchParams.get("category") || "all";

  try {
    if (sheetId === "all") {
      const { allData, categoriesData } = await getOptimizedAllData();
      const sheetData = Object.values(allData).flat();

      return NextResponse.json({
        sheetData,
        currentName: categoriesData?.allTitle || "All Jobs",
        currentDesc: categoriesData?.allDescription || "",
      });
    } else {
      const data = await getOptimizedSheetData(sheetId);

      const sheetData = data?.[sheetId] || [];
      const categories = extractCategoriesWithDescription(data);
      const category = categories.find((c) => c.id === sheetId);

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        sheetData,
        currentName: category.name,
        currentDesc: category.description,
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
