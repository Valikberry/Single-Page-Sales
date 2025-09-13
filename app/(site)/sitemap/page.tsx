import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { getSheetNamesWithJ2Values } from "@/lib/getIdNameCategory";
import SitemapCategory from "@/components/SitemapCategory";

export default async function SitemapPage() {
  const communityCategories = await getSheetNamesWithJ2Values(
    process.env.NEXT_PUBLIC_GOOGLESHEETS_ID!
  );
  return (
    <main className="flex min-h-screen flex-col">
      <Header />

       <section className="px-4 py-8">
        <div className="container mx-auto max-w-md px-4">
          <h1 className="text-2xl font-bold mb-4">Sitemap</h1>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Pages</h2>
            <ul className="list-none pl-4 space-y-1">
              <li>
                <Link href="/" className="underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Social media</h2>
            <ul className="list-none pl-4 space-y-1">
              <li>
                <a
                  href="https://www.youtube.com/@sponsoredjobalert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-black-700"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href=" https://www.facebook.com/profile.php?id=61556467616225"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-black-700"
                >
                  Facebook
                </a>
              </li>
              {/* <li>
                <a
                  href="https://www.reddit.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-black-700"
                >
                  Reddit
                </a>
              </li> */}
              <li>
                <a
                  href="https://www.tiktok.com/@sponsoredjobalert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-black-700"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/sponsoredjobA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-black-700"
                >
                  x/twitter
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* Community Categories */}
            <div className="flex-1">
              <SitemapCategory
                title="Community Categories"
                items={communityCategories}
                basePath="community"
              />
            </div>

            {/* Product Categories */}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
