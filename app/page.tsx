export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden py-4">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-500 opacity-10" />
        <header className="px-10">
          <div>
            {" "}
            <h1 className="text-3xl">AI Faiss</h1>
          </div>
        </header>
        <div className="container mx-auto px-6 mt-32 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            AI Consulting & Automation for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Future-Ready Businesses
            </span>
          </h1>
          <p className="mt-6 text-xl max-w-2xl text-gray-600">
            Deploy smart automation, custom AI workflows, and data-aware
            copilots. We help companies scale, innovate, and operate faster in
            2026 and beyond.
          </p>

          <div className="mt-10 flex gap-4">
            <a
              href="/contact"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg rounded-lg"
            >
              Schedule Strategy Call
            </a>
            <a
              href="#services"
              className="px-6 py-3 border border-gray-300 hover:border-gray-400 rounded-lg text-lg"
            >
              Explore Solutions
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 opacity-80">
            <img src="/logo-1.svg" alt="Client Logo" className="h-10" />
            <img src="/logo-2.svg" alt="Client Logo" className="h-10" />
            <img src="/logo-3.svg" alt="Client Logo" className="h-10" />
            <img src="/logo-4.svg" alt="Client Logo" className="h-10" />
          </div>
        </div>
      </section>

      {/* IMAGE FEATURE */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f"
              alt="AI dashboard"
              className="rounded-2xl shadow-lg"
            />
            <div>
              <h2 className="text-4xl font-bold">
                Automation that actually delivers
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                From workflow automations to enterprise AI copilots — we design
                systems that reduce manual work, cut costs, and unlock new
                growth.
              </p>

              <ul className="mt-6 space-y-3 text-gray-700">
                <li>• AI workflow automation</li>
                <li>• Custom LLM agents & copilots</li>
                <li>• CRM & support automation</li>
                <li>• AI onboarding for teams</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-14">
            What We Build
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "AI Strategy & Advisory",
                text: "Executive-level AI roadmaps, technical review & deployment plans.",
              },
              {
                title: "End-to-End Automation",
                text: "Automated workflows across sales, operations, support & finance.",
              },
              {
                title: "Custom AI Agents",
                text: "Data-aware agents integrated with your stack and real-world tools.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="p-8 border rounded-2xl hover:shadow-xl transition"
              >
                <h3 className="text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-gray-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <h2 className="text-4xl font-bold">
          Ready to future-proof your business?
        </h2>
        <p className="mt-4 text-xl opacity-90">
          Let’s architect your AI advantage.
        </p>
        <a
          href="/contact"
          className="mt-8 inline-block px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-gray-200"
        >
          Book a Session
        </a>
      </section>
    </main>
  );
}
