export type ToolStatus = "live" | "beta" | "soon";

export type ExecutionStatus = "idle" | "loading" | "success" | "error";

export interface PaymentProof {
    type: "crypto" | "stripe";
    id: string;
}

export interface ToolMetadata {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    icon: any;
    status: ToolStatus;
    category: SectorId;
    featured?: boolean;
    new?: boolean;
    pricing: {
        type: "free" | "paid" | "freemium";
        price?: number;
        currency?: string;
    };
    componentPath: string;
    keywords?: string[];
    features?: string[];
    useCases?: string[];
    createdAt?: number;
    usageCount?: number;
}

export type SectorId = "finance" | "legal" | "hr" | "marketing" | "sales" | "ecommerce" | "technology" | "support" | "creative" | "consulting";

export interface Sector {
    id: SectorId;
    name: string;
    icon: any;
    color: string;
    gradient: string;
    accentColor: string;
}

export interface ToolUI extends ToolMetadata {
    href: string;
    description: string;
    tags: string[];
}
