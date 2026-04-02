# AI TPRM Machine -- Try-It Report
> Tested: 2026-04-02
> Status: All Passing (53 passed, 1 expected 403, 6 N/A)

## Summary

Your app was tested automatically across 4 user roles and 8 pages.

| What Was Tested | Result |
|----------------|--------|
| App starts up | PASS |
| Login works (4 roles) | PASS |
| All pages load | 8 of 8 passing |
| Permissions work correctly | PASS (Vendor role correctly denied reports API) |
| API is responding | PASS |
| Logout works | PASS |

## Login Testing

Each type of user was tested:

| User Type | Login | Dashboard | Pages Tested | Result |
|-----------|-------|-----------|-------------|--------|
| Admin (Alex Admin) | PASS | PASS | 8 of 8 | PASS |
| Analyst (Sam Analyst) | PASS | PASS | 6 of 6 | PASS |
| Viewer (Val Viewer) | PASS | PASS | 6 of 6 | PASS |
| Vendor (Vic Vendor) | PASS | PASS | 6 of 6 | PASS |

## Pages Tested

| Page | Admin | Analyst | Viewer | Vendor | Notes |
|------|-------|---------|--------|--------|-------|
| Dashboard | PASS | PASS | PASS | PASS | 18 vendors, 15 critical/high, 67% compliance |
| Vendors | PASS | PASS | PASS | PASS | 20 vendors with risk tiers and scores |
| Assessments | PASS | PASS | PASS | PASS | 24 assessments, mixed statuses |
| Documents | PASS | PASS | PASS | PASS | 36 docs, "Upload & Onboard" button visible |
| Reports | PASS | PASS | PASS | PASS | AI-generated reports with statuses |
| Settings | PASS | PASS | PASS | PASS | System info and user details |
| Admin: Users | PASS | N/A | N/A | N/A | Admin only |
| Admin: Roles | PASS | N/A | N/A | N/A | Admin only |

## API Testing

| Endpoint | Admin | Analyst | Viewer | Vendor |
|----------|-------|---------|--------|--------|
| /api/vendors | PASS | PASS | PASS | PASS |
| /api/assessments | PASS | PASS | PASS | PASS |
| /api/documents | PASS | PASS | PASS | PASS |
| /api/reports | PASS | PASS | PASS | 403 (expected) |
| /api/dashboard/stats | PASS | PASS | PASS | PASS |

## Seed Data

The database is populated with realistic test data:
- 18+ vendors (Snowflake, Salesforce, CrowdStrike, Workday, Stripe, Acme Logistics, CloudSecure Analytics, and more from onboarding tests)
- 24 risk assessments across multiple statuses
- 36 security documents (SOC 2, pen tests, questionnaires)
- AI-generated risk reports with approval workflows
- 6 managed AI prompts (CARA, DORA, MARS, RITA, SARA, VERA)
- 4 users with 4 roles and 40+ permissions

## Screenshots

Screenshots of each page (per role) are saved in `.try-it/screenshots/`:

- `admin_login.png` - SSO login page
- `admin_dashboard.png` - Risk dashboard with metrics
- `admin_vendors.png` - Vendor list with risk tiers
- `admin_assessments.png` - Assessment tracker
- `admin_documents.png` - Document library with Upload & Onboard
- `admin_reports.png` - AI-generated reports
- `admin_settings.png` - System settings
- `admin_admin-users.png` - User management
- `admin_admin-roles.png` - Role/permission matrix
- `analyst_*.png` - Same pages from Analyst perspective
- `viewer_*.png` - Same pages from Viewer perspective
- `vendor_*.png` - Same pages from Vendor perspective (no admin pages)

## How to Access Your App

- **Open your browser to:** http://localhost:3020
- **To log in as Admin:** Click "Sign in with SSO", pick "Alex Admin" from the login screen
- **To log in as Analyst:** Click "Sign in with SSO", pick "Sam Analyst" from the login screen
- **To log in as Viewer:** Click "Sign in with SSO", pick "Val Viewer" from the login screen
- **To log in as Vendor:** Click "Sign in with SSO", pick "Vic Vendor" from the login screen

## Issues Found

No issues found. The one 403 response (Vendor accessing /api/reports) is correct RBAC behavior -- Vendor users don't have permission to view reports.

## What to Do Next
- Explore your app in the browser (see instructions above)
- If something doesn't look right, tell me and I'll fix it
- When you're happy with how it works, type **/ship-it** to deploy
- To make changes, type **/resume-it**
