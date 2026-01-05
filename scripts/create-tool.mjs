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
  const apiTemplate = `import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";
import { getToolBySlug } from "@/config/tools";

// 1. Define input schema
const schema = z.object({
  // Add your fields here
  prompt: z.string().min(1),
  signature: z.string().optional(),
  stripeSessionId: z.string().optional(),
});

// 2. Define handler
const tool = getToolBySlug("${id}");

export const POST = createToolHandler({
  schema,
  pricing: tool?.pricing.type === "paid" ? { 
    price: tool.pricing.price!, 
    currency: tool.pricing.currency! 
  } : undefined,
  handler: async (input, context) => {
    // 3. Execute AIService (Example)
    /*
    const message = await anthropic.messages.create({ ... });
    const responseText = message.content[0].text;
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Geen geldige JSON gevonden");
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error("Kon AI respons niet verwerken");
    }
    */
    
    return {
       success: true,
       message: "Tool successfully executed",
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

  // 5. Create Test Template
  const toolNamePascal = id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  const testTemplate = `const LOCAL_API_URL = "http://localhost:3000";

// ============================================
// TEST: ${title}
// ============================================

async function test${toolNamePascal}() {
    console.log('\\n' + '='.repeat(60));
    console.log('🧪 TEST: ${title}');
    console.log('='.repeat(60));
    console.log('📝 Testing ${title} API endpoint');
    console.log('');

    const payload = {
        prompt: "Test input voor ${title}",
        signature: "DEV_BYPASS"
    };

    console.log('📤 Sending request to:', \`\${LOCAL_API_URL}/api/v1/${category}/${id}\`);
    console.log('');

    try {
        const response = await fetch(\`\${LOCAL_API_URL}/api/v1/${category}/${id}\`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": LOCAL_API_URL
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        console.log(\`📊 RESPONSE STATUS: \${response.status}\`);
        console.log('📋 RESPONSE DATA:');
        console.log(JSON.stringify(data, null, 2));
        console.log('');

        if (response.ok && data.success) {
            console.log("✅ ${title} Test PASSED");
        } else {
            console.log("❌ ${title} Test FAILED");
            console.log(\`   Error: \${data.error || 'Unknown error'}\`);
        }

    } catch (error) {
        console.error("\\n❌ Network/Script Error:", error.message);
        process.exit(1);
    }
}

test${toolNamePascal}();
`;

  // 6. Write Files
  const testPath = path.join(rootDir, "scripts", "tests", `test-${id}.js`);
  await fs.writeFile(path.join(apiPath, "route.ts"), apiTemplate);
  const clientFileName = `${id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Client.tsx`;
  await fs.writeFile(path.join(clientPath, clientFileName), clientTemplate);
  // NOTE: No page.tsx - the dynamic [toolId]/page.tsx handles routing via componentMap
  await fs.writeFile(testPath, testTemplate);

  // 7. Register test in test-all.js
  const testAllPath = path.join(rootDir, "scripts", "test-all.js");
  let testAllContent = await fs.readFile(testAllPath, "utf-8");

  const newTestEntry = `    {
        name: '${title}',
        script: 'test-${id}.js',
        description: 'Tests ${title} API endpoint'
    },`;

  // Insert before the closing bracket of the tests array
  testAllContent = testAllContent.replace(
    /(\s*}\s*\n\];)/,
    `,\n${newTestEntry}\n];`
  );
  await fs.writeFile(testAllPath, testAllContent);

  const componentName = `${id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Client`;
  console.log("\n✅ Bestanden aangemaakt:");
  console.log(`- API: app/api/v1/${category}/${id}/route.ts`);
  console.log(`- Client: app/[locale]/tools/${id}/${componentName}.tsx`);
  console.log(`- Test: scripts/tests/test-${id}.js`);

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
        componentPath: "${id}/${id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Client",
    },
    `);

  console.log("\n✅ Test automatisch geregistreerd in test-all.js");
  console.log("\n⚠️ BELANGRIJK: Voeg ook de component toe aan de componentMap in:");
  console.log(`   app/[locale]/tools/[toolId]/page.tsx`);
  console.log(`   Voeg toe: "${id}/${id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Client": require("@/app/[locale]/tools/${id}/${id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Client").default,`);
  console.log("\n   Run 'node scripts/test-all.js' om alle tests uit te voeren.\n");

  rl.close();
}

main().catch(console.error);
