"use client";

import AboutHero from "./AboutHero";
import StorySection from "./StorySection";
import TeamSection from "../home/TeamSection";
import FAQSection from "../FAQSection";

export default function AboutClient() {
  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <AboutHero />
      <StorySection />
      <TeamSection />
      <FAQSection />
    </main>
  );
}
