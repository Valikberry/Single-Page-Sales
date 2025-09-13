"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  CreditCard,
  Mail,
  X,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlidingImageCarousel } from "@/components/SlidingImages";
import toast, { Toaster } from "react-hot-toast";
import React from "react";
import { useAfricanCountry } from "@/hooks/useAfricanCountry";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

interface NutritionDetail {
  key: string;
  value: string;
}

interface Product {
  id: string;
  image: string;
  name: string;
  description: string;
  subTitle: string;
  price: string;
  rating: number | null;
  contactMethod: string;
  productUrl: string;
  inStock: string;
  category: string;
  categoryName: string;
  discountPercentage: number;
  image2?: string;
  image3?: string;
  proDetails: NutritionDetail[];
  link: string;
}

// Email Modal Component
export function EmailModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    onSubmit(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Enter Your Email
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Please provide your email address where you'll receive the product
              after purchase.
            </p>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  emailError ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="your@email.com"
                disabled={loading}
                required
              />
              {emailError && (
                <p className="text-sm text-red-600">{emailError}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 p-6 pt-0">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
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
  } finally {
  }
}

export default function ProductDetailsPage() {
  const { category, productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const { location } = useAfricanCountry();

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

  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/products/${encodeURIComponent(
            String(category)
          )}/${encodeURIComponent(String(productId))}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Product not found");
          }
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (category && productId) {
      fetchProductDetails();
    }
  }, [category, productId]);

  const handleBack = () => {
    router.back();
  };

  const handleBuyNowClick = () => {
    setShowEmailModal(true);
  };

  const handleEmailSubmit = (email: string) => {
    setCustomerEmail(email);
    handleFlutterwavePayment(email);
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

      const discountedPrice =
        Number(product.price) * (1 - product.discountPercentage / 100);
      const totalAmount = discountedPrice * quantity;
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
            (1 - (product?.discountPercentage || 0) / 100) *
            quantity
          ).toFixed(2),
          quantity: quantity,
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

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="flex-grow">
          <Header />
          <div className="container mx-auto max-w-md px-4 py-8">
            <div className="flex justify-center items-center min-h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">
                Loading product details...
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="flex-grow">
          <Header />
          <div className="container mx-auto max-w-md px-4 py-8">
            <div className="text-center py-8">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Product Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "The product you're looking for doesn't exist."}
              </p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const discountedPrice =
    Number(product.price) * (1 - product.discountPercentage / 100);
  const totalPrice = (discountedPrice * quantity).toFixed(2);

  return (
    <main className="flex min-h-screen flex-col">
      <Toaster position="top-center" />
      <div className="flex-grow">
        <Header />
        <div className="container mx-auto max-w-md py-1 px-3">
          <a
            href="/products/all"
            className="inline-flex items-center text-sm text-blue-600 hover:underline hover:text-blue-800 left-2"
          >
            ← products
          </a>

          <span className="mx-2 text-gray-400">/</span>

          <span className="text-sm font-medium text-gray-700">
            {product.name}
          </span>
        </div>
        <div className="container mx-auto max-w-md py-1">
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
                    product.proDetails.map((detail, index) => (
                      <div className="bg-gray-50 p-3 rounded-lg" key={index}>
                        <div className="text-sm text-gray-500">
                          {detail.key}
                        </div>
                        <div className="text-lg font-semibold">
                          {detail.value}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-500">No details available</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="Description" className="pt-4">
                <p className="text-gray-700 leading-relaxed">
                  <span>
                    {product.description.split("\n").map((line, index) => (
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

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        loading={paymentLoading}
      />

      <Footer />
    </main>
  );
}
