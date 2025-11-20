import Link from "next/link";
import { news } from "./data";
import { marked } from "marked";
import { Metadata } from "next";

// SEO Metadata per blogpagina
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const project = news.find((p) => p.slug === slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.excerpt,
    authors: [{ name: project.author }],
    keywords: [
      "AI",
      "automatisering",
      "workflow",
      "n8n",
      "MKB",
      "business automation",
    ],
    openGraph: {
      title: project.title,
      description: project.excerpt,
      type: "article",
      publishedTime: new Date(project.date).toISOString(),
      images: project.image ? [project.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.excerpt,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const project = news.find((p) => p.slug === slug);

  if (!project) return <p>Blog niet gevonden</p>;

  return (
    <>
      <section className="py-20 max-w-3xl p-4 mx-auto">
        <h1 className="text-5xl font-bold mb-6">{project.title}</h1>

        <div className="flex items-center gap-4 text-gray-400 text-sm mb-10">
          <span>{project.author}</span>
          <span>•</span>
          <span>{project.date}</span>
        </div>

        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="rounded-xl mb-10 w-full object-cover shadow-lg"
          />
        )}

        <article
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: marked(project.content) }}
        />
      </section>

      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold">
          Klaar om jouw bedrijf toekomstbestendig te maken?
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Samen ontwerpen we jouw AI-voorsprong.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block px-10 py-4 text-purple-500 border border-purple-500 font-semibold rounded-lg hover:bg-purple-500 hover:text-black transition"
        >
          Plan een Gesprek
        </Link>
      </section>
    </>
  );
}
