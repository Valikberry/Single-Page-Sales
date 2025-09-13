"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCardLayer from "@/components/ProductCardLayer";
import ProductCategoryFilterWrapper from "@/components/ProductCategoryFilterWrapper";
import { useProductSheets } from "@/context/AppContext";

export default function ProductCategoryPage() {
  const { category } = useParams();
  const sheetId = typeof category === "string" ? category : "all";

  const [sheetData, setSheetData] = useState<(string | number | null)[][]>([]);
  const [currentName, setCurrentName] = useState<string>("");
  const [currentDesc, setCurrentDesc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { sheets } = useProductSheets();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/products?category=${encodeURIComponent(sheetId)}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Category "${category}" not found`);
          }
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        if (!data.sheetData || !Array.isArray(data.sheetData)) {
          throw new Error("Invalid data format received from API");
        }

        setSheetData(data.sheetData);
        setCurrentName(data.currentName || "");
        setCurrentDesc(data.currentDesc || "");
      } catch (err) {
        console.error("Failed to fetch product data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";

        if (errorMessage.includes("not found")) {
          setError(
            `No products found in "${category}" category. Please check back later.`
          );
        } else {
          setError(`Failed to load products: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [sheetId, category]);

  const getDisplayTitle = () => {
    if (sheetId === "all") {
      return currentName || "All Products";
    }
    return currentName || category || "Products";
  };

  const getDisplayDescription = () => {
    if (sheetId === "all") {
      return currentDesc || "Browse all available products";
    }
    return currentDesc || `Explore our ${category} collection`;
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-grow">
        <Header />

        {/* Hero Section */}
        <div className="container mx-auto max-w-md px-2 py-3">
          <div className="container mx-auto max-w-md">
            <div className="bg-green-50 rounded-lg overflow-hidden border border-green-200 hover:shadow-md transition-shadow px-3 py-2">
              <h1 className="text-xl font-bold text-green-800 mb-2">
                {sheetId === "all" ? "Get Hired Abroad!" : getDisplayTitle()}
              </h1>
              <p className="text-gray-700 text-sm">
                {sheetId === "all"
                  ? "Find products that helps your application for visa sponsored Jobs"
                  : getDisplayDescription()}
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="container mx-auto max-w-md px-4 py-4">
          <ProductCategoryFilterWrapper
            defaultActiveCategory={sheetId}
            basePath="products"
            sheets={sheets}
          />
        </div>

        {/* Content Section */}
        <div className="container mx-auto max-w-md px-4 py-2">
          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mt-1 text-red-600 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium">Unable to load products</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Product Cards */}
          {!loading && !error && (
            <div className="pt-2">
              {sheetData.length > 0 ? (
                <ProductCardLayer data={sheetData} category={sheetId} />
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2a2 2 0 00-2 2v3a2 2 0 01-2 2v-3a2 2 0 00-2-2H8a2 2 0 00-2 2v3a2 2 0 01-2-2v-3a2 2 0 00-2-2H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    There are no products available in this category at the
                    moment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
