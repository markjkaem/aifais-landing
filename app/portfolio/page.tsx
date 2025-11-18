import Link from "next/link";
import { projects } from "../portfolio/data"; // your projects file

export default function Portfolio() {
  return (
    <>
      <section className="py-24 bg-gray-950 min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          <h1 className="text-4xl font-bold mb-12 text-center">
            Ons Portfolio
          </h1>

          <div className="grid md:grid-cols-3 gap-12">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group rounded-2xl overflow-hidden border border-gray-700 bg-gray-900 hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-300">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
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
