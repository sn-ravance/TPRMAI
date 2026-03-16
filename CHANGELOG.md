# Changelog

All notable changes to AI TPRM Machine will be documented in this file.

## [1.1.0] - 2026-03-16

### Changed
- Clarified Claude via Azure AI Foundry as PRIMARY AI provider (OpenAI is optional alternative only)
- Updated document analysis route to use Azure AI Foundry instead of direct Anthropic SDK
- Replaced vulnerable `xlsx` package with `exceljs` for Excel file processing
- Updated route handlers for Next.js 16 async params compatibility
- Added Turbopack configuration for Next.js 16

### Fixed
- All npm security vulnerabilities resolved (0 remaining)
- Next.js upgraded from 14.2.0 to 16.1.6

### Documentation
- Updated .env.example to clarify AI provider hierarchy
- Updated CLAUDE.MD with current tech stack

## [1.0.0] - 2026-03-16

### Added
- Imported existing codebase from OneDrive to GitHub-managed local repository
- Set up make-it framework for structured development
- Created app-context.json with project configuration

### Project Structure (Imported)
- Next.js 16 frontend with Tailwind CSS and Radix UI
- Prisma ORM with SQLite database
- 6 AI Agents: VERA, CARA, DORA, SARA, RITA, MARS
- Core entities: Vendors, Risk Profiles, Risk Assessments, Documents, Risk Findings, Reports, Remediation Actions
- Authentication via NextAuth with role-based access (ADMIN, ANALYST, VIEWER, VENDOR)
- AuditBoard API integration skill

### Security
- ~~Identified Next.js 14.2.0 security vulnerability~~ (fixed in 1.1.0)
- ~~22 npm vulnerabilities detected~~ (fixed in 1.1.0)

---

## Pre-Import History

The original codebase was developed January - March 2026 in the "AI TPRM MACHINE" OneDrive folder. Key milestones:

- **Jan 5, 2026**: Initial project setup with Next.js
- **Jan 7, 2026**: PowerPoint generation scripts added
- **Feb 12, 2026**: AuditBoard integration skill created
- **Mar 5-6, 2026**: Database schema finalized, document processing scripts added
- **Mar 12, 2026**: Latest updates to components and dependencies
