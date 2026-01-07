/**
 * Template Management System
 * Save, load, and manage templates for tools
 */

import { Template } from "@/lib/tools/types";

const STORAGE_PREFIX = "aifais_templates_";

// ==================== Core Functions ====================

export function getTemplates<T>(toolId: string): Template<T>[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(`${STORAGE_PREFIX}${toolId}`);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load templates:", e);
    }
    return [];
}

export function saveTemplate<T>(
    toolId: string,
    name: string,
    data: T,
    description?: string,
    isDefault?: boolean
): Template<T> {
    const templates = getTemplates<T>(toolId);

    const template: Template<T> = {
        id: generateId(),
        name,
        description,
        toolId,
        data,
        isDefault: isDefault || false,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    // If setting as default, unset other defaults
    if (isDefault) {
        templates.forEach(t => t.isDefault = false);
    }

    templates.push(template);
    persistTemplates(toolId, templates);

    return template;
}

export function updateTemplate<T>(
    toolId: string,
    templateId: string,
    updates: Partial<Omit<Template<T>, "id" | "toolId" | "createdAt">>
): Template<T> | null {
    const templates = getTemplates<T>(toolId);
    const index = templates.findIndex(t => t.id === templateId);

    if (index === -1) return null;

    // If setting as default, unset other defaults
    if (updates.isDefault) {
        templates.forEach(t => t.isDefault = false);
    }

    templates[index] = {
        ...templates[index],
        ...updates,
        updatedAt: Date.now()
    };

    persistTemplates(toolId, templates);
    return templates[index];
}

export function deleteTemplate(toolId: string, templateId: string): boolean {
    const templates = getTemplates(toolId);
    const index = templates.findIndex(t => t.id === templateId);

    if (index === -1) return false;

    templates.splice(index, 1);
    persistTemplates(toolId, templates);
    return true;
}

export function getTemplate<T>(toolId: string, templateId: string): Template<T> | null {
    const templates = getTemplates<T>(toolId);
    return templates.find(t => t.id === templateId) || null;
}

export function getDefaultTemplate<T>(toolId: string): Template<T> | null {
    const templates = getTemplates<T>(toolId);
    return templates.find(t => t.isDefault) || null;
}

export function setDefaultTemplate(toolId: string, templateId: string): boolean {
    const templates = getTemplates(toolId);
    const template = templates.find(t => t.id === templateId);

    if (!template) return false;

    templates.forEach(t => t.isDefault = (t.id === templateId));
    persistTemplates(toolId, templates);
    return true;
}

export function duplicateTemplate<T>(toolId: string, templateId: string): Template<T> | null {
    const template = getTemplate<T>(toolId, templateId);
    if (!template) return null;

    return saveTemplate(
        toolId,
        `${template.name} (kopie)`,
        template.data,
        template.description,
        false
    );
}

// ==================== Import/Export ====================

export function exportTemplates(toolId: string): string {
    const templates = getTemplates(toolId);
    return JSON.stringify({
        toolId,
        exportedAt: new Date().toISOString(),
        templates
    }, null, 2);
}

export function importTemplates<T>(toolId: string, json: string): number {
    try {
        const imported = JSON.parse(json);
        if (!imported.templates || !Array.isArray(imported.templates)) {
            throw new Error("Invalid template format");
        }

        const existingTemplates = getTemplates<T>(toolId);
        const existingNames = new Set(existingTemplates.map(t => t.name));

        let importedCount = 0;
        imported.templates.forEach((template: Template<T>) => {
            // Skip if name already exists, or add with modified name
            let name = template.name;
            if (existingNames.has(name)) {
                name = `${name} (imported)`;
            }

            saveTemplate(
                toolId,
                name,
                template.data,
                template.description,
                false // Never import as default
            );
            importedCount++;
        });

        return importedCount;
    } catch (e) {
        console.error("Failed to import templates:", e);
        return 0;
    }
}

// ==================== Built-in Templates ====================

export interface BuiltInTemplate<T> {
    id: string;
    name: string;
    description: string;
    data: T;
    category?: string;
}

// Invoice templates
export const INVOICE_TEMPLATES: BuiltInTemplate<any>[] = [
    {
        id: "standard",
        name: "Standaard Factuur",
        description: "Basistemplate voor facturen",
        data: {
            discountPercentage: 0,
            notes: "Betaling binnen 30 dagen na factuurdatum."
        }
    },
    {
        id: "service",
        name: "Dienstverlening",
        description: "Voor consultancy en diensten",
        data: {
            discountPercentage: 0,
            notes: "Betaling binnen 14 dagen na factuurdatum. Bij vragen: info@uwbedrijf.nl"
        }
    },
    {
        id: "product",
        name: "Productverkoop",
        description: "Voor fysieke producten",
        data: {
            discountPercentage: 0,
            notes: "Retourneren binnen 14 dagen mogelijk. Betaling binnen 30 dagen."
        }
    }
];

// Quote templates
export const QUOTE_TEMPLATES: BuiltInTemplate<any>[] = [
    {
        id: "standard",
        name: "Standaard Offerte",
        description: "Basistemplate voor offertes",
        data: {
            validUntil: 30
        }
    },
    {
        id: "project",
        name: "Projectofferte",
        description: "Voor grotere projecten",
        data: {
            validUntil: 14
        }
    },
    {
        id: "quick",
        name: "Snelle Offerte",
        description: "Korte geldigheid, snel beslissen",
        data: {
            validUntil: 7
        }
    }
];

// Terms generator templates
export const TERMS_TEMPLATES: BuiltInTemplate<any>[] = [
    {
        id: "webshop",
        name: "Webshop",
        description: "Voor online winkels met fysieke producten",
        category: "E-commerce",
        data: {
            companyType: "webshop",
            hasPhysicalProducts: true,
            hasDigitalProducts: false,
            hasServices: false,
            acceptsReturns: true,
            returnDays: 14,
            paymentTerms: 0,
            jurisdiction: "Nederland"
        }
    },
    {
        id: "saas",
        name: "SaaS / Software",
        description: "Voor software en digitale diensten",
        category: "Technology",
        data: {
            companyType: "saas",
            hasPhysicalProducts: false,
            hasDigitalProducts: true,
            hasServices: true,
            acceptsReturns: false,
            paymentTerms: 14,
            jurisdiction: "Nederland"
        }
    },
    {
        id: "consultancy",
        name: "Consultancy",
        description: "Voor adviesbureaus en ZZP'ers",
        category: "Consulting",
        data: {
            companyType: "consultancy",
            hasPhysicalProducts: false,
            hasDigitalProducts: false,
            hasServices: true,
            acceptsReturns: false,
            paymentTerms: 30,
            jurisdiction: "Nederland"
        }
    },
    {
        id: "agency",
        name: "Creative Agency",
        description: "Voor marketing en design bureaus",
        category: "Creative",
        data: {
            companyType: "agency",
            hasPhysicalProducts: false,
            hasDigitalProducts: true,
            hasServices: true,
            acceptsReturns: false,
            paymentTerms: 14,
            jurisdiction: "Nederland"
        }
    }
];

// Interview question templates
export const INTERVIEW_TEMPLATES: BuiltInTemplate<any>[] = [
    {
        id: "technical",
        name: "Technische Rol",
        description: "Focus op technische vaardigheden",
        data: {
            includeCategories: ["Technisch", "Situatie"],
            questionCount: 10
        }
    },
    {
        id: "management",
        name: "Management Rol",
        description: "Focus op leiderschap en management",
        data: {
            includeCategories: ["Gedrag", "Situatie", "Motivatie"],
            questionCount: 12
        }
    },
    {
        id: "starter",
        name: "Junior / Starter",
        description: "Geschikt voor entry-level kandidaten",
        data: {
            experienceLevel: "junior",
            includeCategories: ["Motivatie", "Gedrag"],
            questionCount: 8
        }
    }
];

// Social planner templates
export const SOCIAL_TEMPLATES: BuiltInTemplate<any>[] = [
    {
        id: "b2b",
        name: "B2B Marketing",
        description: "Professionele content voor zakelijke doelgroep",
        data: {
            platforms: ["linkedin"],
            tone: "professional",
            postCount: 5,
            includeHashtags: true
        }
    },
    {
        id: "b2c",
        name: "B2C Marketing",
        description: "Consumentgerichte content",
        data: {
            platforms: ["instagram", "facebook"],
            tone: "casual",
            postCount: 7,
            includeHashtags: true
        }
    },
    {
        id: "multichannel",
        name: "Multi-channel Campagne",
        description: "Content voor alle platforms",
        data: {
            platforms: ["linkedin", "instagram", "facebook", "twitter"],
            tone: "professional",
            postCount: 10,
            includeHashtags: true
        }
    }
];

// Pitch deck templates
export const PITCH_TEMPLATES: BuiltInTemplate<any>[] = [
    {
        id: "startup",
        name: "Startup Pitch",
        description: "Voor seed/pre-seed funding",
        data: {
            slideCount: 10,
            includeFinancials: true
        }
    },
    {
        id: "sales",
        name: "Sales Pitch",
        description: "Voor enterprise klanten",
        data: {
            slideCount: 8,
            includeFinancials: false
        }
    },
    {
        id: "brief",
        name: "Elevator Pitch",
        description: "Korte pitch voor snelle presentaties",
        data: {
            slideCount: 5,
            includeFinancials: false
        }
    }
];

// ==================== Helper Functions ====================

function generateId(): string {
    return `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function persistTemplates<T>(toolId: string, templates: Template<T>[]): void {
    try {
        localStorage.setItem(`${STORAGE_PREFIX}${toolId}`, JSON.stringify(templates));
    } catch (e) {
        console.error("Failed to persist templates:", e);
    }
}

// ==================== Get Built-in Templates by Tool ====================

export function getBuiltInTemplates(toolId: string): BuiltInTemplate<any>[] {
    switch (toolId) {
        case "invoice-creation":
            return INVOICE_TEMPLATES;
        case "quote-generator":
            return QUOTE_TEMPLATES;
        case "terms-generator":
            return TERMS_TEMPLATES;
        case "interview-questions":
            return INTERVIEW_TEMPLATES;
        case "social-planner":
            return SOCIAL_TEMPLATES;
        case "pitch-deck":
            return PITCH_TEMPLATES;
        default:
            return [];
    }
}
