export type LeadSource =
    | "Contact Form"
    | "Newsletter"
    | "Lead Magnet"
    | "ROI Calculator"
    | "Article CTA"
    | "Developer CTA"
    | "Tool Landing Page"
    | "Demo Request";

export type LeadPriority = "Hoog" | "Normaal" | "Laag";
export type LeadStatus = "Nieuw" | "In behandeling" | "Beantwoord" | "Geconverteerd";

export type LeadTag =
    | "AI Checklist"
    | "ROI Template"
    | "Newsletter"
    | "QuickScan"
    | "Contact"
    | "High Intent"
    | "MKB"
    | "Enterprise";

export interface NotionLeadData {
    name?: string;
    email: string;
    phone?: string;
    company?: string;
    message?: string;
    source: LeadSource;
    priority?: LeadPriority;
    tags?: LeadTag[];
    metadata?: Record<string, any>;
}

export async function addLeadToNotion(data: NotionLeadData): Promise<boolean> {
    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
        console.warn("⚠️ Notion API key or Database ID not found in environment variables");
        return false;
    }

    try {
        const properties: any = {
            "Naam": {
                title: [
                    {
                        text: {
                            content: data.name || "Geen naam",
                        },
                    },
                ],
            },
            "Email": {
                email: data.email,
            },
            "Status": {
                select: {
                    name: "Nieuw",
                },
            },
            "Bron": {
                select: {
                    name: data.source,
                },
            },
            "Prioriteit": {
                select: {
                    name: data.priority || "Normaal",
                },
            },
        };

        if (data.phone) {
            properties["Telefoon"] = {
                phone_number: data.phone,
            };
        }

        if (data.company) {
            properties["Bedrijf"] = {
                rich_text: [
                    {
                        text: {
                            content: data.company.slice(0, 200),
                        },
                    },
                ],
            };
        }

        if (data.tags && data.tags.length > 0) {
            properties["Tags"] = {
                multi_select: data.tags.map(tag => ({ name: tag })),
            };
        }

        if (data.message || data.metadata) {
            let content = data.message || "";
            if (data.metadata) {
                content += (content ? "\n\n" : "") + "Metadata:\n" + JSON.stringify(data.metadata, null, 2);
            }

            properties["Bericht"] = {
                rich_text: [
                    {
                        text: {
                            content: content.slice(0, 2000), // Notion limit
                        },
                    },
                ],
            };
        }

        const response = await fetch("https://api.notion.com/v1/pages", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${NOTION_API_KEY}`,
                "Content-Type": "application/json",
                "Notion-Version": "2022-06-28",
            },
            body: JSON.stringify({
                parent: {
                    type: "database_id",
                    database_id: NOTION_DATABASE_ID,
                },
                properties: properties,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Notion API Error:", errorData);
            return false;
        }

        console.log(`✅ Lead from "${data.source}" successfully added to Notion`);
        return true;
    } catch (error) {
        console.error("❌ Failed to add lead to Notion:", error);
        return false;
    }
}
