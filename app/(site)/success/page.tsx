"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { trackPurchase } from "@/utils/facebookPixel";

interface PurchaseData {
  transaction_id: string;
  tx_ref: string;
  amount: string;
  currency: string;
  customer: {
    email: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
    link: string;
    quantity: number;
  };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const link = searchParams.get("link");
  const txRef = searchParams.get("tx_ref");

  // Add states for purchase data and pixel tracking
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [pixelTracked, setPixelTracked] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch purchase data and track Facebook Pixel event
  useEffect(() => {
    const fetchPurchaseData = async () => {
      if (!txRef) {
        setDataLoaded(true);
        return;
      }

      try {
        const response = await fetch(
          `/api/get-purchase-details?tx_ref=${txRef}`
        );
        const result = await response.json();

        if (result.success) {
          setPurchaseData(result.data);
        }
      } catch (error) {
        console.error("Error fetching purchase data:", error);
      } finally {
        setDataLoaded(true);
      }
    };

    fetchPurchaseData();
  }, [txRef]);

  // Track Facebook Pixel Purchase event when purchase data is available
  useEffect(() => {
    if (purchaseData && !pixelTracked) {
      // Track the purchase event
      trackPurchase({
        value: parseFloat(purchaseData.amount),
        currency: purchaseData.currency,
        content_ids: [purchaseData.product.id],
        content_name: purchaseData.product.name,
        content_type: "product",
        num_items: purchaseData.product.quantity,
      });

      setPixelTracked(true);
    }
  }, [purchaseData, pixelTracked]);

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="text-center py-8">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.you will
          receive product email in 10minutes.
        </p>

        <div className="space-y-3">
          {/* Use link from purchase data if available, otherwise fall back to URL param */}
          {(purchaseData?.product.link || link) && (
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link
                href={purchaseData?.product.link || link || "#"}
                target="_blank"
              >
                Get the product
              </Link>
            </Button>
          )}
          <Button asChild className="w-full">
            <Link href="/products/all">
              <Package className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-grow">
        <Header />
        <div className="container mx-auto max-w-md px-4 py-8">
          <Suspense
            fallback={<div className="text-center py-8">Loading...</div>}
          >
            <SuccessContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </main>
  );
}
