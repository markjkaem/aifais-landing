import { Metadata } from "next";
import ContactClient from "./ContactClient";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Contact | Gratis Automatisering Consult | AIFAIS",
  description:
    "Neem contact op voor een gratis haalbaarheidscheck. Specialist in bedrijfsautomatisering in Gouda, Nederland. Reactie binnen 24 uur gegarandeerd.",

  keywords: [
    "contact automatisering specialist",
    "bedrijfsautomatisering offerte",
    "automatisering consultant Nederland",
    "automatisering Gouda",
    "bedrijfsautomatisering contact",
    "gratis automatisering advies",
  ],

  openGraph: {
    title: "Contact | Gratis Automatisering Consult | AIFAIS",
    description:
      "Neem contact op voor een gratis haalbaarheidscheck. Reactie binnen 24 uur.",
    url: "https://aifais.com/contact",
    type: "website",
    images: [
      {
        url: "https://aifais.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact AIFAIS voor bedrijfsautomatisering",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact | Gratis Automatisering Consult | AIFAIS",
    description:
      "Neem contact op voor een gratis haalbaarheidscheck. Reactie binnen 24 uur.",
    images: ["https://aifais.com/og-image.jpg"],
  },

  alternates: {
    canonical: "https://aifais.com/contact",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <>
      {/* ✅ SCHEMA.ORG - CONTACT PAGE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact AIFAIS",
            description:
              "Neem contact op met AIFAIS voor bedrijfsautomatisering en procesoptimalisatie",
            url: "https://aifais.com/contact",
            mainEntity: {
              "@type": "LocalBusiness",
              "@id": "https://aifais.com/#organization",
              name: "AIFAIS",
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
            },
          }),
        }}
      />

      <ContactClient />
    </>
  );
}
