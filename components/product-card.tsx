import Link from "next/link";
import Image from "next/image";



export default function ProductCard({
  product,
  openModal,
}: any) {
  const [
    imageUrl, // 0
    title,
    subTitle, // 1
    description,
    price,
    discount,
    id,
  ] = product;

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow h-72">
      <Link
        onClick={openModal}
        href={`#`}
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative h-52 w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title || "no title"}
            fill
            className="object-cover"
          />
          {Number(discount) > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{Number(discount)}%
            </div>
          )}
        </div>

        <div className="px-3 hide-padding-after-400 pt-1.5">
          <h3 className="font-medium text-sm line-clamp-1">
            {title || "No title"}
          </h3>

          <div className="flex items-center my-1">
            <div className="text-xs text-gray-500 line-clamp-1">
              {subTitle || "No subTitle"}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 font-bold text-green-600">
              {Number(discount) > 0 ? (
                <>
                  {/* Discounted price in green */}
                  <span className="font-bold text-green-600">
                    ${(Number(price) * (1 - Number(discount) / 100)).toFixed(2)}
                  </span>

                  {/* Original price with strikethrough */}
                  <span className="text-xs text-gray-400 line-through ml-2">
                    ${Number(price).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-bold text-green-600">
                  ${Number(price).toFixed(2)}
                </span>
              )}
              {/*${parseFloat(price || "0").toFixed(2)}*/}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
