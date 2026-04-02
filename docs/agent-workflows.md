# AI Agent Workflows

## Overview

TPRMAI uses 7 specialized AI agents coordinated by an orchestrator to automate third-party risk management. Each agent has a specific role, AI model tier, and standardized input/output contract.

All agents extend `BaseAgent` (`src/lib/agents/base-agent.ts`) which provides:
- DB-driven prompt management with fallback defaults
- PII masking/unmasking pipeline
- Input sanitization and size validation
- JSON response parsing and validation
- Activity logging to audit trail
- Standardized `AgentResult<T>` response format

```
Pipeline: sanitizeInput → validateSize → maskPII → AI call → unmaskPII → validateOutput → logActivity
```

---

## Agent Summary

| Agent | Full Name | Tier | Temp | Tokens | Purpose |
|-------|-----------|------|------|--------|---------|
| **VERA** | Vendor Evaluation & Risk Assessment | standard | 0.3 | 2000 | Initial vendor risk profiling |
| **CARA** | Critical Assessment & Risk Analyzer | complex | 0.3 | 3000 | Deep multi-dimensional assessment |
| **DORA** | Documentation & Outreach Retrieval | simple | 0.2 | 2000 | Document request management |
| **SARA** | Security Analysis & Risk Articulation | complex | 0.2 | 4000 | Security document analysis |
| **RITA** | Report Intelligence & Threat Assessment | standard | 0.3 | 4000 | Report generation & dashboards |
| **MARS** | Management, Action & Remediation Supervisor | standard | 0.3 | 3000 | Remediation tracking & escalation |
| **AURA** | Automated Upload & Recognition | standard | 0.3 | 4096 | Document extraction & similarity |

---

## VERA — Vendor Evaluation & Risk Assessment

**File:** `src/lib/agents/vera.ts`
**API:** `POST /api/agents/vera`

Collects vendor information and determines initial risk profile. Analyzes data sensitivity, system integration depth, business criticality, regulatory requirements, and financial exposure.

### Risk Tier Definitions
| Tier | Score Range | Assessment Frequency |
|------|------------|---------------------|
| CRITICAL | 80–100 | Quarterly |
| HIGH | 60–79 | Semi-Annual |
| MEDIUM | 40–59 | Annual |
| LOW | 0–39 | Biennial |

### Input
```typescript
{
  vendorId: string
  vendorName: string
  industry?: string
  dataTypesAccessed: string[]
  systemIntegrations: string[]
  hasPiiAccess: boolean
  hasPhiAccess: boolean
  hasPciAccess: boolean
  businessCriticality: 'MISSION_CRITICAL' | 'BUSINESS_CRITICAL' | 'IMPORTANT' | 'STANDARD'
  annualSpend?: number
  additionalContext?: string
}
```

### Output
```typescript
{
  vendorId: string
  riskTier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  overallRiskScore: number           // 0–100
  dataSensitivityLevel: string
  assessmentFrequency: string
  nextAssessmentDate: Date
  riskFactors: string[]
  recommendations: string[]
}
```

### Side Effects
- Creates risk profile in database
- Updates vendor status to ACTIVE

---

## CARA — Critical Assessment & Risk Analyzer

**File:** `src/lib/agents/cara.ts`
**API:** `POST /api/agents/cara`

Performs deep-dive assessments on Critical and High-risk vendors across 6 risk dimensions, each scored 1–5.

### Risk Dimensions
1. **Security** — InfoSec controls, vulnerability management
2. **Operational** — Business continuity, SLA adherence
3. **Compliance** — Regulatory alignment, audit readiness
4. **Financial** — Vendor stability, concentration risk
5. **Reputational** — Brand risk, public incidents
6. **Strategic** — Vendor lock-in, roadmap alignment

### Input
```typescript
{
  vendorId: string
  riskProfileId: string
  assessmentType: 'INITIAL' | 'ANNUAL' | 'TRIGGERED' | 'RENEWAL'
  vendorInfo: { name, industry, country, annualSpend }
  existingFindings?: string[]
}
```

### Output
```typescript
{
  vendorId: string
  securityRiskScore: number           // 1–5
  operationalRiskScore: number
  complianceRiskScore: number
  financialRiskScore: number
  reputationalRiskScore: number
  strategicRiskScore: number
  overallScore: number
  riskRating: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  summary: string
  recommendations: string[]
  requiredDocuments: string[]
}
```

### Side Effects
- Creates risk assessment in database

---

## DORA — Documentation & Outreach Retrieval

**File:** `src/lib/agents/dora.ts`
**No direct API** — called via orchestrator

Generates professional documentation request emails, tracks collection progress, and identifies missing or expiring documents. Prioritizes requests based on vendor risk tier.

### Document Requirements by Risk Tier
| Tier | Min Documents Required |
|------|----------------------|
| CRITICAL | 6 |
| HIGH | 4 |
| MEDIUM | 3 |
| LOW | 2 |

### Input
```typescript
{
  vendorId: string
  vendorEmail: string
  vendorName: string
  requiredDocuments: string[]
  dueDate: Date
}
```

### Output
```typescript
{
  vendorId: string
  requestedDocuments: { type, priority, dueDate, status }[]
  emailSubject: string
  emailBody: string
  followUpSchedule: string[]
}
```

---

## SARA — Security Analysis & Risk Articulation

**File:** `src/lib/agents/sara.ts`
**API:** `POST /api/agents/sara`

Analyzes security documents (SOC2, pen tests, questionnaires) to identify control gaps, exceptions, and findings. Maps everything to Sleep Number's risk framework.

### SNBR Risk Framework Categories
DATA_PROTECTION, ACCESS_CONTROL, NETWORK_SECURITY, INCIDENT_RESPONSE, BUSINESS_CONTINUITY, COMPLIANCE, VENDOR_MANAGEMENT, PHYSICAL_SECURITY

### Severity → Remediation SLA
| Severity | SLA |
|----------|-----|
| CRITICAL | 7 days |
| HIGH | 30 days |
| MEDIUM | 90 days |
| LOW | 180 days |
| INFORMATIONAL | 1 year |

### Input
```typescript
{
  vendorId: string
  documentId: string
  documentType: string
  documentContent: string
  vendorContext: { name, riskTier, dataAccess[] }
}
```

### Output
```typescript
{
  vendorId: string
  documentId: string
  findings: SecurityFinding[]
  overallRiskAssessment: string
  complianceGaps: string[]
  strengthAreas: string[]
}
```

### Side Effects
- Creates risk findings in database
- Updates document status to ANALYZED

---

## RITA — Report Intelligence & Threat Assessment

**File:** `src/lib/agents/rita.ts`
**API:** `POST /api/agents/rita` (generate), `GET /api/agents/rita` (dashboard)

Creates comprehensive risk reports. Supports 5 report types tailored to different audiences.

### Report Types
| Type | Audience |
|------|----------|
| EXECUTIVE_SUMMARY | Leadership / board |
| DETAILED_ASSESSMENT | Risk analysts |
| COMPLIANCE_STATUS | Compliance team |
| TREND_ANALYSIS | Risk management |
| PORTFOLIO_OVERVIEW | TPRM program leads |

### Input
```typescript
{
  vendorId?: string
  assessmentId?: string
  reportType: string          // one of the 5 types
  includeFindings: boolean
  includeTrends: boolean
  dateRange?: { start, end }
}
```

### Output
```typescript
{
  reportName: string
  reportType: string
  content: string             // markdown-formatted
  executiveSummary: string
  keyMetrics: Record<string, number>
  recommendations: string[]
}
```

### Dashboard (GET)
Returns `metrics` (totalVendors, criticalVendors, openFindings, etc.), `alerts`, and `trends`.

---

## MARS — Management, Action & Remediation Supervisor

**File:** `src/lib/agents/mars.ts`
**API:** `POST /api/agents/mars` (create plan), `PUT /api/agents/mars` (risk acceptance), `GET /api/agents/mars` (check overdue)

Manages remediation lifecycle: plans, tracking, escalation, and risk acceptance workflows.

### Action Types
- **REMEDIATE** — Vendor fixes the issue
- **MITIGATE** — Compensating controls applied
- **ACCEPT** — Risk formally accepted with justification
- **TRANSFER** — Risk transferred (e.g., insurance)

### Escalation Path
1. Auto-reminder to vendor
2. Analyst notification
3. Manager notification
4. CISO/leadership escalation

### Input (Create Plan)
```typescript
{
  findingId: string
  vendorId: string
  finding: { title, severity, description }
  vendorContact: { name, email }
}
```

### Output (Remediation Plan)
```typescript
{
  findingId: string
  actions: { title, description, actionType, priority, dueDate, assignedTo, ownerType }[]
  timeline: string
  escalationPath: string[]
}
```

### Risk Acceptance (PUT)
Requires `findingId`, `justification` (min 50 chars), and `approver`. Sets 1-year expiration.

---

## AURA — Automated Upload & Recognition

**File:** `src/lib/agents/aura.ts`
**API:** `POST /api/agents/aura`

Utility agent for the document-driven onboarding workflow. Extracts vendor information from uploaded documents and compares document similarity for deduplication. Unlike orchestrator agents, AURA is called directly by onboarding routes.

**Two managed prompts:** `aura-system` (extraction) and `aura-similarity` (comparison) — both editable via admin prompt management UI.

### Document Extraction (execute)

Handles both text documents (via BaseAgent `invokeWithJSON` pipeline) and images (via multimodal `chat()` with system prompt).

#### Input
```typescript
{
  text: string              // extracted document text
  isImage: boolean
  imageBase64?: string      // base64-encoded image data
  imageMime?: string        // e.g., 'image/png'
  fileName: string
}
```

#### Output
```typescript
{
  vendorInfo: {
    name, legalName, dunsNumber, address, phone,
    primaryContactName, primaryContactEmail, primaryContactPhone,
    industry, website, documentDate, documentType
  }
  confidence: Record<string, number>   // 0.0–1.0 per field
  documentAnalysis: {
    documentType, summary, keyFindings[], riskFactors[],
    strengths[], recommendedRating, controlsCovered[],
    expirationDate, recommendations[]
  }
}
```

### Document Similarity (compareDocuments)

Compares two document excerpts to classify their relationship. Uses simple tier with low temperature for deterministic comparison.

#### Input
```typescript
{
  existingDoc: { name, date, snippet }
  newDoc: { name, date, snippet }
}
```

#### Output
```typescript
{
  similarity: 'identical' | 'updated' | 'different'
  confidence: number
  explanation: string
}
```

### Side Effects
- Logs `DOCUMENT_EXTRACTION` and `DOCUMENT_COMPARISON` activities
- Documents created via onboarding are tagged `retrievedBy: 'AURA'`

---

## Orchestrator Workflows

**File:** `src/lib/agents/orchestrator.ts`
**API:** `POST /api/orchestrator`, `PUT /api/orchestrator`, `PATCH /api/orchestrator`

### Vendor Onboarding (POST)
```
VERA (risk profiling) → CARA (deep assessment, if HIGH/CRITICAL) → DORA (document request) → RITA (initial report)
```

### Document Processing (PUT)
```
SARA (security analysis) → MARS (remediation, for CRITICAL/HIGH findings) → RITA (report update)
```

### Maintenance Cycle (PATCH)
- MARS checks overdue remediation actions
- DORA checks expiring documents
- Calculates upcoming assessment dates
- Returns escalation counts and upcoming items
