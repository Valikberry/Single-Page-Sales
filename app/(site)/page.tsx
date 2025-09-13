"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CardsLayer from "@/components/CardsLayer";
import CategoryFilterWrapper from "@/components/CategoryFilterWrapper";
import MainMenuCards from "@/components/MenuCards";
import { useSheets } from "@/context/AppContext";
import ProductCardLayer from "@/components/ProductCardLayer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, X } from "lucide-react";
import router from "next/router";
import toast from "react-hot-toast";
import { useAfricanCountry } from "@/hooks/useAfricanCountry";
import { EmailModal } from "./products/[category]/[productId]/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import React from "react";
import { SlidingImageCarousel } from "@/components/SlidingImages";

export default function CategoryPage() {
  // Load Flutterwave script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
  const { category } = useParams(); // get category from dynamic route
  const sheetId = typeof category === "string" ? category : "all";
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [product, setProduct] = useState<any>(null);

  const [sheetData, setSheetData] = useState([]);
  const { location } = useAfricanCountry();

  useEffect(() => {
    async function fetchData() {
      setProductLoading(true);
      try {
        const res = await fetch(`/api/products?category=all`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Category "${category}" not found`);
          }
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        if (!data.sheetData || !Array.isArray(data.sheetData)) {
          throw new Error("Invalid data format received from API");
        }

        setSheetData(data.sheetData);
        if (data.sheetData) {
          const foundProduct = data.sheetData[0];
          setProduct({
            id: foundProduct[6],
            image: foundProduct[0] || "",
            name: foundProduct[1] || "",
            description: foundProduct[3] || "",
            subTitle: foundProduct[2] || "",
            price: foundProduct[4] || "0",
            discountPercentage: Number(foundProduct[5]),
            image2: foundProduct[7],
            image3: foundProduct[8],
            link: foundProduct[9],
          });
        }
      } catch (err) {
        console.error("Failed to fetch product data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setProductLoading(false);
      }
    }

    fetchData();
  }, [sheetId]);

  const handleBuyNowClick = () => {
    setShowEmailModal(true);
  };

  const handleFlutterwavePayment = async (email: string) => {
    if (!product) return;

    setPaymentLoading(true);
    toast.loading("Initializing payment...", { id: "payment" });

    try {
      // Generate a unique transaction reference
      const tx_ref = `${product.id}-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      const totalAmount = discountedPrice;
      const amount = await convertCurrency(
        totalAmount,
        "USD",
        location?.currency || "NGN"
      );
      const paymentData = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
        tx_ref: tx_ref,
        amount: amount,
        currency: location?.currency,
        country: location?.countryCode,
        //   currency: 'NGN',
        // country: "NG",
        customer: {
          email: email,
          phone_number: "1234567890",
          name: "Customer Name",
        },
        customizations: {
          title: "Product Purchase",
          description: `Payment for ${product.name}`,
          logo: product.image,
        },
        redirect_url: `${window.location.origin}/success?tx_ref=${tx_ref}`,
        callback: (response: any) => {
          if (response.status === "successful") {
            verifyPayment(response.transaction_id, tx_ref, email);
          } else {
            toast.error("Payment was not successful", { id: "payment" });
            setPaymentLoading(false);
            setShowEmailModal(false);
          }
        },
        onclose: () => {
          toast.dismiss("payment");
          setPaymentLoading(false);
          setShowEmailModal(false);
        },
      };

      if (window.FlutterwaveCheckout) {
        window.FlutterwaveCheckout(paymentData);
        setShowEmailModal(false);
      } else {
        throw new Error("Flutterwave checkout not loaded");
      }
    } catch (err) {
      console.error("Payment initialization error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage, { id: "payment" });
      setPaymentLoading(false);
      setShowEmailModal(false);
    }
  };

  const verifyPayment = async (
    transactionId: string,
    txRef: string,
    email: string
  ) => {
    try {
      const response = await fetch("/api/verify-flutterwave-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          tx_ref: txRef,
          product_id: product?.id,
          product_name: product?.name,
          customer_email: email,
          amount: (
            Number(product?.price) *
            (1 - (product?.discountPercentage || 0) / 100)
          ).toFixed(2),
          quantity: 1,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          "Payment successful! The product will be sent to your email.",
          {
            id: "payment",
          }
        );
        setTimeout(() => {
          router.push(`/success?tx_ref=${txRef}&link=${product?.link}`);
        }, 1000);
      } else {
        toast.error("Payment verification failed", { id: "payment" });
      }
    } catch (error) {
      toast.error("Error verifying payment", { id: "payment" });
    } finally {
      setPaymentLoading(false);
    }
  };

  const discountedPrice =
    Number(product?.price) * (1 - (product?.discountPercentage || 0) / 100);
  const totalPrice = discountedPrice?.toFixed(2);

  const handleEmailSubmit = (email: string) => {
    setCustomerEmail(email);
    handleFlutterwavePayment(email);
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      <span className="ml-2 text-gray-600">Loading products...</span>
    </div>
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (!product) return;
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-grow">
        <Header />

        <div className="container mx-auto max-w-md px-4 py-3">
          <div className="container mx-auto max-w-md">
            <div className="bg-green-50 rounded-lg overflow-hidden border border-green-200 hover:shadow-md transition-shadow px-3 py-2">
              <h1 className="text-xl font-bold text-green-800 mb-2">
                Get Hired Abroad!
              </h1>
              <p className="text-black-700 text-sm">
                Discover how we help ambitious professionals secure rewarding
                opportunities overseas. Watch the video to see how our process
                works and explore our services designed to make your journey
                abroad smooth and successful.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-md px-4 py-4">
          <MainMenuCards />

          {productLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <ProductCardLayer data={sheetData} category={sheetId} openModal={openModal}/>
              {product && (
                <div className="mt-8 pb-4 space-y-3">
                  <Button
                    onClick={handleBuyNowClick}
                    disabled={paymentLoading}
                    className="w-full bg-green-600 hover:bg-green-700 py-3"
                  >
                    {paymentLoading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="h-5 w-5 mr-2" />
                    )}
                    Buy Now - ${totalPrice}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        <DetailsModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          product={product}
          totalPrice={totalPrice}
          handleBuyNowClick={handleBuyNowClick}
          paymentLoading={paymentLoading}
        />
        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
          loading={paymentLoading}
        />
      </div>
      <Footer />
    </main>
  );
}

async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
) {
  try {
    const res = await fetch("/api/convert-currency", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        fromCurrency,
        toCurrency,
      }),
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    return data.data?.convertedAmount;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    throw err;
  }
}

const DetailsModal: React.FC<any> = ({
  product,
  paymentLoading,
  handleBuyNowClick,
  totalPrice,
  isModalOpen,
  closeModal,
}) => {
  return (
    <>
      {/* Your existing link - modified to open modal */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Content - Now with proper height constraints and scrolling */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header - Fixed at top */}
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                Product details
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="py-1">
                {/* Fixed Image Container - Now with consistent padding */}
                <div className="px-3 mb-4">
                  <SlidingImageCarousel product={product} />
                </div>

                {/* Content Section */}
                <div className="px-4 py-4">
                  <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
                  <p className="text-gray-600 mb-3">{product.subTitle}</p>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-baseline gap-2">
                      {/* Discounted price in green */}
                      <span className="text-2xl font-bold text-green-600">
                        $
                        {(
                          Number(product.price) *
                          (1 - product.discountPercentage / 100)
                        ).toFixed(2)}
                      </span>

                      {/* Original price in strikethrough */}
                      {product.discountPercentage > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Tabs defaultValue="Description" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="nutrition">Quick info</TabsTrigger>
                      <TabsTrigger value="Description">Description</TabsTrigger>
                    </TabsList>

                    <TabsContent value="nutrition" className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        {product.proDetails && product.proDetails.length > 0 ? (
                          product.proDetails.map(
                            (detail: any, index: number) => (
                              <div
                                className="bg-gray-50 p-3 rounded-lg"
                                key={index}
                              >
                                <div className="text-sm text-gray-500">
                                  {detail.key}
                                </div>
                                <div className="text-lg font-semibold">
                                  {detail.value}
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <div className="col-span-2 text-center py-8">
                            <p className="text-gray-500">
                              No details available
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="Description" className="pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        <span>
                          {product.description
                            .split("\n")
                            .map((line: string, index: number) => (
                              <React.Fragment key={index}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                        </span>
                      </p>
                    </TabsContent>
                  </Tabs>
                  <div className="mt-8 pb-4 space-y-3">
                    <Button
                      onClick={handleBuyNowClick}
                      disabled={paymentLoading}
                      className="w-full bg-green-600 hover:bg-green-700 py-3"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Buy Now - ${totalPrice}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
