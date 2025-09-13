import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

// METADATA
export const metadata: Metadata = {
  title: "Best Sponsored Jobs Groups",
  description:
    "Curated communities for visa-sponsored jobs on WhatsApp & Telegram.",
  openGraph: {
    title: "Best Sponsored Jobs Groups",
    description:
      "Curated communities for visa-sponsored jobs on WhatsApp & Telegram.",
    url: "https://www.sponsoredjobalert.com/groups/jobs",
    siteName: "SponsoredJobs Alert",
    images: [
      {
        url: "https://www.sponsoredjobalert.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SponsoredJobs Alert Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Sponsored Jobs Groups",
    description:
      "Curated communities for visa-sponsored jobs on WhatsApp & Telegram.",
    images: ["https://www.sponsoredjobalert.com/og-image.jpg"],
  },
};

// ROOT LAYOUT
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="facebook-domain-verification"
          content="p0peu1m38q3o0fu4aa2u669fnu2aa6"
        />
        <meta
          name="google-site-verification"
          content="ZVP3PoO1QjQdYrlRRf9m566B4Y0LauI67NgQTxMhk1U"
        />
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SponsoredJobs Alert",
              url: "https://www.sponsoredjobalert.com",
              description:
                "Find visa sponsored jobs in WhatsApp & Telegram communities.",
              publisher: {
                "@type": "Organization",
                name: "SponsoredJobs Alert",
                url: "https://www.sponsoredjobalert.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.sponsoredjobalert.com/logo.png",
                },
              },
            }),
          }}
        />

        {/* Facebook Pixel Script */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2607618742928811');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning={true}>
        <AppProvider>{children}</AppProvider>

        {/* Facebook Pixel NoScript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2607618742928811&ev=PageView&noscript=1"
            alt="fb pixel"
          />
        </noscript>

        {/* Google Analytics via Script Component */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HFVYEF0PS4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HFVYEF0PS4');
          `}
        </Script>
      </body>
    </html>
  );
}
