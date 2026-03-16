# Changelog

All notable changes to AI TPRM Machine will be documented in this file.

## [1.0.0] - 2026-03-16

### Added
- Imported existing codebase from OneDrive to GitHub-managed local repository
- Set up make-it framework for structured development
- Created app-context.json with project configuration

### Project Structure (Imported)
- Next.js 14 frontend with Tailwind CSS and Radix UI
- Prisma ORM with SQLite database
- 6 AI Agents: VERA, CARA, DORA, SARA, RITA, MARS
- Core entities: Vendors, Risk Profiles, Risk Assessments, Documents, Risk Findings, Reports, Remediation Actions
- Authentication via NextAuth with role-based access (ADMIN, ANALYST, VIEWER, VENDOR)
- AuditBoard API integration skill

### Security
- Identified Next.js 14.2.0 security vulnerability (needs upgrade)
- 22 npm vulnerabilities detected (to be addressed)

---

## Pre-Import History

The original codebase was developed January - March 2026 in the "AI TPRM MACHINE" OneDrive folder. Key milestones:

- **Jan 5, 2026**: Initial project setup with Next.js
- **Jan 7, 2026**: PowerPoint generation scripts added
- **Feb 12, 2026**: AuditBoard integration skill created
- **Mar 5-6, 2026**: Database schema finalized, document processing scripts added
- **Mar 12, 2026**: Latest updates to components and dependencies
