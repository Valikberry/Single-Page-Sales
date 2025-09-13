// lib/optimizedSheets.js
import { getSheetNamesWithJ2Values } from "./getIdNameCategory";
import { getAllCategoriesDataById, getAllSheetsByName } from "./googleSheets";
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLESHEETS_ID;
export async function getOptimizedSheetData(sheetId) {
  const data = await getAllSheetsByName([sheetId]);
  return data;
}

export async function getOptimizedAllData() {
  try {
    // Fetch metadata and data in parallel
    const [categoryMeta, categoriesData] = await Promise.all([
      getSheetNamesWithJ2Values(SPREADSHEET_ID),
      getAllCategoriesDataById("Categories", SPREADSHEET_ID),
    ]);


    const allSheetIds = categoryMeta.map((cat) => cat.id);
    const allData = await getAllSheetsByName(allSheetIds);

    const result = {
      allData,
      categoryMeta,
      categoriesData,
    };

    return result;
  } catch (error) {
    console.error("❌ Error in getOptimizedAllData:", error);
    console.error("📍 Error stack:", error.stack);
    throw error;
  }
}
