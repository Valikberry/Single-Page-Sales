import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto max-w-md px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1.5">
              <Image src="/logo.png" alt={"Logo"} width={40} height={40} />
            <div className=" font-bold text-sm py-[1px]">Sponsored Job Alert</div>
            </Link>
          </div>

          {/* <div className="flex items-center gap-2">
            <Link  href="/products">
              <button className="flex flex-row hover:bg-accent hover:text-accent-foreground py-2 pl-1 gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none">
                <h3 className="">Apply fast</h3>

                <Image
                  width={20}
                  height={20}
                  src="/click-2384.svg"
                  alt={"Apply fast"}
                />
              </button>
            </Link>
          </div> */}
        </div>
      </div>
    </header>
  );
}
