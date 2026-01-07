"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle, Clock, Sparkles } from "lucide-react";

interface ToolLoadingStateProps {
    message?: string;
    subMessage?: string;
    steps?: LoadingStep[];
    currentStep?: number;
    showProgress?: boolean;
    progress?: number; // 0-100
    estimatedTime?: number; // seconds
    onCancel?: () => void;
    className?: string;
}

interface LoadingStep {
    label: string;
    status: "pending" | "active" | "complete";
}

export default function ToolLoadingState({
    message = "Bezig met verwerken...",
    subMessage,
    steps,
    currentStep,
    showProgress,
    progress,
    estimatedTime,
    onCancel,
    className = ""
}: ToolLoadingStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
            {/* Spinner with animation */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="relative"
            >
                <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-blue-500" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-400" />
            </motion.div>

            {/* Message */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-lg font-medium text-white"
            >
                {message}
            </motion.p>

            {subMessage && (
                <p className="mt-2 text-sm text-zinc-400">{subMessage}</p>
            )}

            {/* Estimated time */}
            {typeof estimatedTime === "number" && (
                <div className="flex items-center gap-2 mt-3 text-xs text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Geschatte tijd: ~{estimatedTime}s</span>
                </div>
            )}

            {/* Progress bar */}
            {showProgress && typeof progress === "number" && (
                <div className="w-full max-w-xs mt-6">
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-xs text-zinc-500 text-center mt-2">{Math.round(progress)}%</p>
                </div>
            )}

            {/* Steps indicator */}
            {steps && steps.length > 0 && (
                <div className="mt-6 space-y-2">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3"
                        >
                            {step.status === "complete" ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : step.status === "active" ? (
                                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-zinc-600" />
                            )}
                            <span
                                className={`text-sm ${
                                    step.status === "complete"
                                        ? "text-emerald-400"
                                        : step.status === "active"
                                        ? "text-white"
                                        : "text-zinc-500"
                                }`}
                            >
                                {step.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Cancel button */}
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="mt-6 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                    Annuleren
                </button>
            )}
        </div>
    );
}

// Simple inline loading spinner
interface InlineLoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function InlineLoader({ size = "md", className = "" }: InlineLoaderProps) {
    const sizeClasses = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5"
    };

    return (
        <Loader2 className={`animate-spin text-blue-400 ${sizeClasses[size]} ${className}`} />
    );
}

// Processing indicator for batch operations
interface BatchProgressProps {
    total: number;
    completed: number;
    success: number;
    errors: number;
    currentItem?: string;
    className?: string;
}

export function BatchProgress({
    total,
    completed,
    success,
    errors,
    currentItem,
    className = ""
}: BatchProgressProps) {
    const progress = total > 0 ? (completed / total) * 100 : 0;

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Progress bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full flex">
                    <motion.div
                        className="bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(success / total) * 100}%` }}
                    />
                    <motion.div
                        className="bg-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(errors / total) * 100}%` }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                    <span className="text-zinc-400">
                        {completed} / {total}
                    </span>
                    {success > 0 && (
                        <span className="text-emerald-400">{success} geslaagd</span>
                    )}
                    {errors > 0 && (
                        <span className="text-red-400">{errors} mislukt</span>
                    )}
                </div>
                <span className="text-zinc-500">{Math.round(progress)}%</span>
            </div>

            {/* Current item */}
            {currentItem && (
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <InlineLoader size="sm" />
                    <span className="truncate">{currentItem}</span>
                </div>
            )}
        </div>
    );
}

// Skeleton loader for content
interface SkeletonProps {
    lines?: number;
    className?: string;
}

export function Skeleton({ lines = 3, className = "" }: SkeletonProps) {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-zinc-800 rounded animate-pulse"
                    style={{ width: `${100 - Math.random() * 30}%` }}
                />
            ))}
        </div>
    );
}

// Card skeleton
export function CardSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-zinc-900 rounded-xl border border-zinc-800 p-4 animate-pulse ${className}`}>
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-1/3" />
                    <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-full" />
                <div className="h-3 bg-zinc-800 rounded w-4/5" />
            </div>
        </div>
    );
}
