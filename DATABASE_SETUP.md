# AI TPRM Machine - Database Setup Instructions

## Overview

The database has been configured to store all findings, vendors, assessments, and reports. The system uses SQLite for local storage with Prisma ORM.

## Setup Steps

### Step 1: Install Dependencies

Open a terminal in the AI TPRM MACHINE directory and run:

```bash
npm install
```

This will install the xlsx package and any other missing dependencies.

### Step 2: Generate Prisma Client and Create Database

Run the following commands:

```bash
npx prisma generate
npx prisma db push
```

This will:
- Generate the Prisma client
- Create the SQLite database file at `prisma/dev.db`
- Apply the schema to create all tables

### Step 3: Seed the Database with Articulate Global Data

Run the seed script:

```bash
node prisma/seed.js
```

This will populate the database with:
- Articulate Global vendor record
- Risk profile
- Risk assessment
- 8 findings from the assessment
- Document records (SOC 2, Pentest, Bridge Letter)
- Report records

### Step 4: Create the Excel Findings Registry

Run the registry creation script:

```bash
node create_findings_registry.js
```

This creates the Excel file at:
`C:\Users\JOBLER\OneDrive - Sleep Number Corporation\AI TPRM docs\TPRM-Findings-Registry.xlsx`

### Step 5: Start the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Accessing the Findings Search

Navigate to http://localhost:3000/findings to access the findings search functionality.

### Search Features:
- **Full-text search**: Search by finding title, description, recommendation, ID, or vendor name
- **Severity filter**: Filter by Critical, High, Medium, Low, or Informational
- **Status filter**: Filter by Open, In Remediation, Pending Verification, Resolved, Accepted, or Closed
- **Category filter**: Filter by finding category (Data Security, Compliance, etc.)
- **Vendor filter**: Filter by vendor name
- **Include closed**: Toggle to show/hide closed findings
- **Click any finding** to see full details in a modal

## Database Management

### View database with Prisma Studio:
```bash
npx prisma studio
```
Opens a web interface at http://localhost:5555 to browse and edit data.

### Reset database:
```bash
npx prisma db push --force-reset
node prisma/seed.js
```

## File Locations

| File | Description |
|------|-------------|
| `prisma/schema.prisma` | Database schema definition |
| `prisma/seed.js` | Database seed script |
| `prisma/dev.db` | SQLite database file |
| `src/app/findings/page.tsx` | Findings search UI |
| `src/app/api/findings/route.ts` | Findings API endpoint |

## Database Tables

| Table | Description |
|-------|-------------|
| vendors | Vendor information |
| risk_profiles | Risk tier and scoring |
| risk_assessments | Assessment records |
| risk_findings | All findings with severity, status, recommendations |
| documents | Uploaded/analyzed documents |
| reports | Generated reports |
| remediation_actions | Actions to address findings |
| audit_trail | Change history |
