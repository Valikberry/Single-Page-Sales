"use client";
import CategoryFilter from "./category-filter";

export default function CategoryFilterWrapper({
  basePath = "",
  sheets = [],
}: {
  defaultActiveCategory?: string;
  basePath?: string;
  sheets: any[];
}) {
  return (
    <CategoryFilter
      basePath={basePath}
      sheets={sheets}
    />
  );
}
