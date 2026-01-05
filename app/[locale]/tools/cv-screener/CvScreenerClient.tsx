"use client";

import { useState } from "react";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import { Users, Loader2, AlertCircle, CheckCircle2, Upload } from "lucide-react";

export default function CvScreenerClient() {
    const toolMetadata = getToolBySlug("cv-screener");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess } = usePaywallTool({
        apiEndpoint: "/api/v1/hr/cv-screener",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setCvFile(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cvFile || jobDescription.trim().length < 20) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(",")[1];
            execute({
                cvBase64: base64,
                mimeType: cvFile.type || "application/pdf",
                jobDescription: jobDescription.trim()
            });
        };
        reader.readAsDataURL(cvFile);
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    const data = state.data as any;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" />
                    {toolMetadata.title}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Upload CV (PDF)</label>
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center">
                            <input type="file" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" id="cv-upload" />
                            <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                <Upload className="w-8 h-8 text-slate-400" />
                                <span>{cvFile ? cvFile.name : "Klik om CV te uploaden"}</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Vacature Omschrijving</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 min-h-[120px]"
                            placeholder="Beschrijf de functie en vereisten..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={state.status === "loading" || !cvFile || jobDescription.trim().length < 20} 
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                    >
                        {state.status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                         jobDescription.trim().length < 20 ? "Beschrijving te kort (min. 20 tekens)" : "Analyseren"}
                    </button>
                </form>

                {state.status === "error" && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        <p>{state.error}</p>
                    </div>
                )}

                {state.status === "success" && data && (
                    <div className="mt-8 space-y-4">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-3 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <p className="font-medium">Score: {data.score}/100</p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-4">
                            <p><strong>Samenvatting:</strong> {data.summary}</p>
                            <div><strong>Sterke punten:</strong><ul className="list-disc ml-5">{data.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                            <div><strong>Verbeterpunten:</strong><ul className="list-disc ml-5">{data.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul></div>
                            <p><strong>Aanbeveling:</strong> {data.recommendation}</p>
                        </div>
                    </div>
                )}
            </div>

            <PaywallToolWrapper toolMetadata={toolMetadata} isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />
        </div>
    );
}
