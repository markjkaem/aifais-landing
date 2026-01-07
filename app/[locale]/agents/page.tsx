import { Metadata } from "next";
import AgentDemoClient from "./AgentDemoClient";

export const metadata: Metadata = {
  title: "AI Agent Demo | AIFAIS",
  description: "Bekijk live hoe een AI-agent een inbox verwerkt. Volledig autonoom, zonder input. Gratis demo.",
};

export default function AgentsPage() {
  return <AgentDemoClient />;
}
