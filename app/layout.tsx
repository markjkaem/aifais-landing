import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Stardos_Stencil } from "next/font/google";
import HeaderMockup from "./Components/Header";

const anton = Inter({
  weight: "400",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ GEOPTIMALISEERDE METADATA
export const metadata: Metadata = {
  // Primary SEO tags
  title:
    "n8n Workflow Automatisering Nederland | Bespaar 40+ Uur/Week | Aifais",
  description:
    "n8n workflow automatisering specialist voor Nederlandse MKB-bedrijven. Bespaar 40+ uur per week door repetitieve taken te automatiseren. Vanaf €2.500, live binnen 2 weken.",

  // Keywords (ouderwets maar sommige zoekmachines gebruiken het nog)
  keywords: [
    "n8n automatisering",
    "workflow automatisering Nederland",
    "n8n specialist",
    "bedrijfsprocessen automatiseren",
    "n8n consultant Nederland",
    "automatisering MKB",
    "handmatig werk automatiseren",
    "n8n workflows bouwen",
  ],

  // Author & creator
  authors: [{ name: "Aifais" }],
  creator: "Aifais",
  publisher: "Aifais",

  // Language & region
  category: "Business Services",

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://aifais.com",
    siteName: "Aifais - n8n Workflow Automatisering",
    title: "n8n Workflow Automatisering Nederland | Bespaar 40+ Uur/Week",
    description:
      "Specialist in n8n workflow automatisering voor Nederlandse MKB-bedrijven. Bespaar tijd, voorkom fouten, schaal zonder extra personeel.",
    images: [
      {
        url: "https://aifais.com/og-image.jpg", // MAAK DEZE IMAGE (1200x630px)
        width: 1200,
        height: 630,
        alt: "Aifais n8n Workflow Automatisering - Bespaar 40+ uur per week",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "n8n Workflow Automatisering Nederland | Bespaar 40+ Uur/Week",
    description:
      "Specialist in n8n workflow automatisering voor Nederlandse MKB-bedrijven. Live binnen 2 weken, vanaf €2.500.",
    images: ["https://aifais.com/og-image.jpg"],
    creator: "@aifais", // Als je Twitter hebt, anders weglaten
  },

  // Verification tags (vul in als je deze hebt)
  verification: {
    google: "jouw-google-verification-code", // Van Google Search Console
    // yandex: "jouw-yandex-code",
    // bing: "jouw-bing-code",
  },

  // Canonical URL
  alternates: {
    canonical: "https://aifais.com",
    languages: {
      "nl-NL": "https://aifais.com",
    },
  },

  // Robots
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

  // App info (voor mobile)
  applicationName: "Aifais",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aifais",
  },

  // Other metadata
  metadataBase: new URL("https://aifais.com"),
  formatDetection: {
    telephone: true,
    email: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      {/* ✅ FIXED: Was "en", moet "nl" zijn */}
      <head>
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

        {/* ✅ NIEUWE: Preconnect voor performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* ✅ NIEUWE: Favicon (zorg dat je deze hebt) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* ✅ NIEUWE: Schema.org Structured Data - LOCAL BUSINESS */}
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
                "n8n workflow automatisering specialist voor Nederlandse MKB-bedrijven. Specialist in het automatiseren van bedrijfsprocessen.",
              url: "https://aifais.com",
              telephone: "+31-6 18424470", // ✅ VUL IN MET JOUW TELEFOONNUMMER
              email: "info@aifais.com", // ✅ VUL IN MET JOUW EMAIL
              address: {
                "@type": "PostalAddress",
                streetAddress: "Kampenringweg 45D",
                postalCode: "2803 PE",
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
              sameAs: [
                // ✅ VUL IN ALS JE DEZE HEBT:
                // "https://www.linkedin.com/company/aifais",
                // "https://twitter.com/aifais",
                // "https://www.facebook.com/aifais"
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "50", // ✅ AANPASSEN OP BASIS VAN ECHTE REVIEWS
              },
            }),
          }}
        />

        {/* ✅ NIEUWE: Schema.org - PROFESSIONAL SERVICE */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Aifais - n8n Workflow Automatisering",
              description:
                "Wij automatiseren repetitieve bedrijfsprocessen met n8n workflows. Bespaar 40+ uur per week voor Nederlandse MKB-bedrijven.",
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

        {/* ✅ NIEUWE: Schema.org - BREADCRUMB (voor betere navigatie in search results) */}
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

        <HeaderMockup />

        {children}

        {/* ✅ GEOPTIMALISEERDE FOOTER MET SCHEMA */}
        <footer
          className="text-gray-200 bg-gray-950 mt-12"
          itemScope
          itemType="https://schema.org/Organization"
        >
          <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg mb-2" itemProp="name">
                Aifais
              </h3>
              <address
                className="not-italic"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <p itemProp="streetAddress">Kampenringweg 45D</p>
                <p>
                  <span itemProp="postalCode">2803 PE</span>{" "}
                  <span itemProp="addressLocality">Gouda</span>
                </p>
                <meta itemProp="addressCountry" content="NL" />
              </address>
              {/* ✅ VUL IN ALS JE TELEFOONNUMMER & EMAIL PUBLIEK WILT */}
              {/* <p itemProp="telephone">
                <a href="tel:+31XXXXXXXXX" className="hover:underline">
                  +31 (0)XX XXX XXXX
                </a>
              </p>
              <p itemProp="email">
                <a href="mailto:info@aifais.com" className="hover:underline">
                  info@aifais.com
                </a>
              </p> */}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg mb-2">
                Zakelijke informatie
              </h3>
              <p>
                BTW: <span className="italic">NL000099998B57</span>
              </p>
              <p itemProp="vatID">KvK: 27199999</p>
              <p>Verzekerd & gecertificeerd</p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg mb-2">Navigatie</h3>
              <nav aria-label="Footer navigatie">
                <Link
                  href="/"
                  className="hover:underline block mb-2"
                  itemProp="url"
                >
                  Home
                </Link>
                <Link href="/portfolio" className="hover:underline block mb-2">
                  Portfolio
                </Link>
                <Link href="/contact" className="hover:underline block mb-2">
                  Contact
                </Link>
                <Link href="/agv" className="hover:underline block mb-2">
                  Algemene Voorwaarden
                </Link>
                <Link href="/privacy" className="hover:underline block mb-2">
                  Privacy Policy
                </Link>
              </nav>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} <span itemProp="name">Aifais</span> —
              Alle rechten voorbehouden
            </p>
            <p className="mt-2">
              n8n Workflow Automatisering Specialist | Gevestigd in Gouda,
              Nederland
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
