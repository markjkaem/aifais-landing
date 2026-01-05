"use client";

import { useState } from "react";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { getToolBySlug } from "@/config/tools";
import { Megaphone, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SocialPlannerClient() {
    const toolMetadata = getToolBySlug("social-planner");
    const [topic, setTopic] = useState("");
    const [platforms, setPlatforms] = useState<string[]>(["linkedin"]);
    const [postCount, setPostCount] = useState(5);
    const [tone, setTone] = useState<"professional" | "casual" | "inspirational" | "educational">("professional");

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess } = usePaywallTool({
        apiEndpoint: "/api/v1/marketing/social-planner",
        requiredAmount: toolMetadata?.pricing.price,
    });

    const togglePlatform = (p: string) => {
        setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim().length < 5 || platforms.length === 0) return;
        execute({ topic, platforms, postCount, tone, includeHashtags: true });
    };

    if (!toolMetadata) return <div>Tool niet gevonden</div>;

    const data = state.data as any;
    const platformOptions = ["linkedin", "instagram", "facebook", "twitter", "tiktok"];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-primary" />
                    {toolMetadata.title}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Onderwerp</label>
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800" placeholder="AI automatisering voor MKB" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Platforms</label>
                        <div className="flex flex-wrap gap-2">
                            {platformOptions.map(p => (
                                <button key={p} type="button" onClick={() => togglePlatform(p)} className={`px-4 py-2 rounded-full border ${platforms.includes(p) ? "bg-primary text-white border-primary" : "border-slate-300"}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Tone</label>
                            <select value={tone} onChange={(e) => setTone(e.target.value as any)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                <option value="professional">Professioneel</option>
                                <option value="casual">Casual</option>
                                <option value="inspirational">Inspirerend</option>
                                <option value="educational">Educatief</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Aantal posts: {postCount}</label>
                            <input type="range" min="1" max="10" value={postCount} onChange={(e) => setPostCount(Number(e.target.value))} className="w-full mt-3" />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={state.status === "loading" || topic.trim().length < 5 || platforms.length === 0} 
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                    >
                        {state.status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                         topic.trim().length < 5 ? "Onderwerp te kort" : "Genereer Posts"}
                    </button>
                </form>

                {state.status === "error" && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5" /><p>{state.error}</p>
                    </div>
                )}

                {state.status === "success" && data?.posts && (
                    <div className="mt-8 space-y-4">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-3 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <p className="font-medium">{data.posts.length} posts gegenereerd</p>
                        </div>
                        <div className="space-y-4">
                            {data.posts.map((post: any, i: number) => (
                                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded uppercase">{post.platform}</span>
                                        <span className="text-xs text-slate-500">{post.bestTime}</span>
                                    </div>
                                    <p className="mb-2">{post.content}</p>
                                    <div className="flex flex-wrap gap-1">{post.hashtags?.map((h: string, j: number) => <span key={j} className="text-xs text-primary">{h}</span>)}</div>
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
