export const projects = [
  {
    slug: "email-reply-ai-agent",
    title: "Email Reply AI Agent",
    image: "/emailagent.png",
    description:
      "Automated email response agent leveraging a vector database of customer interactions to provide context-aware, real-time replies at scale.",
    details: [
      "Integrated with a vector database (e.g., Pinecone or Weaviate) to understand prior conversations.",
      "Automatically drafts accurate and on-brand replies to customer emails.",
      "Continuously learns from past responses and CRM data.",
      "Reduced manual inbox handling time by 80%.",
    ],
  },
  {
    slug: "sales-lead-automation",
    title: "Sales Lead Automation",
    image: "/sales-agent.webp",
    description:
      "n8n workflow that gathers, qualifies, and enriches leads across multiple platforms, automatically updating CRM and notifying sales teams.",
    details: [
      "Connects LinkedIn, website forms, and email campaigns into one unified lead stream.",
      "Uses enrichment APIs (Clearbit / Apollo) for firmographic and intent data.",
      "Scores leads based on relevance and triggers Slack or email alerts.",
      "Fully syncs with HubSpot, Pipedrive, or Notion CRM databases.",
    ],
  },
  {
    slug: "support-ticket-summarizer",
    title: "Support Ticket Summarizer",
    image: "/support-agent.png",
    description:
      "AI-powered summarization workflow that condenses large support threads and provides actionable insights for support agents.",
    details: [
      "Automatically summarizes customer support tickets from Zendesk or Intercom.",
      "Highlights key issues, tone, and sentiment in a structured summary.",
      "Stores summaries in a vector database for long-term retrieval.",
      "Reduced average response time by 35%.",
    ],
  },
  {
    slug: "dynamic-marketing-content-generator",
    title: "Dynamic Marketing Content Generator",
    image: "/marketing-agent.png",
    description:
      "Generates personalized marketing emails and social posts based on customer behavior and segmentation, fully automated through n8n workflows.",
    details: [
      "Pulls user data from CRM, analytics, and campaign tools.",
      "Uses AI prompts to craft custom marketing messages for each segment.",
      "Auto-posts approved content to LinkedIn, email, and Slack.",
      "Increased engagement rates by 42% on average.",
    ],
  },
  {
    slug: "data-pipeline-and-reporting-automation",
    title: "Data Pipeline & Reporting Automation",
    image: "/data-agent.png",
    description:
      "End-to-end automation for collecting, transforming, and visualizing business data, reducing manual reporting time by 70%.",
    details: [
      "Aggregates data from multiple APIs, databases, and spreadsheets.",
      "Cleans and normalizes data automatically using n8n transformations.",
      "Pushes results into dashboards (Google Data Studio, Power BI, or Notion).",
      "Reduced manual report generation from hours to minutes.",
    ],
  },
  {
    slug: "inventory-forecasting-agent",
    title: "Inventory Forecasting Agent",
    image: "/forecasting-agent.png",
    description:
      "Predictive AI agent that integrates sales data and seasonal trends to optimize inventory management automatically.",
    details: [
      "Combines real-time sales data with external market trends.",
      "Uses AI models to predict stock levels and reorder points.",
      "Automatically alerts procurement teams when thresholds are met.",
      "Decreased overstocking by 25% and stockouts by 40%.",
    ],
  },
];
