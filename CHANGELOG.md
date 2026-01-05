# Changelog

All notable changes to AIFAIS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- CV Screener tool (HR)
- Sollicitatievragen Generator (HR)
- Social Media Planner (Marketing)
- SEO Audit Tool (Marketing)
- Pitch Deck Generator (Sales)
- Lead Scorer (Sales)
- OpenAPI/Swagger documentation
- Sentry error tracking

## [1.0.0] - 2026-01-05

### Added
- Initial release with standardized tool architecture
- Invoice Scanner with bulk mode and CSV export
- Contract Checker with PDF report generation
- Quote Generator
- Terms & Conditions Generator
- Invoice Creator
- Solana X-402 payment integration
- Stripe payment integration
- Notion CRM integration
- Internationalization (Dutch, English)
- Rate limiting and security middleware
- Automated test suite with 9 API tests
- Tool scaffolding CLI (`npm run tools:create`)
- PDF generation utility (`lib/pdf/generator.ts`)
- GitHub Actions CI/CD pipeline

### Security
- Origin validation for CSRF protection
- Zod schema validation on all endpoints
- DEV_BYPASS for safe testing without costs
