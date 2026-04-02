# AI TPRM Machine

An AI-powered Third Party Risk Management (TPRM) platform for automating vendor risk assessments, compliance monitoring, and audit workflows.

## Project Overview

This project integrates AI capabilities with enterprise GRC (Governance, Risk, and Compliance) platforms to streamline TPRM operations:

- **Vendor Risk Assessments**: Automated risk scoring and assessment workflows
- **Audit Management**: Integration with AuditBoard for OpsAudits operations
- **Compliance Monitoring**: Continuous monitoring of third-party vendors
- **Evidence Collection**: Automated evidence gathering and documentation

## Technology Stack

- **Runtime**: Node.js v22.12.0
- **Framework**: Next.js 16
- **AI Provider**: Claude via Azure AI Foundry (PRIMARY)
  - Primary: Claude Opus 4.6
  - Fallback: Claude Opus 4.5
  - OpenAI is optional alternative only
- **ORM**: Prisma with PostgreSQL
- **Auth**: OIDC + stateless JWT, database-driven RBAC (4 system roles)
- **UI**: Radix UI + Tailwind CSS
- **AI Safety**: Input sanitization, output validation, rate limiting, PII masking, NeMo Guardrails
- **Infra**: Docker Compose (app + PostgreSQL + mock-oidc), Terraform (Azure)
- **API Integrations**: AuditBoard REST API

## API Integrations

### AuditBoard

The AuditBoard integration enables:
- OpsAudits management (list, create, clone, cancel, delete, export)
- Risk assessment workflows
- Audit form automation
- Compliance evidence collection

**Configuration Required:**
```bash
AUDITBOARD_TENANT=your-tenant
AUDITBOARD_API_KEY=your-api-key
AUDITBOARD_EMAIL=service-account@company.com
AUDITBOARD_PASSWORD=service-account-password
```

See `.claude/skills/auditboard/` for the complete API integration skill.

## Project Structure

```
TPRMAI/
├── src/
│   ├── app/                     # Next.js pages and API routes
│   ├── components/              # UI components (Radix + Tailwind)
│   ├── lib/
│   │   ├── ai/                  # AI provider abstraction + safety controls
│   │   ├── agents/              # 6 AI agents (VERA, CARA, DORA, SARA, RITA, MARS)
│   │   └── prompts.ts           # DB-backed prompt loader with safety preamble
│   └── middleware.ts            # Auth guard (JWT validation)
├── prisma/                      # Schema + seed data
├── mock-services/mock-oidc/     # OIDC provider for local dev
├── infra/                       # Terraform (Azure)
├── docs/attestations/           # NeMo Guardrails safety attestations
├── docker-compose.yml           # App + PostgreSQL + mock-oidc
└── CLAUDE.MD                    # This file
```

## Development Guidelines

### API Integration Best Practices

1. **Rate Limiting**: AuditBoard API allows 20 requests/second. Use the client's built-in rate limiting.
2. **Authentication**: Store credentials in environment variables, never in code.
3. **Error Handling**: Implement exponential backoff for 429 (rate limit) responses.
4. **Async Operations**: Export operations are async - poll `/notification_messages` for results.

### Security Considerations

- Never commit API keys or credentials
- Use service accounts with minimal required permissions
- Audit API access logs regularly
- Rotate credentials periodically

## Common Tasks

### List Vendor Audits
```python
from auditboard_client import AuditBoardClient

client = AuditBoardClient()
audits = client.list_ops_audits(include="controls,risks")
```

### Create New Assessment
```python
new_audit = client.clone_ops_audit(
    template_id="vendor-assessment-template",
    name="Q1 2024 Vendor Review - Acme Corp"
)
```

### Export Audit Results
```python
download_url = client.export_audit_forms(
    ops_audit_id="audit-123",
    wait_for_download=True
)
```

## Related Resources

- AuditBoard API Documentation: Contact your AuditBoard administrator
- AuditBoard Help Center: https://{tenant}.auditboard.com/help
- Go Client Reference: github.com/dja852/auditboard-go-client
