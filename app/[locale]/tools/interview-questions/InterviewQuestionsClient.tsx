"use client";

import { useState } from "react";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import { MessageSquare, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function InterviewQuestionsClient() {
    const toolMetadata = getToolBySlug("interview-questions");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [experienceLevel, setExperienceLevel] = useState<"junior" | "medior" | "senior">("medior");
    const [questionCount, setQuestionCount] = useState(8);

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess } = usePaywallTool({
        apiEndpoint: "/api/v1/hr/interview-questions",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (jobTitle.trim().length < 3 || jobDescription.trim().length < 20) return;
        execute({ jobTitle, jobDescription, experienceLevel, questionCount });
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    const data = state.data as any;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    {toolMetadata.title}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Functietitel</label>
                            <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800" placeholder="Frontend Developer" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Ervaringsniveau</label>
                            <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value as any)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                <option value="junior">Junior</option>
                                <option value="medior">Medior</option>
                                <option value="senior">Senior</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Functiebeschrijving</label>
                        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[100px]" placeholder="Beschrijf de functie..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Aantal vragen: {questionCount}</label>
                        <input type="range" min="3" max="15" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={state.status === "loading" || jobTitle.trim().length < 3 || jobDescription.trim().length < 20} 
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                    >
                        {state.status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                         jobTitle.trim().length < 3 ? "Titel te kort" :
                         jobDescription.trim().length < 20 ? "Omschrijving te kort (min. 20 tekens)" : "Genereer Vragen"}
                    </button>
                </form>

                {state.status === "error" && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5" /><p>{state.error}</p>
                    </div>
                )}

                {state.status === "success" && data?.questions && (
                    <div className="mt-8 space-y-4">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-3 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <p className="font-medium">{data.questions.length} vragen gegenereerd</p>
                        </div>
                        <div className="space-y-3">
                            {data.questions.map((q: any, i: number) => (
                                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{q.category}</span>
                                    <p className="mt-2">{q.question}</p>
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
