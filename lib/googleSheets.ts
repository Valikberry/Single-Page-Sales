
// Types
interface GoogleSheetCell {
  v: string | number | null;
}

interface GoogleSheetRow {
  c: Array<GoogleSheetCell | null>;
}

interface GoogleSheetResponse {
  table: {
    rows: GoogleSheetRow[];
  };
}

interface CategoryData {
  allTitle: string | number | null;
  allDescription: string | number | null;
}

// Core function to fetch raw sheet data
async function fetchGoogleSheetRaw(
  sheetName: string, 
  spreadsheetId?: string
): Promise<(string | number | null)[][]> {
  const sheetId = spreadsheetId || process.env.NEXT_PUBLIC_GOOGLESHEETS_ID;
  if (!sheetId) {
    throw new Error('Spreadsheet ID not configured');
  }

  if (!sheetName?.trim()) {
    throw new Error('Sheet name is required');
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Sheet "${sheetName}" not found or inaccessible`);
    }

    const text = await res.text();

    if (!text.startsWith('/*O_o*/')) {
      throw new Error(`Invalid response format for sheet "${sheetName}"`);
    }

    const jsonText = text.substring(47, text.length - 2);
    let json: GoogleSheetResponse;
    
    try {
      json = JSON.parse(jsonText);
    } catch (parseError) {
      throw new Error(`Failed to parse response for sheet "${sheetName}"`);
    }

    if (!json?.table?.rows) {
      throw new Error(`Invalid data structure for sheet "${sheetName}"`);
    }

    const rows = json.table.rows.map(row => 
      row?.c?.map(cell => cell?.v ?? null) ?? []
    );

    if (rows.length === 0) {
      throw new Error(`Sheet "${sheetName}" is empty`);
    }

    return rows;

  } catch (error:any) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout while fetching sheet "${sheetName}"`);
    }
    
    console.error(`Error fetching sheet "${sheetName}":`, error);
    throw error instanceof Error ? error : new Error(`Failed to fetch sheet "${sheetName}"`);
  }
}

// Validate sheet name matches expected
function validateSheetName(
  rows: (string | number | null)[][],
  expectedName: string,
  namePosition: { row: number; col: number }
): boolean {
  const actualName = rows[namePosition.row]?.[namePosition.col];
  
  if (actualName !== expectedName) {
    console.warn(`Sheet name mismatch. Expected: "${expectedName}", Got: "${actualName}"`);
    return false;
  }
  
  return true;
}

// Clean product data by removing first 5 columns
export function cleanProductData(data: (string | number | null)[][]): (string | number | null)[][] {
  return data.map(row => row.slice(5));
}

// Filter out header rows
function filterHeaderRows(rows: (string | number | null)[][]): (string | number | null)[][] {
  return rows.filter((row, index) => {
    if (index === 0 && (row[0] === "Image" || row[0] === "Id category")) {
      return false;
    }
    return true;
  });
}

// Main function to get Google Sheet data with validation
export async function getGoogleSheetData(sheetName: string): Promise<(string | number | null)[][] | null> {
  try {
    const rawRows = await fetchGoogleSheetRaw(sheetName);
    const cleanedRows = cleanProductData(rawRows);
    // Validate sheet name (position: first row, second-to-last column)
    const namePosition = { row: 0, col: rawRows[0].length - 2 };
    const isValid = validateSheetName(rawRows, sheetName, namePosition);
    if (!isValid) {
      return null;
    }

    return cleanedRows;

  } catch (error) {
    console.error(`Error in getGoogleSheetData for "${sheetName}":`, error);
    throw new Error('Error receiving data');
  }
}

// Get category data with specific processing
export async function getAllCategoriesDataById(
  sheetName: string, 
  spreadsheetId: string
): Promise<CategoryData | null> {
  
  try {
    const rawRows = await fetchGoogleSheetRaw(sheetName, spreadsheetId);
    const cleanedRows = cleanProductData(rawRows);
    
    if (cleanedRows.length < 2) {
      throw new Error(`Sheet "${sheetName}" doesn't have enough data`);
    }


    // Validate sheet name (position: second row, second-to-last column of cleaned data)
    const namePosition = { row: 1, col: cleanedRows[0].length - 2 };
    const isValid = validateSheetName(cleanedRows, sheetName, namePosition);
    
    if (!isValid) {
      console.warn(`⚠️ Sheet name validation failed for "${sheetName}"`);
      console.warn(`   Expected: "${sheetName}"`);
      console.warn(`   Found: "${cleanedRows[namePosition.row]?.[namePosition.col]}"`);
      return null;
    }

    const filteredRows = filterHeaderRows(cleanedRows);
    
    if (filteredRows.length === 0) {
      throw new Error(`No data rows found in sheet "${sheetName}"`);
    }

    const firstDataRow = filteredRows[0];
    const allTitle = firstDataRow[firstDataRow.length - 4] ?? null;
    const allDescription = firstDataRow[firstDataRow.length - 3] ?? null;

    return {
      allTitle,
      allDescription
    };

  } catch (error) {
    console.error(`❌ Error in getAllCategoriesDataById for "${sheetName}":`, error);
    throw new Error('Error receiving data');
  }
}

// Batch fetch multiple sheets
export async function getAllSheetsByName(
  sheetIds: string[]
): Promise<Record<string, (string | number | null)[][]>> {
  if (!Array.isArray(sheetIds) || sheetIds.length === 0) {
    return {};
  }

  const results = await Promise.allSettled(
    sheetIds.map(async (sheetId): Promise<[string, (string | number | null)[][]]> => {
      try {
        const rows = await getGoogleSheetData(sheetId);
        
        if (!rows) {
          return [sheetId, []];
        }
        const filteredRows = filterHeaderRows(rows);
        return [sheetId, filteredRows];

      } catch (error) {
        console.error(`Failed to fetch sheet "${sheetId}":`, error);
        return [sheetId, []];
      }
    })
  );

  // Process results and handle any rejections
  const allData: Record<string, (string | number | null)[][]> = {};
  
  results.forEach((result, index) => {
    const sheetId = sheetIds[index];
    
    if (result.status === 'fulfilled') {
      const [id, data] = result.value;
      allData[id] = data;
    } else {
      console.error(`Promise rejected for sheet "${sheetId}":`, result.reason);
      allData[sheetId] = [];
    }
  });

  return allData;
}

// Utility function to get multiple category data
export async function getMultipleCategoriesData(
  sheetNames: string[],
  spreadsheetId: string
): Promise<Record<string, CategoryData | null>> {
  const results = await Promise.allSettled(
    sheetNames.map(async (sheetName): Promise<[string, CategoryData | null]> => {
      try {
        const data = await getAllCategoriesDataById(sheetName, spreadsheetId);
        return [sheetName, data];
      } catch (error) {
        console.error(`Failed to fetch category data for "${sheetName}":`, error);
        return [sheetName, null];
      }
    })
  );

  const categoryData: Record<string, CategoryData | null> = {};
  
  results.forEach((result, index) => {
    const sheetName = sheetNames[index];
    
    if (result.status === 'fulfilled') {
      const [name, data] = result.value;
      categoryData[name] = data;
    } else {
      categoryData[sheetName] = null;
    }
  });

  return categoryData;
}

// Add this new function to your googleSheets file
export async function getAllProductSheetsByName(
  sheetIds: string[],
  spreadsheetId: string
): Promise<Record<string, (string | number | null)[][]>> {
  if (!Array.isArray(sheetIds) || sheetIds.length === 0) {
    return {};
  }

  const results = await Promise.allSettled(
    sheetIds.map(async (sheetId): Promise<[string, (string | number | null)[][]]> => {
      try {
        // Use your existing getGoogleSheetData but pass spreadsheetId to fetchGoogleSheetRaw
        const rawRows = await fetchGoogleSheetRaw(sheetId, spreadsheetId);
        const cleanedRows = cleanProductData(rawRows);
        
        // Validate sheet name
        const namePosition = { row: 0, col: rawRows[0].length - 2 };
        const isValid = validateSheetName(rawRows, sheetId, namePosition);
        
        if (!isValid) {
          return [sheetId, []];
        }

        const filteredRows = filterHeaderRows(cleanedRows);
        return [sheetId, filteredRows];

      } catch (error) {
        console.error(`Failed to fetch sheet "${sheetId}":`, error);
        return [sheetId, []];
      }
    })
  );

  const allData: Record<string, (string | number | null)[][]> = {};
  
  results.forEach((result, index) => {
    const sheetId = sheetIds[index];
    
    if (result.status === 'fulfilled') {
      const [id, data] = result.value;
      allData[id] = data;
    } else {
      console.error(`Promise rejected for sheet "${sheetId}":`, result.reason);
      allData[sheetId] = [];
    }
  });

  return allData;
}




