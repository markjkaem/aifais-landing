import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import { Inter } from "next/font/google";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Footer from "../Components/Footer";
import HeaderMockup from "../Components/Header";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import CookieBanner from "../Components/CookieBanner"; // 👈 Import cookie banner
import ExitIntentPopup from "../Components/ExitIntentPopup";
import AIChatbot from "../Components/Aichatbot";

const anton = Inter({
  weight: "400",
  subsets: ["latin"],
});

// ✅ Dynamic metadata per locale - AWAIT params
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>; // ✅ params is a Promise
}): Promise<Metadata> {
  const { locale } = await params; // ✅ AWAIT here
  const isNL = locale === "nl";

  return {
    title: isNL
      ? "n8n Workflow Automatisering Nederland | Bespaar 40+ Uur/Week | Aifais"
      : "n8n Workflow Automation Netherlands | Save 40+ Hours/Week | Aifais",
    description: isNL
      ? "n8n workflow automatisering specialist voor Nederlandse MKB-bedrijven. Bespaar 40+ uur per week door repetitieve taken te automatiseren. Vanaf €2.500, live binnen 2 weken."
      : "n8n workflow automation specialist for Dutch SME companies. Save 40+ hours per week by automating repetitive tasks. From €2,500, live within 2 weeks.",

    keywords: isNL
      ? [
          "n8n automatisering",
          "workflow automatisering Nederland",
          "n8n specialist",
          "bedrijfsprocessen automatiseren",
          "n8n consultant Nederland",
          "automatisering MKB",
          "handmatig werk automatiseren",
          "n8n workflows bouwen",
        ]
      : [
          "n8n automation",
          "workflow automation Netherlands",
          "n8n specialist",
          "business process automation",
          "n8n consultant Netherlands",
          "SME automation",
          "automate manual work",
          "build n8n workflows",
        ],

    authors: [{ name: "Aifais" }],
    creator: "Aifais",
    publisher: "Aifais",
    category: "Business Services",

    openGraph: {
      type: "website",
      locale: isNL ? "nl_NL" : "en_US",
      url: `https://aifais.com${locale === "nl" ? "" : "/en"}`,
      siteName: "Aifais - n8n Workflow Automatisering",
      title: isNL
        ? "n8n Workflow Automatisering Nederland | Bespaar 40+ Uur/Week"
        : "n8n Workflow Automation Netherlands | Save 40+ Hours/Week",
      description: isNL
        ? "Specialist in n8n workflow automatisering voor Nederlandse MKB-bedrijven. Bespaar tijd, voorkom fouten, schaal zonder extra personeel."
        : "Specialist in n8n workflow automation for Dutch SME companies. Save time, prevent errors, scale without extra staff.",
      images: [
        {
          url: "https://aifais.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: isNL
            ? "Aifais n8n Workflow Automatisering - Bespaar 40+ uur per week"
            : "Aifais n8n Workflow Automation - Save 40+ hours per week",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: isNL
        ? "n8n Workflow Automatisering Nederland | Bespaar 40+ Uur/Week"
        : "n8n Workflow Automation Netherlands | Save 40+ Hours/Week",
      description: isNL
        ? "Specialist in n8n workflow automatisering voor Nederlandse MKB-bedrijven. Live binnen 2 weken, vanaf €2.500."
        : "Specialist in n8n workflow automation for Dutch SME companies. Live within 2 weeks, from €2,500.",
      images: ["https://aifais.com/og-image.jpg"],
      creator: "@aifais",
    },

    verification: {
      google: "jouw-google-verification-code",
    },

    alternates: {
      canonical: `https://aifais.com${locale === "nl" ? "" : "/en"}`,
      languages: {
        nl: "https://aifais.com",
        en: "https://aifais.com/en",
      },
    },

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

    applicationName: "Aifais",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Aifais",
    },

    metadataBase: new URL("https://aifais.com"),
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
  params: Promise<{ locale: string }>; // ✅ params is a Promise
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params; // ✅ AWAIT params

  // ✅ Check if locale is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Google Ads Global Tag */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17756832047"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17756832047');
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TMVXP6WQ');`,
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google Analytics with Consent Mode */}
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

        {/* Schema.org - LOCAL BUSINESS */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://aifais.com/#organization",
              name: "Aifais",
              alternateName: "Aifais - n8n Workflow Automatisering",
              description:
                locale === "nl"
                  ? "n8n workflow automatisering specialist voor Nederlandse MKB-bedrijven. Specialist in het automatiseren van bedrijfsprocessen."
                  : "n8n workflow automation specialist for Dutch SME companies. Specialist in automating business processes.",
              url: "https://aifais.com",
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
              image: "https://aifais.com/logo_official.png",
              logo: "https://aifais.com/logo_official.png",
              sameAs: [],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "50",
              },
            }),
          }}
        />

        {/* Schema.org - PROFESSIONAL SERVICE */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Aifais - n8n Workflow Automatisering",
              description:
                locale === "nl"
                  ? "Wij automatiseren repetitieve bedrijfsprocessen met n8n workflows. Bespaar 40+ uur per week voor Nederlandse MKB-bedrijven."
                  : "We automate repetitive business processes with n8n workflows. Save 40+ hours per week for Dutch SME companies.",
              url: "https://aifais.com",
              priceRange: "€€€",
              areaServed: {
                "@type": "Country",
                name: "Nederland",
              },
              serviceType: [
                "Workflow Automatisering",
                "n8n Implementatie",
                "Bedrijfsproces Automatisering",
                "AI Automatisering",
              ],
              provider: {
                "@type": "LocalBusiness",
                "@id": "https://aifais.com/#organization",
              },
            }),
          }}
        />

        {/* Schema.org - BREADCRUMB */}
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
                  item: "https://aifais.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Portfolio",
                  item: "https://aifais.com/portfolio",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Contact",
                  item: "https://aifais.com/contact",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${anton.className} tracking-wider`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TMVXP6WQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* ✅ Wrap with NextIntlClientProvider */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          <HeaderMockup />
          {children}
          <Footer />
          <CookieBanner /> {/* 👈 Cookie banner at the bottom */}
          <ExitIntentPopup />
          <AIChatbot /> {/* 👈 Voeg dit toe */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
