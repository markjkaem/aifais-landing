"use client";

import { useState } from "react";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import { TrendingUp, Loader2, AlertCircle } from "lucide-react";

export default function SeoAuditClient() {
    const toolMetadata = getToolBySlug("seo-audit");
    const [url, setUrl] = useState("");
    const [focusKeywords, setFocusKeywords] = useState("");

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess } = usePaywallTool({
        apiEndpoint: "/api/v1/marketing/seo-audit",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim().length < 5) return;
        execute({ url, focusKeywords: focusKeywords.split(",").map(k => k.trim()).filter(Boolean) });
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    const data = state.data as any;
    const getScoreColor = (score: number) => score >= 80 ? "text-emerald-500" : score >= 60 ? "text-yellow-500" : "text-red-500";

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    {toolMetadata.title}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Website URL</label>
                        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800" placeholder="https://example.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Focus Keywords (optioneel)</label>
                        <input type="text" value={focusKeywords} onChange={(e) => setFocusKeywords(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800" placeholder="AI, automatisering, MKB" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={state.status === "loading" || url.trim().length < 5} 
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                    >
                        {state.status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                         url.trim().length < 5 ? "URL te kort" : "Analyseer Website"}
                    </button>
                </form>

                {state.status === "error" && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5" /><p>{state.error}</p>
                    </div>
                )}

                {state.status === "success" && data && (
                    <div className="mt-8 space-y-6">
                        <div className="text-center p-6 bg-slate-50 dark:bg-slate-950 rounded-xl">
                            <span className={`text-5xl font-bold ${getScoreColor(data.overallScore)}`}>{data.overallScore}</span>
                            <p className="text-slate-500 mt-2">Totaal Score</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            {data.categories && Object.entries(data.categories).map(([key, cat]: [string, any]) => (
                                <div key={key} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium capitalize">{key}</span>
                                        <span className={getScoreColor(cat.score)}>{cat.score}/100</span>
                                    </div>
                                    <ul className="text-sm text-slate-600 space-y-1">{cat.issues?.slice(0,3).map((i: string, idx: number) => <li key={idx}>• {i}</li>)}</ul>
                                </div>
                            ))}
                        </div>

                        {data.recommendations && (
                            <div className="p-4 bg-primary/5 rounded-xl">
                                <h3 className="font-bold mb-3">Aanbevelingen</h3>
                                <ul className="space-y-2">{data.recommendations.map((r: any, i: number) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded ${r.priority === "high" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>{r.priority}</span>
                                        <span>{r.action}</span>
                                    </li>
                                ))}</ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <PaywallToolWrapper toolMetadata={toolMetadata} isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />
        </div>
    );
}
