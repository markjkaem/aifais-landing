import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import HomeClient from "@/app/[locale]/HomeClient"; 
import { getTranslations } from "next-intl/server";
import { getProjects } from "@/app/[locale]/portfolio/data";

const h1_font = Space_Grotesk({
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

const cityData: Record<string, CityData & { citationSnippet: string }> = {
  rotterdam: {
    name: "Rotterdam",
    title: "AI & Bedrijfsautomatisering Rotterdam",
    description: "Optimaliseer uw bedrijfsprocessen in Rotterdam met AI. Van logistiek tot zakelijke dienstverlening. Bespaar 40+ uur per week met AIFAIS.",
    intro: "Als innovatieve stad vraagt Rotterdam om slimme oplossingen. Wij helpen Rotterdamse ondernemers met het automatiseren van complexe workflows en AI-integraties.",
    h1: "Digitale Werknemers voor Rotterdamse Ondernemers",
    keywords: ["automatisering rotterdam", "AI bureau rotterdam", "procesautomatisering rotterdam"],
    citationSnippet: "AIFAIS levert AI-automatisering voor MKB-bedrijven in Rotterdam en omgeving. Digital Workers voor administratie, sales en klantenservice met implementatie binnen 8 weken.",
  },
  "den-haag": {
    name: "Den Haag",
    title: "Procesautomatisering & AI in Den Haag",
    description: "Slimme automatisering voor bedrijven in Den Haag. Wij helpen consultancy, legal en MKB bedrijven met AI-gedreven efficiëntie.",
    intro: "In de stad van recht en vrede brengen wij rust in uw administratie. Onze AI-oplossingen in Den Haag zorgen dat u meer tijd overhoudt voor uw kernactiviteiten.",
    h1: "Efficiënter Werken in Den Haag met AI",
    keywords: ["automatisering den haag", "AI consultant den haag", "business automation den haag"],
    citationSnippet: "AI-automatisering voor Haagse ondernemers. AIFAIS implementeert Digital Workers die 15-20 uur per week besparen op repetitieve taken. Persoonlijke begeleiding vanuit Gouda.",
  },
  gouda: {
    name: "Gouda",
    title: "Automatisering & AI Specialist in Gouda",
    description: "Uw lokale partner in Gouda voor bedrijfsautomatisering. Gevestigd in de regio, helpen wij lokale MKB bedrijven met schaalbare AI oplossingen.",
    intro: "Als trotse Goudse onderneming kennen wij de lokale markt als geen ander. Wij helpen onze buren in Gouda en omstreken naar een toekomstbestendig bedrijf.",
    h1: "Uw AI & Automatisering Partner in Gouda",
    keywords: ["automatisering gouda", "AI specialist gouda", "ICT automatisering gouda"],
    citationSnippet: "AIFAIS is gevestigd in Gouda en helpt lokale MKB-bedrijven met AI-automatisering. Als specialist in bedrijfsprocessen digitaliseren bieden wij persoonlijke service in de regio Midden-Holland.",
  },
  utrecht: {
    name: "Utrecht",
    title: "AI & Workflow Automatisering Utrecht",
    description: "Versnel uw groei in Utrecht met intelligente automatisering. Wij koppelen uw systemen en implementeren AI-assistenten.",
    intro: "Utrecht is het kloppende hart van de Nederlandse zakelijke markt. Wij zorgen dat uw bedrijf in Utrecht kan schalen zonder extra personeelsdruk.",
    h1: "Slimme Automatisering voor Bedrijven in Utrecht",
    keywords: ["automatisering utrecht", "AI implementatie utrecht", "procesoptimalisatie utrecht"],
    citationSnippet: "AIFAIS bedient MKB-bedrijven in Utrecht met AI-procesautomatisering. Van facturatie tot leadopvolging - gemiddeld 40+ uur besparing per week met Nederlandse support.",
  },
};

const cityDataEn: Record<string, CityData> = {
  rotterdam: {
    name: "Rotterdam",
    title: "AI & Business Automation Rotterdam",
    description: "Optimize your business processes in Rotterdam with AI. From logistics to professional services. Save 40+ hours per week with AIFAIS.",
    intro: "As an innovative city, Rotterdam demands smart solutions. We help Rotterdam entrepreneurs with automating complex workflows and AI integrations.",
    h1: "Digital Employees for Rotterdam Entrepreneurs",
    keywords: ["automation rotterdam", "AI agency rotterdam", "process automation rotterdam"],
  },
  "den-haag": {
    name: "Den Hague",
    title: "Process Automation & AI in Den Hague",
    description: "Smart automation for businesses in Den Hague. We help consultancy, legal and SME companies with AI-driven efficiency.",
    intro: "In the city of peace and justice, we bring peace to your administration. Our AI solutions in Den Hague ensure you have more time for your core activities.",
    h1: "Work More Efficiently in Den Hague with AI",
    keywords: ["automation den hague", "AI consultant den hague", "business automation den hague"],
  },
  gouda: {
    name: "Gouda",
    title: "Automation & AI Specialist in Gouda",
    description: "Your local partner in Gouda for business automation. Based in the region, we help local SME companies with scalable AI solutions.",
    intro: "As a proud Gouda-based company, we know the local market best. We help our neighbors in Gouda and surroundings towards a future-proof company.",
    h1: "Your AI & Automation Partner in Gouda",
    keywords: ["automation gouda", "AI specialist gouda", "ICT automation gouda"],
  },
  utrecht: {
    name: "Utrecht",
    title: "AI & Workflow Automation Utrecht",
    description: "Accelerate your growth in Utrecht with intelligent automation. We connect your systems and implement AI assistants.",
    intro: "Utrecht is the beating heart of the Dutch business market. We ensure your business in Utrecht can scale without additional personnel pressure.",
    h1: "Smart Automation for Businesses in Utrecht",
    keywords: ["automation utrecht", "AI implementation utrecht", "process optimization utrecht"],
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
  const { city, locale } = await params;
  const data = locale === 'en' ? cityDataEn[city.toLowerCase()] : cityData[city.toLowerCase()];
  
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
  };
}

export default async function CityPage({
  params,
}: {
  params: Params;
}) {
  const { city, locale } = await params;
  const data = locale === 'en' ? cityDataEn[city.toLowerCase()] : cityData[city.toLowerCase()];
  const t = await getTranslations({ locale, namespace: "cityPage" });

  if (!data) {
    notFound();
  }

  const BASE_URL = "https://aifais.com";
  const citySlug = city.toLowerCase();
  const projects = getProjects(locale);

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
            <h1 className={`${h1_font.className} text-5xl md:text-7xl font-bold mb-8 leading-tight`}>
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
                {t("cta", { city: data.name })}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Component - Reusing sections from HomeClient but could be unique */}
      <HomeClient projects={projects} />
      
      {/* Localized Footer Signal */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">{t("regionInfo", { city: data.name })}</h2>
          <p className="text-gray-600">
            {t("subText")}
          </p>
        </div>
      </section>
    </main>
  );
}
