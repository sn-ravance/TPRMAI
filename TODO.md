# TODO - AI TPRM Machine

## High Priority

- [ ] **Security: Upgrade Next.js** - Current version 14.2.0 has a security vulnerability. Upgrade to latest patched version.
- [ ] **Security: Fix npm vulnerabilities** - 22 vulnerabilities detected (2 critical, 15 high). Run `npm audit fix` or update specific packages.
- [ ] **Environment: Configure AI credentials** - Update AZURE_OPENAI_API_KEY and related settings in .env for AI features

## Medium Priority

- [ ] **Testing: Add test suite** - No tests currently exist. Add Jest/Vitest for unit tests, Playwright for E2E
- [ ] **Auth: Verify NextAuth setup** - Confirm authentication flow works with current configuration
- [ ] **UI: Review component completeness** - Check if all pages listed in features are implemented
- [ ] **AI Agents: Document agent workflows** - Create documentation for each agent's capabilities and triggers
- [ ] **API: Document endpoints** - Create API documentation for all routes

## Low Priority

- [ ] **Cleanup: Remove unused scripts** - Many standalone .js scripts in root (create_*.js, read_*.js) - evaluate if needed
- [ ] **Cleanup: Remove Windows-specific files** - .bat files, node-v22 references may not be needed on Mac
- [ ] **Docs: Update CLAUDE.MD** - Refresh project documentation to reflect current state
- [ ] **CI/CD: Set up GitHub Actions** - Configure automated testing and deployment pipeline

## Completed

- [x] Import codebase to GitHub-managed local repository
- [x] Initialize git repository
- [x] Install npm dependencies
- [x] Create make-it framework files (app-context.json, CHANGELOG.md, TODO.md)
- [x] Initialize SQLite database (`npx prisma db push`)
- [x] Configure DATABASE_URL for SQLite
- [x] Fix TypeScript errors (JSON string fields, generic types)
- [x] Make LLM initialization lazy (build succeeds without AI credentials)
- [x] Consolidate dual app structure (merged /app and /src/app)
- [x] Verify build passes (`npm run build`)
