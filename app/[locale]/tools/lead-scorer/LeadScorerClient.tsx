"use client";

import { useState } from "react";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import { Target, Loader2, AlertCircle } from "lucide-react";

export default function LeadScorerClient() {
    const toolMetadata = getToolBySlug("lead-scorer");
    const [companyName, setCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState<"1-10" | "11-50" | "51-200" | "201-500" | "500+">("11-50");
    const [budget, setBudget] = useState<"unknown" | "low" | "medium" | "high">("unknown");
    const [websiteVisits, setWebsiteVisits] = useState(0);
    const [demoRequested, setDemoRequested] = useState(false);
    const [notes, setNotes] = useState("");

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess } = usePaywallTool({
        apiEndpoint: "/api/v1/sales/lead-scorer",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName.trim().length < 2) return;
        execute({ companyName, industry, companySize, budget, engagement: { websiteVisits, demoRequested }, notes });
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    const data = state.data as any;
    const getTierColor = (tier: string) => tier === "hot" ? "bg-red-500" : tier === "warm" ? "bg-orange-500" : "bg-blue-500";

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    {toolMetadata.title}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Bedrijfsnaam</label>
                            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800" placeholder="Innovatie Partners BV" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Industrie</label>
                            <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800" placeholder="Consultancy" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Bedrijfsgrootte</label>
                            <select value={companySize} onChange={(e) => setCompanySize(e.target.value as any)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                <option value="1-10">1-10 medewerkers</option>
                                <option value="11-50">11-50 medewerkers</option>
                                <option value="51-200">51-200 medewerkers</option>
                                <option value="201-500">201-500 medewerkers</option>
                                <option value="500+">500+ medewerkers</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Budget Indicatie</label>
                            <select value={budget} onChange={(e) => setBudget(e.target.value as any)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                <option value="unknown">Onbekend</option>
                                <option value="low">Laag</option>
                                <option value="medium">Gemiddeld</option>
                                <option value="high">Hoog</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Website bezoeken: {websiteVisits}</label>
                            <input type="range" min="0" max="50" value={websiteVisits} onChange={(e) => setWebsiteVisits(Number(e.target.value))} className="w-full" />
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <input type="checkbox" id="demo" checked={demoRequested} onChange={(e) => setDemoRequested(e.target.checked)} className="w-4 h-4" />
                            <label htmlFor="demo">Demo aangevraagd</label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Notities (optioneel)</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[80px]" placeholder="Extra context..." />
                    </div>

                    <button 
                        type="submit" 
                        disabled={state.status === "loading" || companyName.trim().length < 2} 
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                    >
                        {state.status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                         companyName.trim().length < 2 ? "Bedrijfsnaam te kort" : "Score Lead"}
                    </button>
                </form>

                {state.status === "error" && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5" /><p>{state.error}</p>
                    </div>
                )}

                {state.status === "success" && data && (
                    <div className="mt-8 space-y-6">
                        <div className="flex items-center justify-center gap-6 p-6 bg-slate-50 dark:bg-slate-950 rounded-xl">
                            <div className="text-center">
                                <span className="text-5xl font-bold text-primary">{data.score}</span>
                                <p className="text-slate-500">Score</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-white font-bold uppercase ${getTierColor(data.tier)}`}>
                                {data.tier}
                            </span>
                        </div>

                        {data.factors && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(data.factors).map(([key, val]) => (
                                    <div key={key} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl text-center">
                                        <span className="text-2xl font-bold">{val as number}</span>
                                        <p className="text-xs text-slate-500 capitalize">{key}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.recommendations && (
                            <div className="p-4 bg-primary/5 rounded-xl">
                                <h3 className="font-bold mb-3">Aanbevelingen</h3>
                                <ul className="space-y-2">{data.recommendations.map((r: string, i: number) => <li key={i}>• {r}</li>)}</ul>
                            </div>
                        )}

                        {data.nextAction && (
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                <strong>Volgende stap:</strong> {data.nextAction}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <PaywallToolWrapper toolMetadata={toolMetadata} isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />
        </div>
    );
}
