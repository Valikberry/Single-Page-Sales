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

export interface NutritionDetail {
  key: string;
  value: string;
}

// Core function to fetch raw sheet data (reusing your pattern)
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

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout while fetching sheet "${sheetName}"`);
    }
    
    console.error(`Error fetching sheet "${sheetName}":`, error);
    throw error instanceof Error ? error : new Error(`Failed to fetch sheet "${sheetName}"`);
  }
}

// Get nutrition details from the "details" sheet
export async function getNutritionDetails(
  spreadsheetId: string
): Promise<NutritionDetail[] | null> {
  try {
   
    
    const rawRows = await fetchGoogleSheetRaw('details', spreadsheetId);
    
    if (!rawRows || rawRows.length === 0) {
      console.warn('No data found in details sheet');
      return null;
    }

 

    const nutritionDetails: NutritionDetail[] = [];

    // Process all rows starting from index 1 to skip header row
    // Changed: use <= instead of < to include the last row
    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      
      // Assuming columns A (index 0) and B (index 1) contain key and value
      const key = row[0];
      const value = row[1];
      
      // More robust check for valid data
      if (key !== null && key !== undefined && key !== '' && 
          value !== null && value !== undefined && value !== '') {
        nutritionDetails.push({
          key: String(key).trim(),
          value: String(value).trim()
        });
      }
    }


    return nutritionDetails.length > 0 ? nutritionDetails : null;

  } catch (error) {
    console.error('❌ Error fetching nutrition details:', error);
    return null;
  }
}

// Function for product-specific nutrition details
// Fixed: ProductID is now in column 3 (index 2)
export async function getNutritionDetailsByProduct(
  spreadsheetId: string,
  productId: string
): Promise<NutritionDetail[] | null> {
  try {
  
    
    const rawRows = await fetchGoogleSheetRaw('details', spreadsheetId);
    
    if (!rawRows || rawRows.length === 0) {
      console.warn('No data found in details sheet');
      return null;
    }

    const nutritionDetails: NutritionDetail[] = [];

    // Process all rows including the last one
    // Sheet structure: Key (col A) | Value (col B) | ProductID (col C)
    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      
      // ProductID is in column 3 (index 2)
      const rowProductId = row[2];
    
      
      // Check if this row is for the specific product
      if (rowProductId !== null && rowProductId !== undefined && 
          String(rowProductId).trim() === String(productId).trim()) {
        
        const key = row[0];   // First column is key
        const value = row[1]; // Second column is value
        
        // More robust validation
        if (key !== null && key !== undefined && key !== '' && 
            value !== null && value !== undefined && value !== '') {
          nutritionDetails.push({
            key: String(key).trim(),
            value: String(value).trim()
          });
        }
      }
    }
    return nutritionDetails.length > 0 ? nutritionDetails : null;

  } catch (error) {
    console.error(`❌ Error fetching nutrition details for product ${productId}:`, error);
    return null;
  }
}