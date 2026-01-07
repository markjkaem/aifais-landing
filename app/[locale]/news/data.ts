// ========================================
// FILE: app/news/data.ts
// ========================================

import { workflowArticle } from "./articles/workflow-automatisering";
import { aiArticle } from "./articles/klantenservice-ai";
import { invoiceArticle } from "./articles/facturatie-gids";
import { x402Article } from "./articles/x402-de-krachtbron-voor-autonome-agents";
import { visaAiPurchasesArticle } from "./articles/visa-ai-agents-autonome-aankopen";
import { replitAutonomousAgentsArticle } from "./articles/replit-autonome-coding-agents";
import { aiTrends2026Article } from "./articles/ai-trends-2026-kansen-mkb";
import { startingWithAiArticle } from "./articles/starten-met-ai-mkb";
import { aiEngineeringSummitArticle } from "./articles/ai-engineering-summit-insights";


// Dit type helpt je om consistent te blijven met AEO velden
export interface AEOArticle {
  id: number;
  slug: string;
  title: string;
  aeoSnippet: string; // Verplicht voor AEO
  excerpt: string;
  date: string;
  updatedAt?: string;
  author: string;
  authorBio: string;
  category: string;
  image: string;
  readTime: number;
  tags: string[];
  faq?: { question: string; answer: string }[]; // Verplicht voor Schema
  content: string; // Gebruik Markdown met H2 vragen
}

export const news: AEOArticle[] = [
  aiTrends2026Article,
  startingWithAiArticle,
  workflowArticle,
  aiArticle,
  x402Article,
  visaAiPurchasesArticle,
  invoiceArticle,
  replitAutonomousAgentsArticle,
  aiEngineeringSummitArticle,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

