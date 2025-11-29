import type { Metadata } from "next";
// Assuming you have these fonts, but only 'anton' is initialized below
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import { Inter } from "next/font/google";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Footer from "../Components/Footer";
import HeaderMockup from "../Components/Header";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import CookieBanner from "../Components/CookieBanner";
import ExitIntentPopup from "../Components/ExitIntentPopup";
import AIChatbot from "../Components/Aichatbot";
import Script from "next/script";

// ✅ Font Initialization
const anton = Inter({
  weight: "400",
  subsets: ["latin"],
});

// ✅ CONSTANTS FOR DRYNESS
const BASE_URL = "https://aifais.com";
const OG_IMAGE_URL = `${BASE_URL}/og-image.jpg`;
const TWITTER_CREATOR = "@aifais";

type Params = Promise<{ locale: string }>;

// ✅ Dynamic metadata per locale

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const isNL = locale === "nl";
  const localePath = isNL ? "" : "/en";

  return {
    title: isNL
      ? "Bedrijfsautomatisering Nederland | Bespaar 40+ Uur/Week | AIFAIS"
      : "Business Automation Netherlands | Save 40+ Hours/Week | AIFAIS",
    description: isNL
      ? "Automatiseer bedrijfsprocessen voor MKB. Bespaar 40+ uur per week door repetitieve taken te automatiseren. Geen programmeerkennis nodig. Vanaf €2.500, live binnen 2 weken."
      : "Automate business processes for SME. Save 40+ hours per week by automating repetitive tasks. No programming required. From €2,500, live within 2 weeks.",

    // Keywords are kept
    keywords: isNL
      ? [
          "bedrijfsautomatisering",
          "processen automatiseren",
          "tijd besparen automatisering",
          "automatisering mkb",
          "handmatige taken automatiseren",
          "repetitieve taken automatisch",
          "administratie automatiseren",
          "bedrijfsprocessen digitaliseren",
          "automatisering kleine bedrijven",
          "automatisering zonder programmeren",
        ]
      : [
          "business automation",
          "process automation Netherlands",
          "automate processes",
          "business process automation",
          "automation consultant Netherlands",
          "SME automation",
          "automate manual work",
          "administrative automation",
        ],

    authors: [{ name: "AIFAIS" }],
    creator: "AIFAIS",
    publisher: "AIFAIS",
    category: "Business Services",

    openGraph: {
      type: "website",
      locale: isNL ? "nl_NL" : "en_US",
      url: `${BASE_URL}${localePath}`,
      siteName: "AIFAIS - Bedrijfsautomatisering Nederland",
      title: isNL
        ? "Bedrijfsautomatisering Nederland | Bespaar 40+ Uur/Week"
        : "Business Automation Netherlands | Save 40+ Hours/Week",
      description: isNL
        ? "Automatiseer handmatig werk voor MKB bedrijven. Bespaar tijd, voorkom fouten, schaal zonder extra personeel."
        : "Automate manual work for SME companies. Save time, prevent errors, scale without extra staff.",
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: isNL
            ? "AIFAIS Bedrijfsautomatisering - Bespaar 40+ uur per week"
            : "AIFAIS Business Automation - Save 40+ hours per week",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: isNL
        ? "Bedrijfsautomatisering Nederland | Bespaar 40+ Uur/Week"
        : "Business Automation Netherlands | Save 40+ Hours/Week",
      description: isNL
        ? "Automatiseer handmatig werk voor MKB. Stop met repetitieve taken. Live binnen 2 weken, vanaf €2.500."
        : "Automate manual work for SME. Stop repetitive tasks. Live within 2 weken, from €2,500.",
      images: [OG_IMAGE_URL],
      creator: TWITTER_CREATOR,
    },

    verification: {
      google: "jouw-google-verification-code",
    },

    // ✅ HREFLANG for International SEO (with x-default)
    alternates: {
      canonical: `${BASE_URL}${localePath}`,
      languages: {
        nl: BASE_URL,
        en: `${BASE_URL}/en`,
        "x-default": BASE_URL,
      },
    },

    // ✅ Cleaned up robots configuration
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    applicationName: "AIFAIS",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "AIFAIS",
    },

    metadataBase: new URL(BASE_URL),
    formatDetection: {
      telephone: true,
      email: true,
    },
  };
}

// ✅ Generate static params for both locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const isNL = locale === "nl";

  // ✅ Check if locale is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      {/* ---------------------------------------------------- */}
      {/* ✅ THIRD-PARTY SCRIPTS: Using Next/Script for performance */}
      {/* ---------------------------------------------------- */}

      {/* Google Tag Manager (GTM) - Strategy 'worker' is highly performant */}
      <Script
        id="gtm-script"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TMVXP6WQ');`,
        }}
      />

      {/* Google Ads Global Tag (gtag) - Strategy 'worker' */}
      <Script
        id="google-ads-tag"
        src="https://www.googletagmanager.com/gtag/js?id=AW-17756832047"
        strategy="worker"
      />
      <Script
        id="google-ads-config"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17756832047');
          `,
        }}
      />

      {/* Mailchimp Connected Site Script - Strategy 'afterInteractive' */}
      <Script
        id="mcjs"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(c,h,i,m,p){
              m=c.createElement(h),
              p=c.getElementsByTagName(h)[0],
              m.async=1,
              m.src=i,
              p.parentNode.insertBefore(m,p)
            }(document,"script","https://chimpstatic.com/mcjs-connected/js/users/c66f45e7f503cc57bbaf5e5db/9a532f162e3351306564318b7.js");
          `,
        }}
      />

      <head>
        {/* Font Preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicons & Manifest */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google Analytics with Consent Mode (Init) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Start met consent denied - alleen laden na cookie toestemming
              gtag('consent', 'default', {
                'analytics_storage': 'denied'
              });
              
              gtag('config', 'G-XXXXXXXXXX', {
                'anonymize_ip': true
              });
            `,
          }}
        />

        {/* ---------------------------------------------------- */}
        {/* ✅ SCHEMA.ORG: LOCAL BUSINESS (Dynamic Locale Support) */}
        {/* ---------------------------------------------------- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://aifais.com/#organization",
              name: "AIFAIS",
              alternateName: "AIFAIS - Bedrijfsautomatisering Nederland",
              description: isNL
                ? "Specialist in bedrijfsautomatisering voor Nederlandse MKB-bedrijven. Automatiseer repetitieve taken en bespaar 40+ uur per week."
                : "Specialist in business automation for Dutch SME companies. Automate repetitive tasks and save 40+ hours per week.",
              url: BASE_URL,
              telephone: "+31-6 18424470",
              email: "info@aifais.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Groningenweg 8",
                postalCode: "2803 PV",
                addressLocality: "Gouda",
                addressRegion: "Zuid-Holland",
                addressCountry: "NL",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "52.0115",
                longitude: "4.7104",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "09:00",
                closes: "17:00",
              },
              priceRange: "€€€",
              image: `${BASE_URL}/logo_official.png`,
              logo: `${BASE_URL}/logo_official.png`,
              sameAs: [
                TWITTER_CREATOR, // Using Twitter handle as a sameAs example
                // Add more social links here
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "50",
              },
            }),
          }}
        />

        {/* ✅ SCHEMA.ORG: PROFESSIONAL SERVICE (Dynamic Locale Support) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "AIFAIS - Bedrijfsautomatisering voor MKB",
              description: isNL
                ? "Wij automatiseren repetitieve bedrijfsprocessen. Bespaar 40+ uur per week voor Nederlandse MKB-bedrijven. Geen programmeerkennis nodig."
                : "We automate repetitive business processes. Save 40+ hours per week for Dutch SME companies. No programming required.",
              url: BASE_URL,
              priceRange: "€€€",
              areaServed: {
                "@type": "Country",
                name: "Nederland",
              },
              serviceType: [
                "Bedrijfsautomatisering",
                "Proces Automatisering",
                "Administratie Automatisering",
                "AI Automatisering",
              ],
              provider: {
                "@type": "LocalBusiness",
                "@id": "https://aifais.com/#organization",
              },
            }),
          }}
        />

        {/* ✅ SCHEMA.ORG: BREADCRUMB (Static Example) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: BASE_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Portfolio",
                  item: `${BASE_URL}/portfolio`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Contact",
                  item: `${BASE_URL}/contact`,
                },
              ],
            }),
          }}
        />
      </head>

      <body className={`${anton.className} tracking-wider`}>
        {/* GTM noscript: MUST be immediately after <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TMVXP6WQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* ✅ NextIntlClientProvider wraps all content */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          <HeaderMockup />
          {children}
          <Footer />
          <CookieBanner />
          <ExitIntentPopup />
          <AIChatbot />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
