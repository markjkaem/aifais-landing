import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import HomeClient from "@/app/[locale]/HomeClient"; // Reuse homepage sections or create specific ones

const h1 = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

interface CityData {
  name: string;
  title: string;
  description: string;
  intro: string;
  h1: string;
  keywords: string[];
}

const cityData: Record<string, CityData> = {
  rotterdam: {
    name: "Rotterdam",
    title: "AI & Bedrijfsautomatisering Rotterdam",
    description: "Optimaliseer uw bedrijfsprocessen in Rotterdam met AI. Van logistiek tot zakelijke dienstverlening. Bespaar 40+ uur per week met AIFAIS.",
    intro: "Als innovatieve stad vraagt Rotterdam om slimme oplossingen. Wij helpen Rotterdamse ondernemers met het automatiseren van complexe workflows en AI-integraties.",
    h1: "Digitale Werknemers voor Rotterdamse Ondernemers",
    keywords: ["automatisering rotterdam", "AI bureau rotterdam", "procesautomatisering rotterdam"],
  },
  "den-haag": {
    name: "Den Haag",
    title: "Procesautomatisering & AI in Den Haag",
    description: "Slimme automatisering voor bedrijven in Den Haag. Wij helpen consultancy, legal en MKB bedrijven met AI-gedreven efficiëntie.",
    intro: "In de stad van recht en vrede brengen wij rust in uw administratie. Onze AI-oplossingen in Den Haag zorgen dat u meer tijd overhoudt voor uw kernactiviteiten.",
    h1: "Efficiënter Werken in Den Haag met AI",
    keywords: ["automatisering den haag", "AI consultant den haag", "business automation den haag"],
  },
  gouda: {
    name: "Gouda",
    title: "Automatisering & AI Specialist in Gouda",
    description: "Uw lokale partner in Gouda voor bedrijfsautomatisering. Gevestigd in de regio, helpen wij lokale MKB bedrijven met schaalbare AI oplossingen.",
    intro: "Als trotse Goudse onderneming kennen wij de lokale markt als geen ander. Wij helpen onze buren in Gouda en omstreken naar een toekomstbestendig bedrijf.",
    h1: "Uw AI & Automatisering Partner in Gouda",
    keywords: ["automatisering gouda", "AI specialist gouda", "ICT automatisering gouda"],
  },
  utrecht: {
    name: "Utrecht",
    title: "AI & Workflow Automatisering Utrecht",
    description: "Versnel uw groei in Utrecht met intelligente automatisering. Wij koppelen uw systemen en implementeren AI-assistenten.",
    intro: "Utrecht is het kloppende hart van de Nederlandse zakelijke markt. Wij zorgen dat uw bedrijf in Utrecht kan schalen zonder extra personeelsdruk.",
    h1: "Slimme Automatisering voor Bedrijven in Utrecht",
    keywords: ["automatisering utrecht", "AI implementatie utrecht", "procesoptimalisatie utrecht"],
  },
};

export function generateStaticParams() {
  return [
    { city: "rotterdam" },
    { city: "den-haag" },
    { city: "gouda" },
    { city: "utrecht" },
  ];
}

type Params = Promise<{ locale: string; city: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city } = await params;
  const data = cityData[city.toLowerCase()];
  
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
  };
}

export default async function CityPage({ params }: { params: Params }) {
  const { city, locale } = await params;
  const data = cityData[city.toLowerCase()];

  if (!data) {
    notFound();
  }

  const BASE_URL = "https://aifais.com";
  const citySlug = city.toLowerCase();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `AIFAIS ${data.name}`,
    description: data.description,
    url: `${BASE_URL}/${locale}/locatie/${citySlug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Groningenweg 8",
      addressLocality: "Gouda",
      addressRegion: "Zuid-Holland",
      postalCode: "2803 PV",
      addressCountry: "NL",
    },
    areaServed: {
      "@type": "City",
      name: data.name,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "52.0115",
      longitude: "4.7104",
    },
    telephone: "+31 6 1842 4470",
  };

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      {/* City Specific Hero */}
      <section className="bg-gradient-to-br from-[#3066be] to-[#1e3a8a] py-24 text-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-4xl">
            <h1 className={`${h1.className} text-5xl md:text-7xl font-bold mb-8 leading-tight`}>
              {data.h1}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
              {data.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href={`/${locale}/contact`}
                className="px-8 py-4 bg-white text-[#3066be] font-bold rounded-full text-center hover:bg-blue-50 transition-colors"
              >
                Plan gratis analyse in {data.name}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Component - Reusing sections from HomeClient but could be unique */}
      <HomeClient />
      
      {/* Localized Footer Signal */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ook actief in de regio rondom {data.name}</h2>
          <p className="text-gray-600">
            Wij helpen ondernemers door heel Zuid-Holland en Utrecht met slimme automatisering.
          </p>
        </div>
      </section>
    </main>
  );
}
