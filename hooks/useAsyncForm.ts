"use client";

import { useState } from "react";
import { ExecutionStatus } from "@/types/common";

interface UseAsyncFormOptions<T, R> {
    onSubmit: (data: T) => Promise<R>;
    onSuccess?: (result: R) => void;
    onError?: (error: string) => void;
    initialData?: Partial<T>;
}

export function useAsyncForm<T, R>(options: UseAsyncFormOptions<T, R>) {
    const [data, setData] = useState<T>((options.initialData || {}) as T);
    const [status, setStatus] = useState<ExecutionStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<R | null>(null);

    const setFieldValue = (field: keyof T, value: any) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setStatus("loading");
        setError(null);

        try {
            const response = await options.onSubmit(data);
            setResult(response);
            setStatus("success");
            if (options.onSuccess) options.onSuccess(response);
        } catch (err: any) {
            const errorMessage = err.message || "Er is een onbekende fout opgetreden.";
            setError(errorMessage);
            setStatus("error");
            if (options.onError) options.onError(errorMessage);
        }
    };

    const reset = () => {
        setData((options.initialData || {}) as T);
        setStatus("idle");
        setError(null);
        setResult(null);
    };

    return {
        data,
        setData,
        setFieldValue,
        status,
        error,
        result,
        handleSubmit,
        reset,
        isLoading: status === "loading",
        isSuccess: status === "success",
        isError: status === "error",
    };
}
