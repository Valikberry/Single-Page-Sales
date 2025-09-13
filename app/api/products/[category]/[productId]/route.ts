// app/api/products/[category]/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSheetNamesWithJ2Values } from "@/lib/getIdNameCategory";
import { getAllProductSheetsByName } from "@/lib/googleSheets";
import { getNutritionDetailsByProduct } from "@/lib/getNutritionDetails"; // Add this import

const SPREADSHEET_ID = process.env.GOOGLESHEETS_TODAYPICKS_ID!;

interface RouteParams {
  params: {
    category: string;
    productId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { category, productId } = params;

    // Get all available categories
    const categoryMeta = await getSheetNamesWithJ2Values(SPREADSHEET_ID);

    let categoriesToSearch: string[] = [];
    let categoryName = "";

    if (category === "all") {
      // If category is "all", search across all categories
      categoriesToSearch = categoryMeta.map(
        (cat: { id: string; name: string }) => cat.id
      );
      categoryName = "All Categories";
    } else {
      // Validate specific category exists
      const categoryExists = categoryMeta.some(
        (cat: { id: string; name: string }) => cat.id === category
      );

      if (!categoryExists) {
        console.error(`Invalid category: ${category}`);
        return NextResponse.json(
          { error: `Category "${category}" not found` },
          { status: 404 }
        );
      }

      categoriesToSearch = [category];
      const categoryInfo = categoryMeta.find(
        (cat: { id: string; name: string }) => cat.id === category
      );
      categoryName = categoryInfo?.name || category;
    }

    // Fetch sheet data for the categories
    const data = await getAllProductSheetsByName(
      categoriesToSearch,
      SPREADSHEET_ID
    );

    if (!data) {
      console.error(
        `No data found for categories: ${categoriesToSearch.join(", ")}`
      );
      return NextResponse.json({ error: `No products found` }, { status: 404 });
    }

    // Search for the product across all relevant categories
    let foundProduct = null;
    let foundInCategory = "";
    let foundCategoryName = "";

    const ID_COLUMN_INDEX = 6;

    // Search through each category's data
    for (const searchCategory of categoriesToSearch) {
      const products = data[searchCategory];

      if (products && products.length > 0) {
        const productIndex = products.findIndex((product) => {
          const productIdFromSheet = product[ID_COLUMN_INDEX];
          return String(productIdFromSheet) === String(productId);
        });

        if (productIndex !== -1) {
          foundProduct = products[productIndex];
          foundInCategory = searchCategory;

          // Get the category name for the found category
          const categoryInfo = categoryMeta.find(
            (cat: { id: string; name: string }) => cat.id === searchCategory
          );
          foundCategoryName = categoryInfo?.name || searchCategory;
          break;
        }
      }
    }

    if (!foundProduct) {
      console.error(
        `Product not found: ${productId} in categories: ${categoriesToSearch.join(
          ", "
        )}`
      );
      return NextResponse.json(
        { error: `Product "${productId}" not found` },
        { status: 404 }
      );
    }

    const parseDiscountInfo = (product: any[]) => {
      // Assuming discount percentage is in column 10 (adjust index based on your sheet structure)
      const discountPercentage = product[5] ? Number(product[5]) : null;

      return {
        discountPercentage:
          discountPercentage &&
          !isNaN(discountPercentage) &&
          discountPercentage > 0
            ? discountPercentage
            : null,
      };
    };

    // Parse discount information
    const discountInfo = parseDiscountInfo(foundProduct);
    const nutritionDetails = await getNutritionDetailsByProduct(
      SPREADSHEET_ID,
      productId
    );


    const productData = {
      id: foundProduct[6], 
      image: foundProduct[0] || "",
      name: foundProduct[1] || "",
      description: foundProduct[3] || "",
      subTitle: foundProduct[2] || "",
      price: foundProduct[4] || "0",
      category: foundInCategory, 
      categoryName: foundCategoryName, 
      discountPercentage: discountInfo.discountPercentage,
      image2: foundProduct[7],
      image3: foundProduct[8],
      link: foundProduct[9],
      proDetails: nutritionDetails || [], 
    };



    return NextResponse.json({
      product: productData,
      category: foundInCategory, 
      categoryName: foundCategoryName, 
      searchedInAllCategories: category === "all", 
    });
  } catch (error) {
    console.error("API Error in product details route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch product details",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
