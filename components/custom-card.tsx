import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

interface ProductCardProps {
  data: [string, string, number, string, string, string, string, string];
}

const statusColors: Record<string, string> = {
  green: "#16A34A",
  yellow: "#FFC107",
  red: "#DC3545",
};

export default function CustomCard({ data }: ProductCardProps) {
  const [
    imageUrl = "/placeholder.svg",
    title = "No title",
    preview = 0,
    active = "red",
    status = "no",
    link = "#",
    whatsAppOrTelegram = "WhatsApp",
    isFull = "no",
  ] = data;
  const isAvailable = status?.toLowerCase() === "yes";
  const activeColor = statusColors[isAvailable ? "green" : "red"];
  const [isBlocked, setIsBlocked] = useState(false);

  const handleClick = (e: any) => {
    if (isFull) {
      e.preventDefault();
      setIsBlocked(true);
    }
  };

  if (isBlocked) {
    return (
      <div className="relative flex gap-3 bg-gray-100 rounded-lg overflow-hidden border border-red-300 p-4 text-red-600 shadow-sm">
        {/* Close button */}
        <button
          onClick={() => setIsBlocked(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-sm font-bold"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex flex-col justify-center items-center w-full text-center">
          <p className="font-semibold text-sm">{title} is full</p>
          <p className="text-xs text-gray-600">Please try another group</p>
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <Link
        href={link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        passHref
        className="block"
        onClick={handleClick}
      >
        <div className="flex gap-3 bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
          {/*<Link href={link || "#"} target="_blank" rel="noopener noreferrer" passHref className="block">*/}
          <div className="relative h-24 w-24 pr-4 flex-shrink-0">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title || "no title"}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          {/*</Link>*/}

          {/* Right Content */}
          <div className="flex-1 p-3">
            <div className="flex flex-col justify-between h-full">
              {/* Title */}
              <div className="flex justify-between">
                <h3 className="font-medium mb-1">{title || "No title"}</h3>
                {whatsAppOrTelegram === "WhatsApp" ? (
                  <Image
                    src="/whatsapp-color-svgrepo-com.svg"
                    alt={"whatsAppLink"}
                    width={16}
                    height={16}
                  />
                ) : (
                  <Image
                    src="/telegram-svgrepo-com.svg"
                    alt={"tgLink"}
                    width={18}
                    height={18}
                  />
                )}
              </div>

              {/* Availability + Status dot */}
              <div className="flex items-center gap-2 justify-between">
                <div className="flex flex-row gap-2">
                  {isAvailable ? (
                    <div className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded">
                      Active
                    </div>
                  ) : (
                    <div className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded">
                      Not Active
                    </div>
                  )}
                  {whatsAppOrTelegram === "WhatsApp" ? (
                    <div className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded">
                      {/*{isAvailable ? "Active" : "Not Active"}*/}
                      WhatsApp Community
                    </div>
                  ) : (
                    <div className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                      {/*{isAvailable ? "Active" : "Not Active"}*/}
                      Telegram Community
                    </div>
                  )}
                </div>

                <div className="flex gap-2 items-center">
                  <div
                    aria-label="Status indicator"
                    role="status"
                    className="h-[6px] w-[6px] rounded-full ripple-wrapper m-1"
                    style={{
                      backgroundColor: activeColor,
                      ["--ripple-color" as any]: activeColor,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
