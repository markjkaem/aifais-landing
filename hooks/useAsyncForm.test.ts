import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAsyncForm } from "./useAsyncForm";

describe("useAsyncForm", () => {
    it("should initialize status as idle", () => {
        const { result } = renderHook(() =>
            useAsyncForm({
                onSubmit: async () => ({})
            })
        );
        expect(result.current.status).toBe("idle");
    });

    it("should update form fields", async () => {
        const { result } = renderHook(() =>
            useAsyncForm({
                onSubmit: async () => ({}),
                initialData: { name: "" }
            })
        );

        await act(async () => {
            result.current.setFieldValue("name", "New Name");
        });

        expect(result.current.data.name).toBe("New Name");
    });
});
