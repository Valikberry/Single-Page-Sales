"use client";

import Link from "next/link";

export default function SitemapCategory({
  title,
  items,
  basePath,
}: {
  title: string;
  items: { id: string; name: string }[];
  basePath: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="whitespace-nowrap text-lg font-semibold">
        Job Communities{" "}
      </h2>

      <div className="overflow-hidden transition-all duration-300max-h-96 opacity-100 mt-2">
        <ul className="list-none pl-4 space-y-1">
          {items.map((item) => (
            <li key={item.id} className="">
              <Link
                href={`/${basePath}?category=${item.id}`}
                className="underline"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
