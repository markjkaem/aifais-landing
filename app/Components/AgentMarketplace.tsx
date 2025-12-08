import {
  Bot,
  Zap,
  ArrowRight,
  Database,
  MessageSquare,
  Receipt,
} from "lucide-react";
import Link from "next/link";

const agents = [
  {
    id: 1,
    name: "Finance Flow",
    role: "Facturatie Specialist",
    description:
      "Waarom zelf typen? Ik monitor je CRM, detecteer gesloten deals en stuur de factuur direct uit. Foutloos en binnen 3 seconden.",
    icon: <Receipt className="w-6 h-6 text-white" />,
    capabilities: ["Exact Online", "Moneybird", "HubSpot"],
    status: "Active",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Lead Scout X",
    role: "Sales Development",
    description:
      "Ik verrijk nieuwe leads met data van LinkedIn en KvK. Voordat jij de telefoon oppakt, weet ik al wie de beslisser is.",
    icon: <Database className="w-6 h-6 text-white" />,
    capabilities: ["LinkedIn", "KvK API", "Pipedrive"],
    status: "Training",
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Inbox Zero",
    role: "Support Assistent",
    description:
      "Ik beantwoord 80% van de standaardvragen direct in jouw tone-of-voice. De moeilijke gevallen zet ik netjes voor je klaar.",
    icon: <MessageSquare className="w-6 h-6 text-white" />,
    capabilities: ["Gmail", "Outlook", "OpenAI"],
    status: "Beta",
    color: "bg-emerald-500",
  },
];

export default function AgentMarketplace() {
  return (
    <section className="w-full max-w-7xl mx-auto py-24 px-4">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Klaar met handwerk?{" "}
          <span className="text-[#3066be]">Huur een Agent.</span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Je hebt net ervaren hoe het is om handmatig werk te doen. Onze
          autonome agents nemen die taken volledig van je over, aangedreven door
          het X402 protocol.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="group relative bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* Status Dot */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  agent.status === "Active"
                    ? "bg-green-500 animate-pulse"
                    : "bg-amber-500"
                }`}
              ></span>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                {agent.status}
              </span>
            </div>

            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-2xl ${agent.color} flex items-center justify-center mb-6 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}
            >
              {agent.icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {agent.name}
              </h3>
              <p className="text-sm font-medium text-[#3066be] mb-4">
                {agent.role}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                {agent.description}
              </p>
            </div>

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {agent.capabilities.map((cap, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs font-medium text-gray-500"
                >
                  {cap}
                </span>
              ))}
            </div>

            {/* Action */}
            <Link
              href="/contact"
              className="w-full py-3 rounded-xl border-2 border-gray-100 text-gray-700 font-semibold group-hover:border-[#3066be] group-hover:bg-[#3066be] group-hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Configureer Agent</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0" />
            </Link>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600">
          <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>
            Al onze agents draaien op de nieuwe{" "}
            <strong>X402 infrastructuur</strong> voor latency-free handelen.
          </span>
        </div>
      </div>
    </section>
  );
}
