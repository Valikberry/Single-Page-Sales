// app/products/page.tsx (optional - redirects to all products)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductsMainPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to show all products
    router.replace("/products/all");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Redirecting to products...</span>
    </div>
  );
}