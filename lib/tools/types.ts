import { ZodSchema } from "zod";
import { ToolMetadata } from "@/config/tools";

export interface ToolContext {
    payment: {
        success: boolean;
        method: string;
        status?: number;
    };
}

export interface ToolResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    details?: any;
    meta?: {
        timestamp: string;
        [key: string]: any;
    };
}

// Enhanced response with confidence and metadata
export interface EnhancedToolResponse<T = any> extends ToolResponse<T> {
    confidence?: number; // 0-100 AI confidence score
    processingTime?: number; // milliseconds
    aiModel?: string;
    warnings?: string[];
    suggestions?: string[];
}

export interface PaymentProof {
    type: "crypto" | "stripe";
    id: string;
}

export type ToolStatus = "idle" | "loading" | "success" | "error";

export interface ToolState<T> {
    status: ToolStatus;
    data?: T;
    error?: string;
}

// Result history types
export interface HistoryEntry<T = any> {
    totalSlides: ReactNode;
    companyName: ReactNode;
    id: string;
    toolId: string;
    timestamp: number;
    input: Record<string, any>;
    result: T;
    tags?: string[];
    starred?: boolean;
}

// Template types
export interface Template<T = any> {
    id: string;
    name: string;
    description?: string;
    toolId: string;
    data: T;
    isDefault?: boolean;
    createdAt: number;
    updatedAt: number;
}

// Export types
export type ExportFormat = "pdf" | "csv" | "json" | "docx" | "xlsx";

// Bulk operation types
export interface BulkItem<T = any> {
    id: string;
    filename?: string;
    data: T;
    status: "pending" | "processing" | "success" | "error";
    result?: any;
    error?: string;
    progress?: number;
}

export interface BulkOperationState<T = any> {
    items: BulkItem<T>[];
    totalCount: number;
    completedCount: number;
    successCount: number;
    errorCount: number;
    isProcessing: boolean;
}

// Comparison types
export interface ComparisonItem<T = any> {
    id: string;
    label: string;
    data: T;
    score?: number;
}

// CV Screener specific
export interface CVScreenerResult {
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    keySkillsMatch: string[];
    experienceYears?: number;
    confidence?: number;
    skillMatchPercentages?: Record<string, number>;
}

// Interview Questions specific
export interface InterviewQuestion {
    category: string;
    question: string;
    difficulty: "junior" | "medior" | "senior";
    followUpQuestions?: string[];
    rubric?: string;
    estimatedTime?: number;
}

// Social Planner specific
export interface SocialPost {
    platform: string;
    content: string;
    hashtags: string[];
    bestTime: string;
    characterCount?: number;
    maxCharacters?: number;
    imageSuggestion?: string;
    variant?: "A" | "B";
}

// Lead Scorer specific
export interface LeadScore {
    score: number;
    tier: "cold" | "warm" | "hot";
    factors: {
        companyFit: number;
        engagement: number;
        timing: number;
        budget: number;
    };
    recommendations: string[];
    nextAction: string;
    emailTemplate?: string;
    companyName: string;
    analyzedAt: string;
}

// Pitch Deck specific
export interface PitchSlide {
    title: string;
    content: string;
    speakerNotes: string;
    imageSuggestion?: string;
    slideType?: "title" | "content" | "chart" | "team" | "financials" | "closing";
}

// Contract Checker specific
export interface ContractAnalysis {
    summary: string;
    risks: ContractRisk[];
    unclear_clauses: string[];
    suggestions: string[];
    overall_score: number;
    clauses?: ExtractedClause[];
    confidence?: number;
}

export interface ContractRisk {
    severity: "critical" | "high" | "medium" | "low";
    description: string;
    clause?: string;
    recommendation?: string;
}

export interface ExtractedClause {
    id: string;
    title: string;
    content: string;
    category: string;
    riskLevel?: "safe" | "caution" | "risky";
}

// Terms Generator specific
export interface GeneratedTerms {
    sections: TermsSection[];
    version: string;
    generatedAt: string;
    jurisdiction: string;
}

export interface TermsSection {
    id: string;
    title: string;
    content: string;
    isEditable?: boolean;
    isGDPR?: boolean;
}

// SEO Audit specific
export interface SEOAuditResult {
    overallScore: number;
    categories: SEOCategory[];
    recommendations: SEORecommendation[];
    url: string;
    analyzedAt: string;
}

export interface SEOCategory {
    name: string;
    score: number;
    issues: string[];
    passed: string[];
}

export interface SEORecommendation {
    priority: "high" | "medium" | "low";
    category: string;
    issue: string;
    recommendation: string;
    impact: string;
}
