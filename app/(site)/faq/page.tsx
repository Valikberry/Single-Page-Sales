import Header from "@/components/header";
import Footer from "@/components/footer";
import FAQ from "@/components/FAQ";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="px-4 py-4">
        <div className="container mx-auto max-w-md px-4">
          <div className="bg-green-50 rounded-lg overflow-hidden border border-green-200 hover:shadow-md transition-shadow px-3 py-2">
            <h1 className="text-xl font-bold text-green-800">FAQ</h1>

            <p className="text-black-700 text-sm">Frequently Asked Questions</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto max-w-md">
        <h1 className="text-xl font-bold text-center"> General FAQ</h1>
      </div>
      <FAQ />
      <div className="container mx-auto max-w-md">
        <h1 className="text-xl font-bold text-center"> Premium service FAQ</h1>
      </div>
      <FAQ isProduct={true} />
      <Footer />
    </main>
  );
}
