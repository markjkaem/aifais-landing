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
  );
}
