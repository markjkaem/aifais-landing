"use client";

import { useState, useCallback, useEffect } from "react";
import { usePaywallTool } from "@/hooks/usePaywallTool";
import { PaywallToolWrapper } from "@/app/Components/tools/PaywallToolWrapper";
import { ToolLoadingState } from "@/app/Components/tools/ToolLoadingState";
import { getToolBySlug } from "@/config/tools";
import { useSearchParams } from "next/navigation";
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
    // NEW: Icons for v2.0 features
    AlertTriangle,
    UserCircle,
    GitBranch,
    Clock,
    Gavel,
    Banknote,
    TrendingDown,
    Building,
    Briefcase,
    History,
} from "lucide-react";

// Types matching the API response
interface CompanySearchResult {
    kvkNummer: string;
    naam: string;
    adres: string;
    plaats: string;
    type: string;
    actief: boolean;
    sbiCodes?: string[];
    hoofdactiviteit?: string;
}

// NEW: Director type
interface Director {
    naam: string;
    functie: string;
    functieOmschrijving: string | null;
    startDatum: string | null;
    eindDatum: string | null;
    bevoegdheid: string | null;
    isNatuurlijkPersoon: boolean;
}

// NEW: Company relation type
interface CompanyRelation {
    kvkNummer: string;
    naam: string;
    relatietype: string;
    percentage: number | null;
    viaDirecteur: string | null;
    vertrouwensscore: number;
}

// NEW: Legal status types
interface BankruptcyInfo {
    status: string;
    type: string;
    datum: string;
    curator: string | null;
    rechtbank: string | null;
    publicatieUrl: string | null;
}

interface DissolutionInfo {
    status: string;
    datum: string | null;
    reden: string | null;
}

interface Announcement {
    type: string;
    titel: string;
    datum: string;
    url: string;
    bron: string;
}

// NEW: Financial indicators
interface FinancialIndicators {
    creditScore: number | null;
    paymentBehavior: string | null;
    riskIndicator: string | null;
    companyAge: number | null;
    employeeTrend: string | null;
    sectorRisk: string | null;
}

// NEW: Timeline event
interface TimelineEvent {
    datum: string;
    type: string;
    titel: string;
    beschrijving: string | null;
    bron: string;
    url: string | null;
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
        provincie: string | null;
        volledig: string;
        geoLocatie: { lat: number; lng: number } | null;
    };
    // NEW: Directors
    bestuurders: Director[] | null;
    // NEW: Company relations
    relaties: {
        moedermaatschappij: CompanyRelation | null;
        dochtermaatschappijen: CompanyRelation[];
        verwanteOndernemingen: CompanyRelation[];
        totaalRelaties: number;
    } | null;
    // NEW: Legal status
    juridischeStatus: {
        faillissement: BankruptcyInfo | null;
        surseance: BankruptcyInfo | null;
        ontbinding: DissolutionInfo | null;
        bekendmakingen: Announcement[];
        risicoIndicator: string | null;
    } | null;
    // NEW: Financial indicators
    financieel: FinancialIndicators | null;
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
    // NEW: Timeline
    tijdlijn: TimelineEvent[];
    meta: {
        timestamp: string;
        bronnen: string[];
        verwerkingstijd: number;
        errors: string[];
    };
}

type ApiResponse =
    | { type: "search"; results: CompanySearchResult[]; total: number; meta: any }
    | { type: "profile"; profile: CompanyProfile };

export default function KvkSearchClient() {
    const toolMetadata = getToolBySlug("kvk-search");
    const searchParams = useSearchParams();

    // Search state - expanded for v2.0
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState<"naam" | "kvkNummer" | "postcode" | "sbiCode">("naam");
    const [plaats, setPlaats] = useState("");
    const [postcodeFilter, setPostcodeFilter] = useState("");
    const [sbiCodeFilter, setSbiCodeFilter] = useState("");
    const [inclusiefInactief, setInclusiefInactief] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [stripeProcessed, setStripeProcessed] = useState(false);

    // Results state
    const [searchResults, setSearchResults] = useState<CompanySearchResult[] | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<CompanyProfile | null>(null);
    const [copied, setCopied] = useState(false);

    const { state, execute, showPaymentModal, setShowPaymentModal, handlePaymentSuccess } = usePaywallTool({
        apiEndpoint: "/api/v1/business/kvk-search",
        requiredAmount: toolMetadata?.pricing.price,
    });

    // Handle Stripe redirect with session_id
    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        if (sessionId && !stripeProcessed) {
            setStripeProcessed(true);

            // Get stored query from localStorage
            const storedQuery = localStorage.getItem("kvk_pending_query");
            if (storedQuery) {
                try {
                    const parsed = JSON.parse(storedQuery);
                    localStorage.removeItem("kvk_pending_query");

                    // Update form state
                    setSearchQuery(parsed.query || "");
                    setSearchType(parsed.type || "naam");
                    setPlaats(parsed.plaats || "");
                    setInclusiefInactief(parsed.inclusiefInactief || false);

                    // Execute with Stripe session
                    executeWithStripe(parsed, sessionId);
                } catch (e) {
                    console.error("Failed to parse stored query:", e);
                }
            }

            // Clean up URL
            const url = new URL(window.location.href);
            url.searchParams.delete("session_id");
            window.history.replaceState({}, "", url.toString());
        }
    }, [searchParams, stripeProcessed]);

    // Execute API call with Stripe session ID
    const executeWithStripe = async (input: any, sessionId: string) => {
        const body = {
            ...input,
            stripeSessionId: sessionId,
        };

        try {
            const response = await fetch("/api/v1/business/kvk-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.success) {
                const data = result.data as ApiResponse;
                if (data.type === "search") {
                    setSearchResults(data.results);
                } else if (data.type === "profile") {
                    setSelectedProfile(data.profile);
                }
            }
        } catch (error) {
            console.error("API call failed:", error);
        }
    };

    // Store query before Stripe redirect
    const storeQueryForStripe = (query: any) => {
        localStorage.setItem("kvk_pending_query", JSON.stringify(query));
    };

    // Handle search - v2.0 with new search types
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate based on search type
        if (searchType === "naam" && !searchQuery.trim()) return;
        if (searchType === "kvkNummer" && !searchQuery.trim()) return;
        if (searchType === "postcode" && !postcodeFilter.trim() && !searchQuery.trim()) return;
        if (searchType === "sbiCode" && !sbiCodeFilter.trim() && !searchQuery.trim()) return;

        setSearchResults(null);
        setSelectedProfile(null);

        const queryData = {
            query: searchQuery.trim() || undefined,
            type: searchType,
            plaats: plaats.trim() || undefined,
            postcode: postcodeFilter.trim() || undefined,
            sbiCode: sbiCodeFilter.trim() || undefined,
            inclusiefInactief,
            getFullProfile: false,
        };

        // Store query for Stripe redirect
        storeQueryForStripe(queryData);

        execute(queryData);
    };

    // Handle selecting a company for full profile - v2.0 with new include options
    const handleSelectCompany = async (kvkNummer: string) => {
        setSelectedProfile(null);

        const queryData = {
            query: kvkNummer,
            type: "kvkNummer" as const,
            getFullProfile: true,
            // NEW: Include options for v2.0 data
            include: {
                directors: true,
                relations: true,  // Now enabled - company network
                legalStatus: true,
                financial: true,
            },
            enrichments: {
                website: true,
                socials: true,
                techStack: true,
                news: true,
                reviews: true,
                aiAnalysis: true,
            },
        };

        // Store query for Stripe redirect
        storeQueryForStripe(queryData);

        execute(queryData);
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
                        {/* Search Type Toggle - v2.0 expanded */}
                        <div className="flex flex-wrap gap-2 p-1 bg-zinc-100 rounded-lg w-fit">
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
                            <button
                                type="button"
                                onClick={() => setSearchType("postcode")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    searchType === "postcode"
                                        ? "bg-white text-zinc-900 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-700"
                                }`}
                            >
                                Postcode
                            </button>
                            <button
                                type="button"
                                onClick={() => setSearchType("sbiCode")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    searchType === "sbiCode"
                                        ? "bg-white text-zinc-900 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-700"
                                }`}
                            >
                                SBI Code
                            </button>
                        </div>

                        {/* Main Search Input */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={
                                    searchType === "naam" ? "Zoek op bedrijfsnaam..." :
                                    searchType === "kvkNummer" ? "Voer KVK nummer in (8 cijfers)..." :
                                    searchType === "postcode" ? "Zoek op bedrijfsnaam binnen postcode..." :
                                    "Zoek op bedrijfsnaam binnen sector..."
                                }
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-lg"
                            />
                        </div>

                        {/* Postcode-specific input */}
                        {searchType === "postcode" && (
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-zinc-600 mb-1">
                                    Postcode *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        type="text"
                                        value={postcodeFilter}
                                        onChange={(e) => setPostcodeFilter(e.target.value.toUpperCase())}
                                        placeholder="1234AB"
                                        maxLength={6}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                                    />
                                </div>
                            </div>
                        )}

                        {/* SBI Code-specific input */}
                        {searchType === "sbiCode" && (
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-zinc-600 mb-1">
                                    SBI Code * (CBS branchecode)
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        type="text"
                                        value={sbiCodeFilter}
                                        onChange={(e) => setSbiCodeFilter(e.target.value.replace(/\D/g, ""))}
                                        placeholder="62 (ICT), 47 (Retail), 85 (Onderwijs)..."
                                        maxLength={5}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                                    />
                                </div>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Bijvoorbeeld: 62 = ICT, 47 = Retail, 85 = Onderwijs, 70 = Consultancy
                                </p>
                            </div>
                        )}

                        {/* Additional Filters for name search */}
                        {(searchType === "naam" || searchType === "postcode" || searchType === "sbiCode") && (
                            <div className="flex flex-wrap gap-4">
                                {searchType === "naam" && (
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
                                )}
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

                            {/* NEW v2.0: Legal Status Card */}
                            {selectedProfile.juridischeStatus && (
                                <div className={`rounded-2xl border p-6 ${
                                    selectedProfile.juridischeStatus.faillissement || selectedProfile.juridischeStatus.surseance
                                        ? "bg-red-50 border-red-200"
                                        : selectedProfile.juridischeStatus.risicoIndicator === "hoog" || selectedProfile.juridischeStatus.risicoIndicator === "kritiek"
                                            ? "bg-amber-50 border-amber-200"
                                            : "bg-white border-zinc-200"
                                }`}>
                                    <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4">
                                        <Gavel className={`w-5 h-5 ${
                                            selectedProfile.juridischeStatus.faillissement ? "text-red-500" : "text-zinc-400"
                                        }`} />
                                        Juridische Status
                                        {selectedProfile.juridischeStatus.risicoIndicator && (
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                selectedProfile.juridischeStatus.risicoIndicator === "laag" ? "bg-emerald-100 text-emerald-700" :
                                                selectedProfile.juridischeStatus.risicoIndicator === "gemiddeld" ? "bg-amber-100 text-amber-700" :
                                                selectedProfile.juridischeStatus.risicoIndicator === "hoog" ? "bg-orange-100 text-orange-700" :
                                                "bg-red-100 text-red-700"
                                            }`}>
                                                {selectedProfile.juridischeStatus.risicoIndicator} risico
                                            </span>
                                        )}
                                    </h2>

                                    {/* Bankruptcy Warning */}
                                    {selectedProfile.juridischeStatus.faillissement && (
                                        <div className="flex items-start gap-3 p-4 bg-red-100 rounded-xl mb-4">
                                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                            <div>
                                                <h3 className="font-semibold text-red-800">Faillissement</h3>
                                                <p className="text-sm text-red-700 mt-1">
                                                    Status: {selectedProfile.juridischeStatus.faillissement.status} |
                                                    Datum: {new Date(selectedProfile.juridischeStatus.faillissement.datum).toLocaleDateString("nl-NL")}
                                                </p>
                                                {selectedProfile.juridischeStatus.faillissement.curator && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        Curator: {selectedProfile.juridischeStatus.faillissement.curator}
                                                    </p>
                                                )}
                                                {selectedProfile.juridischeStatus.faillissement.publicatieUrl && (
                                                    <a
                                                        href={selectedProfile.juridischeStatus.faillissement.publicatieUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-red-600 hover:underline mt-2 inline-flex items-center gap-1"
                                                    >
                                                        Bekijk publicatie <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Surseance */}
                                    {selectedProfile.juridischeStatus.surseance && (
                                        <div className="flex items-start gap-3 p-4 bg-amber-100 rounded-xl mb-4">
                                            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                            <div>
                                                <h3 className="font-semibold text-amber-800">Surseance van Betaling</h3>
                                                <p className="text-sm text-amber-700 mt-1">
                                                    Status: {selectedProfile.juridischeStatus.surseance.status} |
                                                    Datum: {new Date(selectedProfile.juridischeStatus.surseance.datum).toLocaleDateString("nl-NL")}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Dissolution */}
                                    {selectedProfile.juridischeStatus.ontbinding && (
                                        <div className="flex items-start gap-3 p-4 bg-zinc-100 rounded-xl mb-4">
                                            <Building2 className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" />
                                            <div>
                                                <h3 className="font-semibold text-zinc-700">Ontbinding</h3>
                                                <p className="text-sm text-zinc-600 mt-1">
                                                    Status: {selectedProfile.juridischeStatus.ontbinding.status}
                                                    {selectedProfile.juridischeStatus.ontbinding.datum && (
                                                        <> | Datum: {new Date(selectedProfile.juridischeStatus.ontbinding.datum).toLocaleDateString("nl-NL")}</>
                                                    )}
                                                </p>
                                                {selectedProfile.juridischeStatus.ontbinding.reden && (
                                                    <p className="text-sm text-zinc-500 mt-1">
                                                        Reden: {selectedProfile.juridischeStatus.ontbinding.reden}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Good standing message */}
                                    {!selectedProfile.juridischeStatus.faillissement &&
                                     !selectedProfile.juridischeStatus.surseance &&
                                     !selectedProfile.juridischeStatus.ontbinding && (
                                        <div className="flex items-center gap-2 text-emerald-700">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Geen faillissement, surseance of ontbinding geregistreerd</span>
                                        </div>
                                    )}

                                    {/* Recent Announcements */}
                                    {selectedProfile.juridischeStatus.bekendmakingen.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-zinc-200">
                                            <h3 className="text-sm font-medium text-zinc-500 mb-3">
                                                Recente Bekendmakingen ({selectedProfile.juridischeStatus.bekendmakingen.length})
                                            </h3>
                                            <div className="space-y-2">
                                                {selectedProfile.juridischeStatus.bekendmakingen.slice(0, 3).map((item, i) => (
                                                    <a
                                                        key={i}
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-start gap-2 p-2 hover:bg-zinc-50 rounded-lg transition-colors group"
                                                    >
                                                        <span className={`px-1.5 py-0.5 text-xs rounded ${
                                                            item.type === "faillissement" || item.type === "ontbinding" ? "bg-red-100 text-red-700" :
                                                            item.type === "fusie" ? "bg-blue-100 text-blue-700" :
                                                            "bg-zinc-100 text-zinc-600"
                                                        }`}>
                                                            {item.type}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-zinc-700 group-hover:text-emerald-600 truncate">{item.titel}</p>
                                                            <p className="text-xs text-zinc-400">{new Date(item.datum).toLocaleDateString("nl-NL")} - {item.bron}</p>
                                                        </div>
                                                        <ExternalLink className="w-3 h-3 text-zinc-300 group-hover:text-emerald-500" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* NEW v2.0: Financial Health Card */}
                            {selectedProfile.financieel && (
                                <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                                    <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4">
                                        <Banknote className="w-5 h-5 text-zinc-400" />
                                        Financiële Indicatoren
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedProfile.financieel.creditScore !== null && (
                                            <div className="p-4 bg-zinc-50 rounded-xl">
                                                <div className="text-2xl font-bold text-zinc-900">{selectedProfile.financieel.creditScore}</div>
                                                <div className="text-sm text-zinc-500">Credit Score</div>
                                            </div>
                                        )}
                                        {selectedProfile.financieel.companyAge !== null && (
                                            <div className="p-4 bg-zinc-50 rounded-xl">
                                                <div className="text-2xl font-bold text-zinc-900">{selectedProfile.financieel.companyAge}</div>
                                                <div className="text-sm text-zinc-500">Jaar oud</div>
                                            </div>
                                        )}
                                        {selectedProfile.financieel.paymentBehavior && (
                                            <div className="p-4 bg-zinc-50 rounded-xl">
                                                <div className={`text-lg font-semibold ${
                                                    selectedProfile.financieel.paymentBehavior === "uitstekend" || selectedProfile.financieel.paymentBehavior === "goed" ? "text-emerald-600" :
                                                    selectedProfile.financieel.paymentBehavior === "gemiddeld" ? "text-amber-600" : "text-red-600"
                                                }`}>
                                                    {selectedProfile.financieel.paymentBehavior}
                                                </div>
                                                <div className="text-sm text-zinc-500">Betaalgedrag</div>
                                            </div>
                                        )}
                                        {selectedProfile.financieel.riskIndicator && (
                                            <div className="p-4 bg-zinc-50 rounded-xl">
                                                <div className={`text-lg font-semibold ${
                                                    selectedProfile.financieel.riskIndicator === "laag" ? "text-emerald-600" :
                                                    selectedProfile.financieel.riskIndicator === "gemiddeld" ? "text-amber-600" : "text-red-600"
                                                }`}>
                                                    {selectedProfile.financieel.riskIndicator}
                                                </div>
                                                <div className="text-sm text-zinc-500">Risico indicator</div>
                                            </div>
                                        )}
                                        {selectedProfile.financieel.employeeTrend && (
                                            <div className="p-4 bg-zinc-50 rounded-xl flex items-center gap-2">
                                                {selectedProfile.financieel.employeeTrend === "groeiend" && <TrendingUp className="w-5 h-5 text-emerald-500" />}
                                                {selectedProfile.financieel.employeeTrend === "krimpend" && <TrendingDown className="w-5 h-5 text-red-500" />}
                                                <div>
                                                    <div className="text-lg font-semibold text-zinc-900 capitalize">{selectedProfile.financieel.employeeTrend}</div>
                                                    <div className="text-sm text-zinc-500">Personeelstrend</div>
                                                </div>
                                            </div>
                                        )}
                                        {selectedProfile.financieel.sectorRisk && (
                                            <div className="p-4 bg-zinc-50 rounded-xl">
                                                <div className={`text-lg font-semibold ${
                                                    selectedProfile.financieel.sectorRisk === "laag" ? "text-emerald-600" :
                                                    selectedProfile.financieel.sectorRisk === "gemiddeld" ? "text-amber-600" : "text-red-600"
                                                }`}>
                                                    {selectedProfile.financieel.sectorRisk}
                                                </div>
                                                <div className="text-sm text-zinc-500">Sector risico</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* NEW v2.0: Directors Section */}
                        {selectedProfile.bestuurders && selectedProfile.bestuurders.length > 0 && (
                            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4">
                                    <UserCircle className="w-5 h-5 text-zinc-400" />
                                    Bestuurders ({selectedProfile.bestuurders.length})
                                </h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {selectedProfile.bestuurders.map((director, i) => (
                                        <div key={i} className="p-4 bg-zinc-50 rounded-xl">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-medium text-zinc-900">{director.naam}</h3>
                                                    <p className="text-sm text-zinc-500 capitalize">{director.functie}</p>
                                                    {director.functieOmschrijving && (
                                                        <p className="text-xs text-zinc-400 mt-1">{director.functieOmschrijving}</p>
                                                    )}
                                                </div>
                                                {director.bevoegdheid && (
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                        director.bevoegdheid === "alleen" ? "bg-emerald-100 text-emerald-700" :
                                                        director.bevoegdheid === "gezamenlijk" ? "bg-blue-100 text-blue-700" :
                                                        "bg-zinc-100 text-zinc-600"
                                                    }`}>
                                                        {director.bevoegdheid}
                                                    </span>
                                                )}
                                            </div>
                                            {director.startDatum && (
                                                <p className="text-xs text-zinc-400 mt-2">
                                                    Sinds {new Date(director.startDatum).toLocaleDateString("nl-NL")}
                                                    {director.eindDatum && ` - ${new Date(director.eindDatum).toLocaleDateString("nl-NL")}`}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* NEW v2.0: Company Relations */}
                        {selectedProfile.relaties && selectedProfile.relaties.totaalRelaties > 0 && (
                            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4">
                                    <GitBranch className="w-5 h-5 text-zinc-400" />
                                    Bedrijfsrelaties ({selectedProfile.relaties.totaalRelaties})
                                </h2>

                                {/* Parent Company */}
                                {selectedProfile.relaties.moedermaatschappij && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-zinc-500 mb-2">Moedermaatschappij</h3>
                                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-3">
                                                <Building className="w-8 h-8 text-blue-500" />
                                                <div>
                                                    <h4 className="font-medium text-zinc-900">{selectedProfile.relaties.moedermaatschappij.naam}</h4>
                                                    <p className="text-sm text-zinc-500">KVK: {selectedProfile.relaties.moedermaatschappij.kvkNummer}</p>
                                                </div>
                                                {selectedProfile.relaties.moedermaatschappij.percentage && (
                                                    <span className="ml-auto text-lg font-semibold text-blue-600">
                                                        {selectedProfile.relaties.moedermaatschappij.percentage}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Subsidiaries */}
                                {selectedProfile.relaties.dochtermaatschappijen.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-zinc-500 mb-2">
                                            Dochtermaatschappijen ({selectedProfile.relaties.dochtermaatschappijen.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedProfile.relaties.dochtermaatschappijen.map((sub, i) => (
                                                <div key={i} className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-zinc-900">{sub.naam}</h4>
                                                        <p className="text-xs text-zinc-500">KVK: {sub.kvkNummer}</p>
                                                    </div>
                                                    {sub.percentage && (
                                                        <span className="text-sm font-semibold text-emerald-600">{sub.percentage}%</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Related Companies */}
                                {selectedProfile.relaties.verwanteOndernemingen.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-500 mb-2">
                                            Verwante Ondernemingen ({selectedProfile.relaties.verwanteOndernemingen.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedProfile.relaties.verwanteOndernemingen.map((rel, i) => (
                                                <div key={i} className="p-3 bg-zinc-50 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-zinc-900">{rel.naam}</h4>
                                                        <p className="text-xs text-zinc-500">
                                                            KVK: {rel.kvkNummer}
                                                            {rel.viaDirecteur && ` • Via: ${rel.viaDirecteur}`}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-zinc-400 capitalize">{rel.relatietype}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* NEW v2.0: Timeline */}
                        {selectedProfile.tijdlijn && selectedProfile.tijdlijn.length > 0 && (
                            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4">
                                    <History className="w-5 h-5 text-zinc-400" />
                                    Bedrijfsgeschiedenis
                                </h2>

                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-200" />

                                    <div className="space-y-4">
                                        {selectedProfile.tijdlijn.slice(0, 10).map((event, i) => (
                                            <div key={i} className="relative pl-10">
                                                {/* Timeline dot */}
                                                <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                                                    event.type === "oprichting" ? "bg-emerald-500 border-emerald-300" :
                                                    event.type === "faillissement" || event.type === "ontbinding" ? "bg-red-500 border-red-300" :
                                                    event.type === "bestuurswisseling" ? "bg-blue-500 border-blue-300" :
                                                    "bg-zinc-400 border-zinc-300"
                                                }`} />

                                                <div className="p-3 bg-zinc-50 rounded-lg">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full mb-1 ${
                                                                event.type === "oprichting" ? "bg-emerald-100 text-emerald-700" :
                                                                event.type === "faillissement" || event.type === "ontbinding" ? "bg-red-100 text-red-700" :
                                                                event.type === "bestuurswisseling" ? "bg-blue-100 text-blue-700" :
                                                                "bg-zinc-100 text-zinc-600"
                                                            }`}>
                                                                {event.type}
                                                            </span>
                                                            <h4 className="font-medium text-zinc-900">{event.titel}</h4>
                                                            {event.beschrijving && (
                                                                <p className="text-sm text-zinc-500 mt-1">{event.beschrijving}</p>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-zinc-400 whitespace-nowrap">
                                                            {new Date(event.datum).toLocaleDateString("nl-NL")}
                                                        </span>
                                                    </div>
                                                    {event.url && (
                                                        <a
                                                            href={event.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-emerald-600 hover:underline mt-1 inline-flex items-center gap-1"
                                                        >
                                                            Meer info <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

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
