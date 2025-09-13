"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import type { Category } from "@/lib/types";

interface Props {
  sheets: Category[];
  basePath?: string; //
}

export default function ProductCategoryFilter({ sheets, basePath = "" }: Props) {
  const router = useRouter();
  const params = useParams();

  // In app/[category]/page.tsx, params.category will be string | undefined
  const activeCategory = typeof params?.category === "string" ? params.category : "all";

  const handleClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  return (
    <div className="border-solid border-2 rounded-lg overflow-hidden">
      <ScrollArea className="relative overflow-hidden w-full whitespace-nowrap">
        <div className="flex">
          {[{ id: "all", name: "All" }, ...sheets].map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`px-4 py-2 text-sm border-none ${
                activeCategory === category.id
                  ? "bg-green-50 hover:bg-green-700 text-green-700 hover:text-white"
                  : "bg-white hover:bg-green-700 text-gray-700 hover:text-white"
              }`}
              onClick={() => handleClick(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
