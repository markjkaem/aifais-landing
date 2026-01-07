import { MetadataRoute } from "next";
import { projects } from "./[locale]/portfolio/data";
import { news } from "./[locale]/news/data";
import { services } from "./[locale]/diensten/data";
import { getToolSlugs } from "@/config/tools";

const BASE_URL = "https://aifais.com";

const locales = ["nl", "en"];
const cities = ["rotterdam", "den-haag", "gouda", "utrecht", "leiden", "alphen-aan-den-rijn", "woerden", "zoetermeer"];
const sectors = [
  "accountants",
  "advocaten",
  "e-commerce",
  "makelaars",
  "hypotheekadviseurs",
  "installatiebedrijven",
  "bouwbedrijven",
  "horeca",
  "logistiek",
  "hr-recruitment",
  "zorg",
  "fitness-sport",
  "marketing-bureaus",
  "architecten",
  "productiebedrijven",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];
  const toolSlugs = getToolSlugs();

  // 1. Static Routes
  const staticPaths = [
    "", // Homepage
    "/about",
    "/contact",
    "/portfolio",
    "/diensten",
    "/diensten/agent-api",
    "/diensten/bedrijfsbrein",
    "/news",
    "/tools",
    "/mkb",
    "/locatie",
    "/agents",
    "/developers",
    "/developers/docs",
    "/developers/mcp",
    "/privacy",
    "/agv",
    "/cookies",
  ];

  locales.forEach((locale) => {
    const prefix = locale === "nl" ? "" : \`/\${locale}\`;

    // Static Pages
    staticPaths.forEach((route) => {
      routes.push({
        url: \`\${BASE_URL}\${prefix}\${route}\`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    });

    // Dynamic Tools (all tools from registry)
    toolSlugs.forEach((slug) => {
      routes.push({
        url: \`\${BASE_URL}\${prefix}/tools/\${slug}\`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    });

    // Regional Pages
    cities.forEach((city) => {
      routes.push({
        url: \`\${BASE_URL}\${prefix}/locatie/\${city}\`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });

    // Sector Pages
    sectors.forEach((sector) => {
      routes.push({
        url: \`\${BASE_URL}\${prefix}/mkb/\${sector}\`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.85,
      });
    });

    // Dynamic Services
    services.forEach((service) => {
      routes.push({
        url: \`\${BASE_URL}\${prefix}/diensten/\${service.slug}\`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    });

    // Dynamic Portfolio
    projects.forEach((project) => {
      routes.push({
        url: \`\${BASE_URL}\${prefix}/portfolio/\${project.slug}\`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

    // Dynamic News
    news.forEach((post) => {
      routes.push({
        url: \`\${BASE_URL}\${prefix}/news/\${post.slug}\`,
        lastModified: new Date(post.date),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    });
  });

  return routes;
}
