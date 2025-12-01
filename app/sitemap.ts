import { MetadataRoute } from "next";
import { projects } from "./[locale]/portfolio/data"; // Check your path
import { news } from "./[locale]/news/data"; // Check your path
import { services } from "./[locale]/diensten/data";

const BASE_URL = "https://aifais.com";

export default function sitemap(): MetadataRoute.Sitemap {
// 1. Static Pages
  const staticRoutes = [
    "",
    "/portfolio",
    "/diensten",
    "/news", // ✅ Ensure this is here
    "/contact",
    "/tools",
    "/tools/factuur-scanner", // ✅ Added: The scanner we built
    "/quickscan",
    "/#about", // Note: Hash links technically aren't separate sitemap pages, but '/over-ons' would be if it existed.
    "/privacy",
    "/agv",
  ].map((route) => ({
    url: `${BASE_URL}${route.replace('/#about', '')}`, // Clean up hash from URL if you used it
    lastModified: new Date(),
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Dynamic Services (High Priority - Money Pages)
  const serviceRoutes = services.map((service) => ({
    url: `${BASE_URL}/diensten/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9, // Higher priority than blog/portfolio
  }));

  // 3. Dynamic Portfolio
  const projectRoutes = projects.map((project) => ({
    url: `${BASE_URL}/portfolio/${project.slug}`,
    lastModified: new Date(), // Ideally use project.date
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 4. Dynamic News
  const newsRoutes = news.map((post) => ({
    url: `${BASE_URL}/news/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...newsRoutes,
  ];
}