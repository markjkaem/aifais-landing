"use client";

import { useState } from "react";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import { Briefcase, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PitchDeckClient() {
    const toolMetadata = getToolBySlug("pitch-deck");
    const [companyName, setCompanyName] = useState("");
    const [productService, setProductService] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [problemSolution, setProblemSolution] = useState("");
    const [uniqueValue, setUniqueValue] = useState("");
    const [slideCount, setSlideCount] = useState(10);

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess } = usePaywallTool({
        apiEndpoint: "/api/v1/sales/pitch-deck",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName.trim().length < 2 || productService.trim().length < 20) return;
        execute({ companyName, productService, targetAudience, problemSolution, uniqueValue, slideCount });
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    const data = state.data as any;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-primary" />
                    {toolMetadata.title}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Bedrijfsnaam</label>
                            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800" placeholder="TechStartup BV" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Aantal slides: {slideCount}</label>
                            <input type="range" min="5" max="15" value={slideCount} onChange={(e) => setSlideCount(Number(e.target.value))} className="w-full mt-3" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Product/Service</label>
                        <textarea value={productService} onChange={(e) => setProductService(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[80px]" placeholder="Wat bied je aan?" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Doelgroep</label>
                        <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800" placeholder="MKB bedrijven met 10-100 medewerkers" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Probleem & Oplossing</label>
                        <textarea value={problemSolution} onChange={(e) => setProblemSolution(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[80px]" placeholder="Welk probleem los je op?" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Unieke Waarde</label>
                        <textarea value={uniqueValue} onChange={(e) => setUniqueValue(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[80px]" placeholder="Wat maakt jullie uniek?" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={state.status === "loading" || companyName.trim().length < 2 || productService.trim().length < 20} 
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                    >
                        {state.status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                         companyName.trim().length < 2 ? "Bedrijfsnaam te kort" :
                         productService.trim().length < 20 ? "Onderwerp te kort (min. 20 tekens)" : "Genereer Pitch Deck"}
                    </button>
                </form>

                {state.status === "error" && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5" /><p>{state.error}</p>
                    </div>
                )}

                {state.status === "success" && data?.slides && (
                    <div className="mt-8 space-y-4">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-3 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <p className="font-medium">{data.slides.length} slides gegenereerd</p>
                        </div>
                        <div className="space-y-4">
                            {data.slides.map((slide: any, i: number) => (
                                <div key={i} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                                        <h3 className="font-bold text-lg">{slide.title}</h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400">{slide.content}</p>
                                    {slide.speakerNotes && <p className="mt-3 text-sm text-slate-400 italic">💡 {slide.speakerNotes}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <PaywallToolWrapper toolMetadata={toolMetadata} isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />
        </div>
    );
}
