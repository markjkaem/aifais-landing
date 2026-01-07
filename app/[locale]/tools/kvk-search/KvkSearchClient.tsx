"use client";

import { useState, useCallback } from "react";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { ToolLoadingState } from "@/app/Components/tools/ToolLoadingState";
import { getToolBySlug } from "@/config/tools";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    Search,
    MapPin,
    Globe,
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    Mail,
    Phone,
    Users,
    Calendar,
    Hash,
    Loader2,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    ExternalLink,
    Star,
    Newspaper,
    Code2,
    TrendingUp,
    Shield,
    ArrowLeft,
    Download,
    Copy,
    Check,
    Sparkles,
    BarChart3,
    Target,
    Lightbulb,
} from "lucide-react";

// Types matching the API response
interface CompanySearchResult {
    kvkNummer: string;
    naam: string;
    adres: string;
    plaats: string;
    type: string;
    actief: boolean;
}

interface CompanyProfile {
    kvk: {
        kvkNummer: string;
        rsin: string | null;
        naam: string;
        handelsnamen: string[];
        rechtsvorm: string | null;
        oprichtingsdatum: string | null;
        actief: boolean;
        sbiCodes: Array<{ code: string; omschrijving: string }>;
        aantalMedewerkers: string;
        hoofdactiviteit: string;
    };
    adres: {
        straat: string | null;
        huisnummer: string | null;
        postcode: string | null;
        plaats: string | null;
        volledig: string;
        geoLocatie: { lat: number; lng: number } | null;
    };
    online: {
        website: string | null;
        email: string | null;
        telefoon: string | null;
        socials: {
            linkedin: string | null;
            twitter: string | null;
            facebook: string | null;
            instagram: string | null;
            youtube: string | null;
        };
    };
    techStack: {
        cms: string[];
        frameworks: string[];
        analytics: string[];
        payments: string[];
        marketing: string[];
        ecommerce: string[];
        hosting: string[];
        other: string[];
        totalDetected: number;
    };
    reviews: {
        google: { rating: number; count: number; url?: string } | null;
        trustpilot: { rating: number; count: number; url?: string } | null;
        averageRating: number | null;
        totalReviews: number;
    };
    nieuws: Array<{
        titel: string;
        bron: string;
        datum: string;
        url: string;
    }>;
    aiAnalyse: {
        samenvatting: string;
        branche: string;
        sterkePunten: string[];
        aandachtspunten: string[];
        groeiScore: number;
        digitalScore: number;
        reputatieScore: number;
        overallScore: number;
        aanbevelingen: string[];
        confidence: number;
    } | null;
    meta: {
        timestamp: string;
        bronnen: string[];
        verwerkingstijd: number;
        kvkConfigured: boolean;
        errors: string[];
    };
}

type ApiResponse =
    | { type: "search"; results: CompanySearchResult[]; total: number; meta: any }
    | { type: "profile"; profile: CompanyProfile };

export default function KvkSearchClient() {
    const toolMetadata = getToolBySlug("kvk-search");

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState<"naam" | "kvkNummer">("naam");
    const [plaats, setPlaats] = useState("");
    const [inclusiefInactief, setInclusiefInactief] = useState(false);

    // Results state
    const [searchResults, setSearchResults] = useState<CompanySearchResult[] | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<CompanyProfile | null>(null);
    const [copied, setCopied] = useState(false);

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess } = usePaywallTool({
        apiEndpoint: "/api/v1/business/kvk-search",
        requiredAmount: toolMetadata?.pricing.price,
    });

    // Handle search
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearchResults(null);
        setSelectedProfile(null);

        execute({
            query: searchQuery.trim(),
            type: searchType,
            plaats: plaats.trim() || undefined,
            inclusiefInactief,
            getFullProfile: false,
        });
    };

    // Handle selecting a company for full profile
    const handleSelectCompany = async (kvkNummer: string) => {
        setSelectedProfile(null);

        execute({
            query: kvkNummer,
            type: "kvkNummer",
            getFullProfile: true,
            enrichments: {
                website: true,
                socials: true,
                techStack: true,
                news: true,
                reviews: true,
                aiAnalysis: true,
            },
        });
    };

    // Update results when state changes
    if (state.status === "success" && state.data) {
        const data = state.data as ApiResponse;
        if (data.type === "search" && !searchResults) {
            setSearchResults(data.results);
        } else if (data.type === "profile" && !selectedProfile) {
            setSelectedProfile(data.profile);
        }
    }

    // Back to search results
    const handleBackToResults = () => {
        setSelectedProfile(null);
    };

    // Copy to clipboard
    const handleCopy = useCallback(async () => {
        if (!selectedProfile) return;
        await navigator.clipboard.writeText(JSON.stringify(selectedProfile, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [selectedProfile]);

    // Download JSON
    const handleDownloadJson = useCallback(() => {
        if (!selectedProfile) return;
        const blob = new Blob([JSON.stringify(selectedProfile, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedProfile.kvk.naam.replace(/[^a-zA-Z0-9]/g, "_")}_bedrijfsprofiel.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [selectedProfile]);

    // Render score bar
    const ScoreBar = ({ score, label, color = "emerald" }: { score: number; label: string; color?: string }) => (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-zinc-600">{label}</span>
                <span className="font-semibold text-zinc-900">{score}/100</span>
            </div>
            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${
                        color === "emerald" ? "bg-emerald-500" :
                        color === "blue" ? "bg-blue-500" :
                        color === "amber" ? "bg-amber-500" : "bg-zinc-500"
                    }`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );

    // Render star rating
    const StarRating = ({ rating, count }: { rating: number; count: number }) => (
        <div className="flex items-center gap-2">
            <div className="flex">
                {[1, 2, 3, 4, 5].map(i => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${
                            i <= Math.floor(rating)
                                ? "text-amber-400 fill-amber-400"
                                : i - 0.5 <= rating
                                    ? "text-amber-400 fill-amber-400/50"
                                    : "text-zinc-200"
                        }`}
                    />
                ))}
            </div>
            <span className="text-sm font-medium text-zinc-700">{rating.toFixed(1)}</span>
            <span className="text-sm text-zinc-400">({count} reviews)</span>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Search Form */}
            {!selectedProfile && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm"
                >
                    <form onSubmit={handleSearch} className="space-y-4">
                        {/* Search Type Toggle */}
                        <div className="flex gap-2 p-1 bg-zinc-100 rounded-lg w-fit">
                            <button
                                type="button"
                                onClick={() => setSearchType("naam")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    searchType === "naam"
                                        ? "bg-white text-zinc-900 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-700"
                                }`}
                            >
                                Bedrijfsnaam
                            </button>
                            <button
                                type="button"
                                onClick={() => setSearchType("kvkNummer")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    searchType === "kvkNummer"
                                        ? "bg-white text-zinc-900 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-700"
                                }`}
                            >
                                KVK Nummer
                            </button>
                        </div>

                        {/* Main Search Input */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={searchType === "naam" ? "Zoek op bedrijfsnaam..." : "Voer KVK nummer in (8 cijfers)..."}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-lg"
                            />
                        </div>

                        {/* Additional Filters */}
                        {searchType === "naam" && (
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-zinc-600 mb-1">
                                        Plaats (optioneel)
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                        <input
                                            type="text"
                                            value={plaats}
                                            onChange={(e) => setPlaats(e.target.value)}
                                            placeholder="Amsterdam, Rotterdam..."
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 py-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={inclusiefInactief}
                                            onChange={(e) => setInclusiefInactief(e.target.checked)}
                                            className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-zinc-600">Inclusief inactieve bedrijven</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!searchQuery.trim() || state.status === "loading"}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                        >
                            {state.status === "loading" ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Zoeken...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Zoek Bedrijf
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            )}

            {/* Loading State */}
            {state.status === "loading" && (
                <ToolLoadingState
                    message={selectedProfile === null && searchResults !== null ? "Bedrijfsprofiel laden..." : "Zoeken..."}
                    subMessage="Dit kan enkele seconden duren"
                />
            )}

            {/* Error State */}
            {state.status === "error" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-6"
                >
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-800">Er ging iets mis</h3>
                            <p className="text-red-600 mt-1">{state.error}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Search Results */}
            <AnimatePresence mode="wait">
                {searchResults && searchResults.length > 0 && !selectedProfile && state.status !== "loading" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-zinc-900">
                                {searchResults.length} {searchResults.length === 1 ? "bedrijf" : "bedrijven"} gevonden
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {searchResults.map((result, index) => (
                                <motion.button
                                    key={result.kvkNummer}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleSelectCompany(result.kvkNummer)}
                                    className="w-full text-left bg-white rounded-xl border border-zinc-200 p-5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                                                    {result.naam}
                                                </h3>
                                                {result.actief ? (
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                                                        Actief
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-xs font-medium rounded-full">
                                                        Inactief
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-zinc-500">
                                                <span className="flex items-center gap-1">
                                                    <Hash className="w-3.5 h-3.5" />
                                                    KVK: {result.kvkNummer}
                                                </span>
                                                {result.plaats && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {result.plaats}
                                                    </span>
                                                )}
                                                <span className="text-zinc-400">{result.type}</span>
                                            </div>
                                            {result.adres && (
                                                <p className="text-sm text-zinc-400 mt-1">{result.adres}</p>
                                            )}
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* No Results */}
                {searchResults && searchResults.length === 0 && state.status !== "loading" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Building2 className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-zinc-600">Geen bedrijven gevonden</h3>
                        <p className="text-zinc-400 mt-1">Probeer een andere zoekterm of controleer de spelling</p>
                    </motion.div>
                )}

                {/* Company Profile */}
                {selectedProfile && state.status !== "loading" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Back Button & Actions */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleBackToResults}
                                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Terug naar resultaten
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? "Gekopieerd!" : "Kopieer JSON"}
                                </button>
                                <button
                                    onClick={handleDownloadJson}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>

                        {/* Company Header */}
                        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                                    <Building2 className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-zinc-900">{selectedProfile.kvk.naam}</h1>
                                        {selectedProfile.kvk.actief ? (
                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                                                Actief
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                                                Inactief
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-zinc-500 mt-1">{selectedProfile.kvk.hoofdactiviteit || selectedProfile.kvk.rechtsvorm}</p>

                                    {/* Quick Stats */}
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                                            <Hash className="w-4 h-4 text-zinc-400" />
                                            KVK: {selectedProfile.kvk.kvkNummer}
                                        </div>
                                        {selectedProfile.adres.plaats && (
                                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                <MapPin className="w-4 h-4 text-zinc-400" />
                                                {selectedProfile.adres.plaats}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                                            <Users className="w-4 h-4 text-zinc-400" />
                                            {selectedProfile.kvk.aantalMedewerkers}
                                        </div>
                                        {selectedProfile.kvk.oprichtingsdatum && (
                                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                <Calendar className="w-4 h-4 text-zinc-400" />
                                                Sinds {new Date(selectedProfile.kvk.oprichtingsdatum).getFullYear()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Analysis */}
                        {selectedProfile.aiAnalyse && (
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/50 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-emerald-600" />
                                    <h2 className="text-lg font-semibold text-zinc-900">AI Analyse</h2>
                                    <span className="text-xs text-zinc-400 ml-auto">
                                        {selectedProfile.aiAnalyse.confidence}% betrouwbaarheid
                                    </span>
                                </div>

                                <p className="text-zinc-700 mb-6">{selectedProfile.aiAnalyse.samenvatting}</p>

                                {/* Score Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white/80 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold text-emerald-600">{selectedProfile.aiAnalyse.overallScore}</div>
                                        <div className="text-sm text-zinc-500">Overall Score</div>
                                    </div>
                                    <div className="bg-white/80 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold text-blue-600">{selectedProfile.aiAnalyse.groeiScore}</div>
                                        <div className="text-sm text-zinc-500">Groei</div>
                                    </div>
                                    <div className="bg-white/80 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold text-purple-600">{selectedProfile.aiAnalyse.digitalScore}</div>
                                        <div className="text-sm text-zinc-500">Digitaal</div>
                                    </div>
                                    <div className="bg-white/80 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold text-amber-600">{selectedProfile.aiAnalyse.reputatieScore}</div>
                                        <div className="text-sm text-zinc-500">Reputatie</div>
                                    </div>
                                </div>

                                {/* Strengths & Weaknesses */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white/80 rounded-xl p-4">
                                        <h3 className="flex items-center gap-2 font-semibold text-emerald-700 mb-3">
                                            <TrendingUp className="w-4 h-4" />
                                            Sterke Punten
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedProfile.aiAnalyse.sterkePunten.map((punt, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                    {punt}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white/80 rounded-xl p-4">
                                        <h3 className="flex items-center gap-2 font-semibold text-amber-700 mb-3">
                                            <Target className="w-4 h-4" />
                                            Aandachtspunten
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedProfile.aiAnalyse.aandachtspunten.map((punt, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                                                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                                    {punt}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                {selectedProfile.aiAnalyse.aanbevelingen.length > 0 && (
                                    <div className="mt-4 bg-white/80 rounded-xl p-4">
                                        <h3 className="flex items-center gap-2 font-semibold text-zinc-700 mb-3">
                                            <Lightbulb className="w-4 h-4 text-amber-500" />
                                            Aanbevelingen
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedProfile.aiAnalyse.aanbevelingen.map((aanbeveling, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                                                    <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-semibold shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    {aanbeveling}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Info Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* KVK Data */}
                            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4">
                                    <Shield className="w-5 h-5 text-zinc-400" />
                                    KVK Gegevens
                                </h2>
                                <dl className="space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-zinc-500">KVK Nummer</dt>
                                        <dd className="font-medium text-zinc-900">{selectedProfile.kvk.kvkNummer}</dd>
                                    </div>
                                    {selectedProfile.kvk.rsin && (
                                        <div className="flex justify-between">
                                            <dt className="text-zinc-500">RSIN</dt>
                                            <dd className="font-medium text-zinc-900">{selectedProfile.kvk.rsin}</dd>
                                        </div>
                                    )}
                                    {selectedProfile.kvk.rechtsvorm && (
                                        <div className="flex justify-between">
                                            <dt className="text-zinc-500">Rechtsvorm</dt>
                                            <dd className="font-medium text-zinc-900">{selectedProfile.kvk.rechtsvorm}</dd>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <dt className="text-zinc-500">Medewerkers</dt>
                                        <dd className="font-medium text-zinc-900">{selectedProfile.kvk.aantalMedewerkers}</dd>
                                    </div>
                                    {selectedProfile.kvk.oprichtingsdatum && (
                                        <div className="flex justify-between">
                                            <dt className="text-zinc-500">Opgericht</dt>
                                            <dd className="font-medium text-zinc-900">
                                                {new Date(selectedProfile.kvk.oprichtingsdatum).toLocaleDateString("nl-NL")}
                                            </dd>
                                        </div>
                                    )}
                                    {selectedProfile.adres.volledig && (
                                        <div className="pt-2 border-t">
                                            <dt className="text-zinc-500 mb-1">Adres</dt>
                                            <dd className="font-medium text-zinc-900">{selectedProfile.adres.volledig}</dd>
                                        </div>
                                    )}
                                </dl>

                                {/* SBI Codes */}
                                {selectedProfile.kvk.sbiCodes.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h3 className="text-sm font-medium text-zinc-500 mb-2">Activiteiten (SBI)</h3>
                                        <div className="space-y-2">
                                            {selectedProfile.kvk.sbiCodes.map((sbi, i) => (
                                                <div key={i} className="flex gap-2 text-sm">
                                                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded font-mono text-xs">
                                                        {sbi.code}
                                                    </span>
                                                    <span className="text-zinc-600">{sbi.omschrijving}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Online Presence */}
                            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4">
                                    <Globe className="w-5 h-5 text-zinc-400" />
                                    Online Aanwezigheid
                                </h2>

                                <div className="space-y-3">
                                    {selectedProfile.online.website && (
                                        <a
                                            href={selectedProfile.online.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-zinc-400" />
                                                <span className="text-zinc-700 group-hover:text-emerald-600 transition-colors">
                                                    {selectedProfile.online.website.replace(/^https?:\/\//, "")}
                                                </span>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500" />
                                        </a>
                                    )}

                                    {selectedProfile.online.email && (
                                        <a
                                            href={`mailto:${selectedProfile.online.email}`}
                                            className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
                                        >
                                            <Mail className="w-5 h-5 text-zinc-400" />
                                            <span className="text-zinc-700 group-hover:text-emerald-600 transition-colors">
                                                {selectedProfile.online.email}
                                            </span>
                                        </a>
                                    )}

                                    {selectedProfile.online.telefoon && (
                                        <a
                                            href={`tel:${selectedProfile.online.telefoon}`}
                                            className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
                                        >
                                            <Phone className="w-5 h-5 text-zinc-400" />
                                            <span className="text-zinc-700 group-hover:text-emerald-600 transition-colors">
                                                {selectedProfile.online.telefoon}
                                            </span>
                                        </a>
                                    )}

                                    {/* Social Links */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {selectedProfile.online.socials.linkedin && (
                                            <a
                                                href={selectedProfile.online.socials.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-[#0A66C2]/10 text-[#0A66C2] rounded-lg hover:bg-[#0A66C2]/20 transition-colors"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {selectedProfile.online.socials.twitter && (
                                            <a
                                                href={selectedProfile.online.socials.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors"
                                            >
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        )}
                                        {selectedProfile.online.socials.facebook && (
                                            <a
                                                href={selectedProfile.online.socials.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-[#1877F2]/10 text-[#1877F2] rounded-lg hover:bg-[#1877F2]/20 transition-colors"
                                            >
                                                <Facebook className="w-5 h-5" />
                                            </a>
                                        )}
                                        {selectedProfile.online.socials.instagram && (
                                            <a
                                                href={selectedProfile.online.socials.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-gradient-to-br from-[#F58529]/10 to-[#DD2A7B]/10 text-[#DD2A7B] rounded-lg hover:from-[#F58529]/20 hover:to-[#DD2A7B]/20 transition-colors"
                                            >
                                                <Instagram className="w-5 h-5" />
                                            </a>
                                        )}
                                        {selectedProfile.online.socials.youtube && (
                                            <a
                                                href={selectedProfile.online.socials.youtube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-[#FF0000]/10 text-[#FF0000] rounded-lg hover:bg-[#FF0000]/20 transition-colors"
                                            >
                                                <Youtube className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>

                                    {!selectedProfile.online.website &&
                                     !selectedProfile.online.email &&
                                     !Object.values(selectedProfile.online.socials).some(Boolean) && (
                                        <p className="text-zinc-400 text-sm">Geen online aanwezigheid gevonden</p>
                                    )}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            {selectedProfile.techStack.totalDetected > 0 && (
                                <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                                    <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4">
                                        <Code2 className="w-5 h-5 text-zinc-400" />
                                        Tech Stack
                                        <span className="text-sm font-normal text-zinc-400">
                                            ({selectedProfile.techStack.totalDetected} technologieën)
                                        </span>
                                    </h2>

                                    <div className="space-y-4">
                                        {selectedProfile.techStack.cms.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">CMS</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProfile.techStack.cms.map((tech, i) => (
                                                        <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedProfile.techStack.frameworks.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Frameworks</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProfile.techStack.frameworks.map((tech, i) => (
                                                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedProfile.techStack.analytics.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Analytics</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProfile.techStack.analytics.map((tech, i) => (
                                                        <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedProfile.techStack.payments.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Payments</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProfile.techStack.payments.map((tech, i) => (
                                                        <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedProfile.techStack.marketing.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Marketing</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProfile.techStack.marketing.map((tech, i) => (
                                                        <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 text-sm rounded-full">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Reviews */}
                            {selectedProfile.reviews.totalReviews > 0 && (
                                <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                                    <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4">
                                        <Star className="w-5 h-5 text-amber-400" />
                                        Reviews
                                    </h2>

                                    <div className="space-y-4">
                                        {selectedProfile.reviews.google && (
                                            <div className="p-4 bg-zinc-50 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-zinc-700">Google</span>
                                                    {selectedProfile.reviews.google.url && (
                                                        <a
                                                            href={selectedProfile.reviews.google.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-emerald-600 hover:underline"
                                                        >
                                                            Bekijken
                                                        </a>
                                                    )}
                                                </div>
                                                <StarRating
                                                    rating={selectedProfile.reviews.google.rating}
                                                    count={selectedProfile.reviews.google.count}
                                                />
                                            </div>
                                        )}
                                        {selectedProfile.reviews.trustpilot && (
                                            <div className="p-4 bg-zinc-50 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-zinc-700">Trustpilot</span>
                                                    {selectedProfile.reviews.trustpilot.url && (
                                                        <a
                                                            href={selectedProfile.reviews.trustpilot.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-emerald-600 hover:underline"
                                                        >
                                                            Bekijken
                                                        </a>
                                                    )}
                                                </div>
                                                <StarRating
                                                    rating={selectedProfile.reviews.trustpilot.rating}
                                                    count={selectedProfile.reviews.trustpilot.count}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* News */}
                        {selectedProfile.nieuws.length > 0 && (
                            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4">
                                    <Newspaper className="w-5 h-5 text-zinc-400" />
                                    Recent Nieuws
                                </h2>

                                <div className="space-y-3">
                                    {selectedProfile.nieuws.map((artikel, i) => (
                                        <a
                                            key={i}
                                            href={artikel.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-4 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors group"
                                        >
                                            <h3 className="font-medium text-zinc-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                {artikel.titel}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
                                                <span>{artikel.bron}</span>
                                                <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                                                <span>{artikel.datum}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="text-center text-sm text-zinc-400">
                            <p>
                                Gegenereerd in {(selectedProfile.meta.verwerkingstijd / 1000).toFixed(1)}s |
                                Bronnen: {selectedProfile.meta.bronnen.join(", ")}
                            </p>
                            {selectedProfile.meta.errors.length > 0 && (
                                <p className="text-amber-500 mt-1">
                                    Waarschuwingen: {selectedProfile.meta.errors.length}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment Modal */}
            <PaywallToolWrapper
                toolMetadata={toolMetadata!}
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
}
