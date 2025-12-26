"use client";

import { Project } from "./portfolio/data";
import FAQSection from "../Components/FAQSection";
import ToolsTeaser from "../Components/ToolsTeaser";
import HeroSection from "../Components/home/HeroSection";
import ExplainerSection from "../Components/home/ExplainerSection";
import ProcessSection from "../Components/home/ProcessSection";
import TechStackSection from "../Components/home/TechStackSection";
import PortfolioSection from "../Components/home/PortfolioSection";
import TeamSection from "../Components/home/TeamSection";

interface HomeClientProps {
  projects: Project[];
}

export default function HomeClient({ projects }: HomeClientProps) {
  return (
    <main className="bg-white text-gray-900 min-h-screen transition-colors duration-500">
      <HeroSection />
      
      <ExplainerSection />
      
      <ProcessSection />
      
      <TechStackSection />
      
      <PortfolioSection projects={projects} />
      
      <TeamSection />

      <div id="demo" className="scroll-mt-24">
        <ToolsTeaser />
      </div>

      <FAQSection />
    </main>
  );
}
