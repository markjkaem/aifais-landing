"use client";

import { Project } from "./portfolio/data";
import FAQSection from "../Components/FAQSection";
import ToolsTeaser from "../Components/ToolsTeaser";
import HeroSection from "../Components/home/HeroSection";
import IntroVideoSection from "../Components/home/IntroVideoSection";
import ExplainerSection from "../Components/home/ExplainerSection";
import ProcessSection from "../Components/home/ProcessSection";
import TechStackSection from "../Components/home/TechStackSection";
import PortfolioSection from "../Components/home/PortfolioSection";
import TeamSection from "../Components/home/TeamSection";
import NewsletterCTA from "../Components/home/NewsletterCTA";

interface HomeClientProps {
  projects: Project[];
  hideHero?: boolean;
}

export default function HomeClient({ projects, hideHero = false }: HomeClientProps) {
  return (
    <main className="bg-white text-gray-900 min-h-screen transition-colors duration-500">
      {!hideHero && <HeroSection />}
      
      <ExplainerSection />
      
      <ProcessSection />
      
      <TechStackSection />
      
      <IntroVideoSection />
      
      <PortfolioSection projects={projects} />
      
      <TeamSection />

      <div id="demo" className="scroll-mt-24">
        <ToolsTeaser />
      </div>

      <FAQSection />
      <NewsletterCTA />
    </main>
  );
}
