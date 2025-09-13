"use client";
import ProductCategoryFilter from "./category-filter product";

export default function ProductCategoryFilterWrapper({
  basePath = "",
  sheets = [],
}: {
  defaultActiveCategory?: string;
  basePath?: string;
  sheets: any[];
}) {
  return (
    <ProductCategoryFilter
      basePath={basePath}
      sheets={sheets}
    />
  );
}
