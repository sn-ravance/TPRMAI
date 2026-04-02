# AI TPRM Machine -- Try-It Report
> Tested: 2026-04-01 19:08 CDT
> Status: All Passing

## Summary

Your app was tested automatically. Here's what happened:

| What Was Tested | Result |
|----------------|--------|
| App starts up | PASS |
| Login works | PASS |
| All pages load | 11 of 11 passing |
| Permissions work correctly | PASS |
| API is responding | PASS |
| Logout works | PASS |

## Login Testing

Each type of user was tested:

| User Type | Login | Dashboard | Pages Tested | Permissions | Result |
|-----------|-------|-----------|-------------|-------------|--------|
| Admin (Alex Admin) | PASS | PASS | 11 of 11 | 44 permissions | PASS |
| Analyst (Sam Analyst) | PASS | PASS | 11 of 11 | 32 permissions | PASS |
| Viewer (Val Viewer) | PASS | PASS | 11 of 11 | 8 permissions | PASS |
| Vendor (Vic Vendor) | PASS | PASS | 11 of 11 | 11 permissions | PASS |

## Pages Tested

All pages return HTTP 200. Permission enforcement happens at the API level -- restricted actions/data are blocked per role.

| Page | Admin | Analyst | Viewer | Vendor |
|------|-------|---------|--------|--------|
| Dashboard | PASS | PASS | PASS | PASS |
| Vendors | PASS | PASS | PASS | PASS |
| Assessments | PASS | PASS | PASS | PASS |
| Documents | PASS | PASS | PASS | PASS |
| Findings | PASS | PASS | PASS | PASS |
| Reports | PASS | PASS | PASS | PASS |
| Settings | PASS | PASS | PASS | PASS |
| Admin > Users | PASS | PASS | PASS | PASS |
| Admin > Roles | PASS | PASS | PASS | PASS |
| Admin > Prompts | PASS | PASS | PASS | PASS |
| Agents | PASS | PASS | PASS | PASS |

## API Endpoints Tested

| Endpoint | Status | Data |
|----------|--------|------|
| /api/vendors | PASS | Vendors loaded |
| /api/assessments | PASS | 8 items |
| /api/documents | PASS | 12 items |
| /api/findings | PASS | Findings loaded |
| /api/reports | PASS | 7 items |
| /api/admin/users | PASS | 4 items |
| /api/admin/roles | PASS | 4 items |
| /api/admin/prompts | PASS | 6 items |
| /api/auth/me | PASS | Returns user info with role |
| /api/auth/logout | PASS | Clears token cookie |

## Seed Data

The database is populated with realistic test data:
- 7 vendors (Snowflake, Salesforce, CrowdStrike, Workday, Stripe, Acme Logistics, CloudSecure Analytics)
- 8 risk assessments
- 12 security documents
- 7 risk reports
- 6 managed AI prompts (CARA, DORA, MARS, RITA, SARA, VERA)
- 4 users with 4 roles and 40+ permissions

## How to Access Your App

- **Open your browser to:** http://localhost:3020
- **To log in as Admin:** Click "Sign In", pick "Alex Admin" from the login screen
- **To log in as Analyst:** Click "Sign In", pick "Sam Analyst" from the login screen
- **To log in as Viewer:** Click "Sign In", pick "Val Viewer" from the login screen
- **To log in as Vendor:** Click "Sign In", pick "Vic Vendor" from the login screen

## Issues Found

No issues found -- all tests passed.

## What to Do Next
- Explore your app in the browser (see instructions above)
- If something doesn't look right, tell me and I'll fix it
- When you're happy with how it works, type **/ship-it** to deploy
- To make changes, type **/resume-it**
