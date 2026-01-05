import fs from "fs/promises";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log("\n🚀 AIFAIS Tool Scaffolding\n");

    const id = await question("Tool ID (e.g. image-optimizer): ");
    const title = await question("Tool Titel (e.g. Image Optimizer): ");
    const slug = id;
    const category = await question("Categorie (finance/legal/hr/marketing/sales/tech): ");
    const description = await question("Korte beschrijving: ");
    const price = await question("Prijs in SOL (bijv. 0.001 of 0 voor gratis): ");

    const isPaid = parseFloat(price) > 0;

    const rootDir = process.cwd();
    const apiPath = path.join(rootDir, "app", "api", "v1", category, id);
    const clientPath = path.join(rootDir, "app", "[locale]", "tools", id);

    // 1. Create Directories
    await fs.mkdir(apiPath, { recursive: true });
    await fs.mkdir(clientPath, { recursive: true });

    // 2. Setup API Route Template
    const apiTemplate = `"use client";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";

// 1. Define input schema
const schema = z.object({
  // Add your fields here
  prompt: z.string().min(1),
});

// 2. Define handler
export const POST = createToolHandler({
  schema,
  pricing: ${isPaid ? `{ price: ${price}, currency: "SOL" }` : "undefined"},
  handler: async (input, context) => {
    // Add your business logic here
    // Example: const result = await someAIService(input.prompt);
    
    return {
       message: "Tool successfully executed",
       input: input.prompt,
       timestamp: new Date().toISOString()
    };
  },
});
`;

    // 3. Setup Client Component Template
    const clientTemplate = `"use client";

import { useState } from "react";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import { 
  Wand2, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";

export default function ${id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Client() {
  const toolMetadata = getToolBySlug("${slug}");
  const [prompt, setPrompt] = useState("");

  const {
    state,
    execute,
    showPaymentModal,
    setShowPaymentModal,
    handlePaymentSuccess
  } = usePaywallTool({
    apiEndpoint: "/api/v1/${category}/${id}",
    requiredAmount: ${price},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute({ prompt });
  };

  if (!toolMetadata) return <div>Tool niet gevonden</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-primary" />
          {toolMetadata.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Input</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary outline-none min-h-[120px]"
              placeholder="Vul hier je gegevens in..."
            />
          </div>

          <button
            type="submit"
            disabled={state.status === "loading"}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {state.status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Verwerken"
            )}
          </button>
        </form>

        {state.status === "error" && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{state.error}</p>
          </div>
        )}

        {state.status === "success" && (
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">Resultaat succesvol gegenereerd!</p>
            </div>
            
            <pre className="p-6 bg-slate-950 text-slate-50 rounded-xl overflow-x-auto text-sm border border-slate-800">
              {JSON.stringify(state.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <PaywallToolWrapper
        toolMetadata={toolMetadata}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
`;

    // 4. Create Page Template
    const pageTemplate = `import { Metadata } from "next";
import ${id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Client from "./ClientComponent"; // Check filename manually
import { getToolBySlug } from "@/config/tools";

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolBySlug("${slug}");
  return {
    title: tool?.metaTitle || "${title}",
    description: tool?.metaDescription || "${description}",
  };
}

export default function ToolPage() {
  return <${id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Client />;
}
`;

    // 5. Write Files
    await fs.writeFile(path.join(apiPath, "route.ts"), apiTemplate);
    // Note: I'm putting Client component in the same folder as page.tsx for simplicity in this template
    await fs.writeFile(path.join(clientPath, "ClientComponent.tsx"), clientTemplate);
    await fs.writeFile(path.join(clientPath, "page.tsx"), pageTemplate);

    console.log("\n✅ Bestanden aangemaakt:");
    console.log(`- API: app/api/v1/${category}/${id}/route.ts`);
    console.log(`- Page: app/[locale]/tools/${id}/page.tsx`);
    console.log(`- Client: app/[locale]/tools/${id}/ClientComponent.tsx`);

    console.log("\n⚠️ Vergeet niet de tool toe te voegen aan config/tools.ts:");
    console.log(`
    "${slug}": {
        id: "${id}",
        slug: "${slug}",
        title: "${title}",
        shortDescription: "${description}",
        longDescription: "${description}...",
        icon: Wand2,
        status: "live",
        category: "${category}",
        metaTitle: "${title} | AIFAIS",
        metaDescription: "${description}",
        keywords: ["${id}"],
        features: ["Feature 1"],
        useCases: ["UseCase 1"],
        pricing: {
            type: "${isPaid ? "paid" : "free"}",
            ${isPaid ? `price: ${price}, currency: "SOL"` : ""}
        },
        componentPath: "${id}/ClientComponent",
    },
    `);

    rl.close();
}

main().catch(console.error);
