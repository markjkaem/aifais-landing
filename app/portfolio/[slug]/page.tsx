import Link from "next/link";
import { projects } from "../data";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const project = projects.find((p) => p.slug === slug);
  console.log(project);

  return (
    <>
      <section className="py-24 bg-gray-950 min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">{project?.title}</h1>
          <img
            src={project?.image}
            alt={project?.title}
            className="w-full h-80 object-cover rounded-2xl mb-8"
          />
          <p className="text-gray-300 mb-6">{project?.description}</p>

          <h2 className="text-2xl font-semibold mb-4">Key Features & Impact</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            {project?.details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>
      </section>
      {/* AFSLUITENDE CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold">
          Klaar om jouw bedrijf toekomstbestendig te maken?
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Samen ontwerpen we jouw AI-voorsprong.
        </p>
        <Link
          href="/contact"
          className={`mt-8 inline-block px-10 py-4 text-purple-500 border border-purple-500 font-semibold rounded-lg hover:bg-purple-500 hover:text-black transition`}
        >
          Plan een Gesprek
        </Link>
      </section>
    </>
  );
}
