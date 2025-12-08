// ========================================
// FILE: app/news/[slug]/data.ts
// ========================================

import { workflowArticle } from "./articles/workflow-automatisering";
import { aiArticle } from "./articles/klantenservice-ai";
import { invoiceArticle } from "./articles/facturatie-gids";
import { x402Article } from "./articles/x402-de-krachtbron-voor-autonome-agents";

// Voeg hier nieuwe artikelen toe door ze te importeren
export const news = [
  workflowArticle,
  aiArticle,
  x402Article,
  invoiceArticle,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Altijd de nieuwste bovenaan