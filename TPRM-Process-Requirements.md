# Third Party Risk Management (TPRM) Process Requirements

**Version:** 1.0
**Effective Date:** March 2026
**Owner:** Information Security / GRC
**Review Frequency:** Annual

---

## Table of Contents

1. [Program Overview](#1-program-overview)
2. [Vendor Risk Tiering](#2-vendor-risk-tiering)
3. [Assessment Lifecycle](#3-assessment-lifecycle)
4. [Documentation Requirements](#4-documentation-requirements)
5. [Assessment Components](#5-assessment-components)
6. [Review & Approval Workflow](#6-review--approval-workflow)
7. [Ongoing Monitoring](#7-ongoing-monitoring)
8. [Escalation Procedures](#8-escalation-procedures)
9. [Metrics & Reporting](#9-metrics--reporting)
10. [Roles & Responsibilities](#10-roles--responsibilities)

---

## 1. Program Overview

### 1.1 Purpose

The Third Party Risk Management (TPRM) program establishes a structured approach to identifying, assessing, and managing risks associated with third-party vendors, suppliers, and service providers.

### 1.2 Scope

This program applies to all third parties that:
- Access, process, store, or transmit company data
- Provide critical business services
- Have network connectivity to company systems
- Process payments or financial transactions on behalf of the company
- Have access to facilities or physical assets

### 1.3 Objectives

| Objective | Description |
|-----------|-------------|
| Risk Identification | Identify and categorize risks associated with third-party relationships |
| Risk Assessment | Evaluate vendor security posture and operational capabilities |
| Risk Mitigation | Implement controls to reduce third-party risk to acceptable levels |
| Compliance | Ensure vendors meet regulatory and contractual requirements |
| Continuous Monitoring | Maintain ongoing visibility into vendor risk posture |

---

## 2. Vendor Risk Tiering

### 2.1 Risk Tier Definitions

| Tier | Risk Level | Description | Examples |
|------|------------|-------------|----------|
| **Tier 1** | Critical | Vendors with access to sensitive data, critical systems, or whose failure would severely impact operations | Cloud infrastructure (AWS, Azure), Core SaaS platforms, Payment processors |
| **Tier 2** | High | Vendors with access to confidential data or important business functions | HR systems, CRM platforms, Security tools, Communication platforms |
| **Tier 3** | Medium | Vendors with limited data access or moderate business impact | Marketing tools, Analytics platforms, Collaboration tools |
| **Tier 4** | Low | Vendors with no data access and minimal business impact | Office supplies, Facilities services, Non-critical SaaS |

### 2.2 Risk Tiering Criteria

| Factor | Weight | Considerations |
|--------|--------|----------------|
| **Data Sensitivity** | 30% | PII, PHI, PCI, credentials, intellectual property |
| **System Access** | 25% | Network access, API integrations, admin privileges |
| **Business Criticality** | 20% | Impact if vendor is unavailable, single point of failure |
| **Regulatory Impact** | 15% | Compliance requirements (HIPAA, PCI, SOX, GDPR) |
| **Financial Exposure** | 10% | Contract value, liability exposure |

### 2.3 Data Classification Impact

| Data Type | Minimum Tier |
|-----------|--------------|
| PHI (Protected Health Information) | Tier 1 |
| PCI (Payment Card Data) | Tier 1 |
| PII (Personally Identifiable Information) | Tier 2 |
| Credentials / Authentication Data | Tier 1 |
| Confidential Business Data | Tier 2 |
| Internal Data | Tier 3 |
| Public Data | Tier 4 |

---

## 3. Assessment Lifecycle

### 3.1 Lifecycle Phases

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  1. Intake  │───▶│  2. Tier &  │───▶│ 3. Document │───▶│ 4. Assess & │───▶│ 5. Decision │
│  & Scoping  │    │   Classify  │    │  Collection │    │   Analyze   │    │  & Approval │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                                    │
       ┌────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 6. Contract │───▶│ 7. Ongoing  │───▶│ 8. Offboard │
│  & Onboard  │    │  Monitoring │    │  & Terminate│
└─────────────┘    └─────────────┘    └─────────────┘
```

### 3.2 Phase Descriptions

| Phase | Activities | Owner | Timeline |
|-------|------------|-------|----------|
| **1. Intake & Scoping** | New vendor request, business justification, initial screening | Business Owner | 1-2 days |
| **2. Tier & Classify** | Risk tier assignment, data classification, regulatory mapping | TPRM Team | 1-2 days |
| **3. Document Collection** | Request and gather required documentation from vendor | TPRM Team | 5-15 days |
| **4. Assess & Analyze** | Review documentation, conduct analysis, identify findings | TPRM Analyst | 3-10 days |
| **5. Decision & Approval** | Risk acceptance, conditional approval, or rejection | Risk Committee | 1-5 days |
| **6. Contract & Onboard** | Security requirements in contract, vendor onboarding | Legal / IT | Varies |
| **7. Ongoing Monitoring** | Continuous monitoring, periodic reassessment | TPRM Team | Continuous |
| **8. Offboard & Terminate** | Access revocation, data return/destruction, contract termination | IT / Legal | 5-30 days |

### 3.3 Assessment Frequency

| Risk Tier | Initial Assessment | Reassessment Frequency | Trigger-Based Review |
|-----------|-------------------|------------------------|---------------------|
| Tier 1 (Critical) | Full | Annual | Within 30 days of trigger |
| Tier 2 (High) | Full | Annual | Within 45 days of trigger |
| Tier 3 (Medium) | Standard | Every 2 years | Within 60 days of trigger |
| Tier 4 (Low) | Abbreviated | Every 3 years | As needed |

**Trigger Events:**
- Security incident or data breach at vendor
- Significant change in services or data access
- M&A activity (vendor acquired or merged)
- Material contract changes
- Regulatory findings or enforcement actions
- Negative OSINT findings
- SOC 2 exceptions or qualified opinions

---

## 4. Documentation Requirements

### 4.1 Required Documentation by Tier

| Document | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|----------|:------:|:------:|:------:|:------:|
| **Compliance & Certifications** |||||
| SOC 2 Type 2 Report | Required | Required | Required | Recommended |
| SOC 2 Exception Review | Required | Required | Required | Recommended |
| ISO 27001 Certificate | Required | Recommended | Optional | Optional |
| ISO 27701 Certificate (if PII) | Required | Required | Optional | Optional |
| PCI DSS AOC (if payment data) | Required | Required | N/A | N/A |
| HIPAA BAA (if PHI) | Required | Required | N/A | N/A |
| **Security Assessments** |||||
| Penetration Test Report | Required | Required | Required | Recommended |
| Vulnerability Assessment | Required | Required | Recommended | Optional |
| **Operational Resilience** |||||
| BC/DR Test Results (or Executive Summary) | Required | Required | Recommended | Optional |
| IR Test/Drill Results (or Executive Summary) | Required | Required | Recommended | Optional |
| **Questionnaires** |||||
| CAIQ / SIG / Custom Questionnaire | Required | Required | Required | Required |
| **Architecture** |||||
| System Architecture Diagram | Required | Required | Recommended | Optional |
| Data Flow Diagram | Required | Required | Recommended | Optional |
| **OSINT Analysis** | Required | Required | Required | Required |

### 4.2 Document Validity Periods

| Document Type | Maximum Age |
|---------------|-------------|
| SOC 2 Type 2 Report | 12 months (+ bridge letter for gap) |
| ISO Certifications | Valid until expiration date |
| Penetration Test Report | 12 months |
| BC/DR Test Results | 12 months |
| IR Test Results | 12 months |
| Security Questionnaire | 12 months |

---

## 5. Assessment Components

### 5.1 SOC 2 Type 2 Review

**Required Elements:**
- [ ] Auditor name, report date, audit period
- [ ] Trust Service Criteria coverage (Security, Availability, Confidentiality, Processing Integrity, Privacy)
- [ ] Auditor opinion type (Unqualified, Qualified, Adverse, Disclaimer)
- [ ] Exception count and details
- [ ] Exception remediation status
- [ ] Subservice organizations and method (carve-out/inclusive)

**Assessment Outcomes:**

| Outcome | Criteria |
|---------|----------|
| PASS | Unqualified opinion, no exceptions or all exceptions remediated |
| PASS WITH CONDITIONS | Unqualified opinion with minor exceptions in progress |
| FAIL | Qualified/adverse opinion, or critical unaddressed exceptions |

### 5.2 Penetration Test Review

**Required Elements:**
- [ ] Testing firm and methodology
- [ ] Test date and scope
- [ ] Finding summary by severity (Critical, High, Medium, Low, Informational)
- [ ] Detailed findings for Critical/High
- [ ] Remediation status for all Critical/High findings
- [ ] Retest evidence (if applicable)

**Assessment Outcomes:**

| Outcome | Criteria |
|---------|----------|
| PASS | No open Critical/High findings |
| PASS WITH CONDITIONS | Critical/High findings remediated or mitigated with evidence |
| FAIL | Open Critical/High findings without remediation plan |

### 5.3 BC/DR Test Review

**Required Elements:**
- [ ] Test date and type (tabletop, simulation, full rehearsal)
- [ ] Scope of systems tested
- [ ] RTO/RPO targets defined
- [ ] Actual recovery times achieved
- [ ] Pass/Fail against objectives
- [ ] Issues identified and remediation status

**Acceptable Documentation Formats:**

| Risk Tier | Acceptable Format |
|-----------|-------------------|
| **Tier 1 (Critical)** | Full BC/DR test report OR executive summary with key metrics |
| **Tier 2 (High)** | Full BC/DR test report OR executive summary with key metrics |
| **Tier 3 (Medium)** | Executive summary acceptable |
| **Tier 4 (Low)** | Self-attestation acceptable |

**Note:** For Critical and High risk vendors, BC/DR test results (or executive summary thereof) are a **conditional approval requirement**. Vendors must provide this documentation within 30 days of assessment or approval may be revoked.

**Assessment Outcomes:**

| Outcome | Criteria |
|---------|----------|
| PASS | Test conducted within 12 months, RTO/RPO targets met |
| PASS WITH CONDITIONS | Test conducted, minor gaps with remediation plan |
| FAIL | No test evidence, or RTO/RPO significantly missed |

### 5.4 Incident Response Review

**Required Elements:**
- [ ] IR Plan or Playbook summary
- [ ] IR test/drill date and type
- [ ] Scenarios tested
- [ ] MTTD/MTTR targets and actuals (if available)
- [ ] Gaps identified and remediation status
- [ ] Incident history (past 12 months)

**Acceptable Documentation Formats:**

| Risk Tier | Acceptable Format |
|-----------|-------------------|
| **Tier 1 (Critical)** | Full IR test report OR executive summary with key metrics |
| **Tier 2 (High)** | Full IR test report OR executive summary with key metrics |
| **Tier 3 (Medium)** | Executive summary acceptable |
| **Tier 4 (Low)** | Self-attestation acceptable |

**Note:** For Critical and High risk vendors, IR test results (or executive summary thereof) are a **conditional approval requirement**. Vendors must provide this documentation within 30 days of assessment or approval may be revoked.

**Assessment Outcomes:**

| Outcome | Criteria |
|---------|----------|
| PASS | IR testing conducted within 12 months, no critical gaps |
| PASS WITH CONDITIONS | IR plan exists, testing planned or minor gaps |
| FAIL | No IR plan or testing evidence |

### 5.5 OSINT Analysis

**Required Elements:**
- [ ] Search date and sources checked
- [ ] Public breach database search results
- [ ] News/media search results
- [ ] Regulatory action search results
- [ ] Threat intelligence findings (if available)
- [ ] Vendor public security resources identified

**Sources to Check:**
- California AG Data Breach List
- HaveIBeenPwned
- State AG breach notifications
- Security news outlets
- Ransomware victim lists
- FTC/regulatory enforcement databases

**Assessment Outcomes:**

| Outcome | Criteria |
|---------|----------|
| PASS | No breaches, incidents, or regulatory actions found |
| PASS WITH CONDITIONS | Historical incident (>24 months) with evidence of remediation |
| FAIL | Recent breach (<24 months) or active regulatory action |

### 5.6 Security Questionnaire Review

**Required Elements:**
- [ ] Questionnaire type (CAIQ, SIG, SIG Lite, Custom)
- [ ] Completion date
- [ ] Key control areas reviewed
- [ ] Gaps or concerns identified
- [ ] Follow-up questions addressed

### 5.7 Assessment Report Deliverable

**All vendor assessments must produce a professionally formatted Microsoft Word assessment report.**

#### Report Format Requirements

| Element | Requirement |
|---------|-------------|
| **File Format** | Microsoft Word (.docx) |
| **Template** | Standard TPRM Assessment Report Template |
| **Branding** | Professional formatting with company colors |
| **Classification** | "CONFIDENTIAL - FOR INTERNAL USE ONLY" |
| **Header/Footer** | Vendor name, page numbers, confidentiality notice |

#### Required Report Sections

1. **Title Page**
   - Vendor name
   - Assessment date
   - Assessment type (Initial/Annual/Trigger-Based)
   - Assessor name
   - Risk rating (with color coding)
   - Overall score

2. **Executive Summary**
   - Brief vendor description
   - Key findings summary
   - Risk score breakdown by category
   - Assessment conclusion (Approved/Approved with Conditions/Denied)
   - Conditions for approval (if applicable)

3. **Documents Reviewed**
   - Table of all documents reviewed
   - Document type, date, and status (Current/Expired)

4. **Infrastructure & Architecture Analysis**
   - Cloud environment details
   - Security infrastructure components
   - Third-party integrations
   - Architecture strengths and concerns

5. **Compliance Certifications**
   - SOC 2 Type 2 review (audit details, opinion, exceptions, remediation)
   - ISO certifications
   - Other applicable certifications (PCI, HIPAA, etc.)

6. **Security Assessment**
   - Penetration test review (findings, severity, remediation status)
   - Security controls summary table
   - OSINT analysis results

7. **Business Continuity Assessment**
   - BCP policy analysis
   - BC/DR test results (or notation if not provided)
   - Incident response testing (or notation if not provided)

8. **Risk Findings**
   - Numbered findings with:
     - Severity (Critical/High/Medium/Low/Informational)
     - Category
     - Description
     - Recommendation
     - Status (Open/Closed/Remediated)
     - Due date (if applicable)
   - Color-coded severity indicators

9. **Recommendations**
   - Immediate actions (30 days)
   - Short-term actions (90 days)
   - Ongoing monitoring requirements

10. **Data Classification**
    - Data types shared with vendor
    - Risk level for each data type

11. **Approval Section**
    - Assessor signature/name and date
    - Reviewer signature/name and date
    - Approver signature/name and date

#### Visual Formatting Standards

| Element | Standard |
|---------|----------|
| **Status Indicators** | Green = Pass/Low Risk, Yellow = Warning/Medium Risk, Red = Fail/High Risk |
| **Tables** | Alternating row shading, clear headers |
| **Findings** | Color-coded headers by severity |
| **Scores** | Numeric with color-coded status cells |

#### Report Storage

- **Location:** Vendor folder in TPRM document repository
- **Naming Convention:** `[Vendor-Name]-TPRM-Assessment-[YYYY-MM-DD].docx`
- **Retention:** Minimum 7 years

#### Report Distribution

| Risk Tier | Distribution |
|-----------|--------------|
| Tier 1 (Critical) | CISO, Security Manager, Business Owner, Legal |
| Tier 2 (High) | Security Manager, Business Owner |
| Tier 3 (Medium) | TPRM Lead, Business Owner |
| Tier 4 (Low) | TPRM Team, Business Owner |

### 5.8 Executive Summary Deliverable

**In addition to the full assessment report, all vendor assessments must include a one-page Executive Summary document.**

#### Purpose

The Executive Summary provides a concise, high-level overview for leadership review and decision-making. It enables quick risk assessment without requiring review of the full report.

#### Format Requirements

| Element | Requirement |
|---------|-------------|
| **Length** | One page maximum (single-sided) |
| **File Format** | Microsoft Word (.docx) |
| **Layout** | Professional, easy to scan |
| **Color Coding** | Status indicators (Green/Yellow/Red) |

#### Required Content

1. **Header Section**
   - Vendor name (prominently displayed)
   - Assessment date
   - Assessor name
   - Overall risk rating with color indicator

2. **Vendor Overview** (2-3 sentences)
   - Brief description of vendor services
   - Relationship with the company

3. **Assessment Results Summary**
   - Risk score table (by category)
   - Key compliance certifications (SOC 2, ISO, etc.)
   - Penetration test status (Pass/Fail)
   - OSINT status (Pass/Fail)

4. **Key Findings** (Top 3-5)
   - Brief bullet points
   - Severity indicators
   - Status (Open/Closed)

5. **Recommendation**
   - Assessment conclusion: APPROVED / APPROVED WITH CONDITIONS / DENIED
   - Key conditions (if applicable)
   - Next review date

6. **Approval Block**
   - Signature lines for Assessor, Reviewer, Approver

#### Executive Summary Storage

- **Naming Convention:** `[Vendor-Name]-Executive-Summary-[YYYY-MM-DD].docx`
- **Location:** Same folder as full assessment report

#### When to Use

| Audience | Document |
|----------|----------|
| Executive leadership | Executive Summary only |
| Risk Committee | Executive Summary + Full Report |
| Business Owner | Executive Summary + Full Report |
| TPRM Team | Full Report |

---

## 6. Review & Approval Workflow

### 6.1 Assessment Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Analyst    │────▶│   Manager    │────▶│  Risk Owner  │────▶│   Approved   │
│   Review     │     │   Review     │     │   Approval   │     │   or Denied  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
   Draft Report      Quality Check         Risk Acceptance
   Findings ID       Findings Valid        (if applicable)
```

### 6.2 Approval Authority

| Decision | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|----------|--------|--------|--------|--------|
| **Approve (No Findings)** | CISO | Security Manager | TPRM Lead | TPRM Analyst |
| **Approve with Conditions** | CISO | CISO | Security Manager | TPRM Lead |
| **Risk Acceptance Required** | CIO + CISO | CISO | Security Manager | TPRM Lead |
| **Deny/Reject** | CISO | CISO | Security Manager | TPRM Lead |

### 6.3 Risk Acceptance Requirements

When approving a vendor with known risks:
- [ ] Document specific risks being accepted
- [ ] Document business justification
- [ ] Define compensating controls (if any)
- [ ] Set acceptance expiration date (max 12 months)
- [ ] Obtain appropriate signature authority
- [ ] Track in risk register

---

## 7. Ongoing Monitoring

### 7.1 Continuous Monitoring Activities

| Activity | Frequency | Owner | Automation |
|----------|-----------|-------|------------|
| OSINT/Threat Intelligence Monitoring | Continuous | TPRM Team | Yes |
| Security Rating Monitoring (if subscribed) | Continuous | TPRM Team | Yes |
| Certificate Expiration Tracking | Monthly | TPRM Team | Yes |
| Contract Renewal Tracking | Quarterly | Procurement | Partial |
| Regulatory Change Monitoring | Quarterly | Compliance | Partial |
| Vendor Financial Health | Annually | Finance | No |

### 7.2 Periodic Review Activities

| Activity | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|----------|--------|--------|--------|--------|
| Full Reassessment | Annual | Annual | Biennial | Triennial |
| Documentation Refresh | Annual | Annual | Biennial | Triennial |
| Contract Review | Annual | Annual | At renewal | At renewal |
| Access Review | Quarterly | Semi-annual | Annual | Annual |

### 7.3 Trigger-Based Reviews

Immediate review required when:
- [ ] Vendor reports a security incident
- [ ] OSINT reveals breach or regulatory action
- [ ] Significant service or contract change
- [ ] Vendor M&A activity
- [ ] Material change in data access
- [ ] Business owner reports concerns
- [ ] Security rating drops significantly

---

## 8. Escalation Procedures

### 8.1 Escalation Matrix

| Trigger | Initial Escalation | Secondary Escalation | Timeline |
|---------|-------------------|---------------------|----------|
| Vendor data breach (confirmed) | Security Manager | CISO → Legal → Executive | Immediate |
| Critical pentest finding (unaddressed) | Security Manager | CISO | 48 hours |
| SOC 2 qualified/adverse opinion | TPRM Lead | Security Manager | 5 days |
| BC/DR test failure | TPRM Lead | Security Manager | 5 days |
| Documentation not provided (30+ days) | Business Owner | Security Manager | 30 days |
| OSINT breach finding | Security Manager | CISO | 24 hours |
| Vendor refuses assessment | TPRM Lead | Security Manager → CISO | 5 days |

### 8.2 Escalation Actions

| Level | Actions |
|-------|---------|
| **Level 1 - TPRM Lead** | Document issue, contact vendor, notify business owner |
| **Level 2 - Security Manager** | Review risk, determine mitigations, escalate if needed |
| **Level 3 - CISO** | Risk acceptance decision, executive notification, contract review |
| **Level 4 - Executive** | Business continuity decision, legal engagement, termination consideration |

---

## 9. Metrics & Reporting

### 9.1 Key Performance Indicators (KPIs)

| Metric | Target | Frequency |
|--------|--------|-----------|
| % Vendors with current assessment | >95% | Monthly |
| Average assessment completion time | <15 days | Monthly |
| % Critical/High findings remediated on time | >90% | Monthly |
| % Documentation requests fulfilled | >85% | Quarterly |
| % Vendors by risk tier (distribution) | N/A | Quarterly |
| OSINT negative findings | <5% of vendors | Quarterly |

### 9.2 Key Risk Indicators (KRIs)

| Metric | Threshold | Action |
|--------|-----------|--------|
| Vendors with overdue assessments | >10% | Escalate to Security Manager |
| Open Critical/High findings (>30 days) | >5 | Escalate to CISO |
| Vendors without SOC 2 (Tier 1-2) | >0 | Escalate to Business Owner |
| Vendors with recent breaches | Any | Immediate review |
| Failed BC/DR tests | >10% | Process review |

### 9.3 Reporting Cadence

| Report | Audience | Frequency |
|--------|----------|-----------|
| TPRM Dashboard | TPRM Team | Real-time |
| Vendor Risk Summary | Security Manager | Weekly |
| TPRM Program Status | CISO | Monthly |
| Executive Risk Report | Executive Team | Quarterly |
| Board Risk Summary | Board / Audit Committee | Quarterly |

---

## 10. Roles & Responsibilities

### 10.1 RACI Matrix

| Activity | TPRM Analyst | TPRM Lead | Security Mgr | CISO | Business Owner | Vendor |
|----------|:------------:|:---------:|:------------:|:----:|:--------------:|:------:|
| Vendor intake request | I | I | I | I | **R** | C |
| Risk tier assignment | **R** | A | C | I | C | I |
| Document collection | **R** | A | I | I | C | **R** |
| Assessment analysis | **R** | A | C | I | I | C |
| Finding identification | **R** | A | C | I | I | I |
| Risk acceptance | I | C | C | **A** | **R** | I |
| Ongoing monitoring | **R** | A | C | I | I | I |
| Escalation handling | C | **R** | A | A | C | C |
| Vendor remediation | C | C | I | I | C | **R** |

**Legend:** R = Responsible, A = Accountable, C = Consulted, I = Informed

### 10.2 Role Definitions

| Role | Responsibilities |
|------|-----------------|
| **TPRM Analyst** | Conduct assessments, analyze documentation, identify findings, maintain vendor records |
| **TPRM Lead** | Oversee assessment quality, manage escalations, report metrics, process improvement |
| **Security Manager** | Review high-risk assessments, approve risk acceptances, manage team |
| **CISO** | Program ownership, executive escalations, strategic decisions, board reporting |
| **Business Owner** | Vendor relationship, business justification, risk acceptance participation |
| **Vendor** | Provide documentation, respond to inquiries, remediate findings |

---

## Appendix A: Document Templates

- [ ] Vendor Intake Form
- [ ] Risk Tier Assessment Worksheet
- [ ] TPRM Assessment Report Template
- [ ] Risk Acceptance Form
- [ ] Vendor Offboarding Checklist

## Appendix B: Reference Documents

- [ ] Security Questionnaire (CAIQ/SIG)
- [ ] Contractual Security Requirements
- [ ] Data Classification Policy
- [ ] Incident Response Plan
- [ ] Vendor Management Policy

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 2026 | AI TPRM Machine | Initial version |

---

*This document was generated by the AI TPRM Machine to support Sleep Number's Third Party Risk Management program.*
