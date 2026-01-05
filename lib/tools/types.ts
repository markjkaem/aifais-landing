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
