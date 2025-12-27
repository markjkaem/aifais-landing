import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import AboutClient from "../../Components/about/AboutClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default async function AboutPage({ params }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { locale } = await params;
  return <AboutClient />;
}
