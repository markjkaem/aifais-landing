import { Metadata } from "next";
import ThankYouClient from "./ThankYouClient";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Bedankt voor je Aanvraag | Aifais Automatisering Quickscan",
  description:
    "We hebben je quickscan ontvangen en nemen binnen 1 werkdag contact op om jouw automatiseringsmogelijkheden te bespreken.",

  robots: {
    index: false,
    follow: true,
  },

  openGraph: {
    title: "Bedankt voor je Aanvraag | Aifais",
    description: "We nemen binnen 1 werkdag contact met je op.",
    url: "https://aifais.com/thank-you",
    type: "website",
  },
};

export default async function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Bedankt voor je aanvraag",
            description:
              "Bevestigingspagina voor automatisering quickscan aanvraag",
            provider: {
              "@type": "Organization",
              name: "Aifais",
              "@id": "https://aifais.com/#organization",
            },
          }),
        }}
      />

      <ThankYouClient />
    </>
  );
}
