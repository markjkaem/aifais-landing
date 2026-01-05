This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Architecture & Tooling

### Tool Refactor 2026
We follow a standardized architecture for adding new AI tools to the platform.

#### 1. Creating a new Tool
Run the scaffolding script to generate the API route, client component, and page:
```bash
npm run tools:create
```

#### 2. Key Components
- **`lib/tools/createToolHandler.ts`**: A factory for API routes that handles input validation (Zod), payment gatekeeping (Solana/Stripe), error handling, and standardized response formatting.
- **`lib/pdf/generator.ts`**: A shared utility for generating professional PDF reports using `pdf-lib`.
- **`hooks/usePaywallTool.ts`**: A React hook for handling paid tool execution flows on the client.
- **`hooks/useAsyncForm.ts`**: A general-purpose hook for handling form submission and loading states.

#### 3. Standardized Types
Shared types are located in `types/common.ts`. Always use `SectorId` and `ToolStatus` from this file for consistency.

## Environment Variables
Ensure the following are set for full tool functionality:
- `ANTHROPIC_API_KEY` / `CLAUDE_API_KEY`
- `NEXT_PUBLIC_SOLANA_WALLET`
- `STRIPE_PRIVATE_KEY`
- `SMTP_USER`, `SMTP_PASS`, `TO_EMAIL` (for internal tools)
