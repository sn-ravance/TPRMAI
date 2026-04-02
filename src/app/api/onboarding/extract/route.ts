import { NextResponse } from 'next/server'
import { requirePermission, getCurrentUser } from '@/lib/auth'
import { chat } from '@/lib/ai/provider'
import type { ChatMessage } from '@/lib/ai/provider'
import { aiRateLimit } from '@/lib/ai/rate-limit'
import { sanitizeAIError } from '@/lib/ai/errors'
import { maskPII, unmaskPII } from '@/lib/ai/pii-masker'
import { validateDocumentSize } from '@/lib/ai/sanitize'
import { safeParseJSON } from '@/lib/ai/validate'
import { SAFETY_PREAMBLE } from '@/lib/ai/safety-preamble'
import { extractContent } from '@/lib/documents/extract-text'

export const dynamic = 'force-dynamic'

const VENDOR_EXTRACTION_PROMPT = `You are an expert at extracting vendor/company information from business documents (contracts, SOC 2 reports, security questionnaires, certificates, penetration test reports, etc.).

Extract the vendor/company being ASSESSED or DESCRIBED in this document — NOT the auditor, assessor, or testing firm.

For each field, provide a confidence score (0.0 to 1.0) indicating how certain you are.

Also analyze the document for TPRM risk assessment purposes.

Return JSON with this exact structure:
{
  "vendorInfo": {
    "name": "string or null",
    "legalName": "string or null",
    "dunsNumber": "string or null",
    "address": {
      "street": "string or null",
      "city": "string or null",
      "state": "string or null",
      "country": "string or null",
      "zip": "string or null"
    },
    "phone": "string or null",
    "primaryContactName": "string or null",
    "primaryContactEmail": "string or null",
    "primaryContactPhone": "string or null",
    "industry": "string or null",
    "website": "string or null",
    "documentDate": "YYYY-MM-DD or null",
    "documentType": "SOC2_TYPE1 | SOC2_TYPE2 | ISO27001 | PENTEST | VULNERABILITY_SCAN | SIG_QUESTIONNAIRE | CAIQ | CUSTOM_QUESTIONNAIRE | INSURANCE_CERTIFICATE | BUSINESS_CONTINUITY | PRIVACY_POLICY | OTHER"
  },
  "confidence": {
    "name": 0.0,
    "legalName": 0.0,
    "dunsNumber": 0.0,
    "address": 0.0,
    "phone": 0.0,
    "primaryContactName": 0.0,
    "primaryContactEmail": 0.0,
    "primaryContactPhone": 0.0,
    "industry": 0.0,
    "website": 0.0,
    "documentDate": 0.0,
    "documentType": 0.0
  },
  "documentAnalysis": {
    "documentType": "SOC2_TYPE2 | ISO27001 | PENTEST | CAIQ | BCP | ARCHITECTURE | BRIDGE_LETTER | SOA | EXECUTIVE_SUMMARY | OTHER",
    "summary": "Brief summary of the document",
    "keyFindings": ["finding1", "finding2"],
    "riskFactors": ["risk1", "risk2"],
    "strengths": ["strength1", "strength2"],
    "recommendedRating": "CRITICAL | HIGH | MEDIUM | LOW",
    "controlsCovered": ["control1", "control2"],
    "expirationDate": "YYYY-MM-DD or null",
    "recommendations": ["recommendation1", "recommendation2"]
  }
}

If a field is not found in the document, set it to null with confidence 0.0.`

export async function POST(request: Request) {
  const denied = await requirePermission('documents', 'edit')
  if (denied) return denied

  const user = await getCurrentUser()
  if (user) {
    const limited = aiRateLimit(user.id)
    if (limited) return limited
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '52428800', 10)
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.` },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const extracted = await extractContent(buffer, file.name, file.type)

    if (!extracted.isImage) {
      const sizeError = validateDocumentSize(extracted.text)
      if (sizeError) {
        return NextResponse.json({ error: sizeError }, { status: 400 })
      }
    }

    // Mask PII before sending to AI
    const { maskedText, mappings: piiMappings } = extracted.isImage
      ? { maskedText: extracted.text, mappings: [] }
      : maskPII(extracted.text)

    const systemPrompt = SAFETY_PREAMBLE + VENDOR_EXTRACTION_PROMPT
    let messages: ChatMessage[]

    if (extracted.isImage && extracted.imageBase64 && extracted.imageMime) {
      messages = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${extracted.imageMime};base64,${extracted.imageBase64}` },
            },
            {
              type: 'text',
              text: 'Extract vendor information and analyze this vendor document image:',
            },
          ],
        },
      ]
    } else {
      const truncatedContent = maskedText.slice(0, 100000)
      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Extract vendor information and analyze this document:\n\n<user_input>\n${truncatedContent}\n</user_input>` },
      ]
    }

    const response = await chat(messages, {
      temperature: 0.3,
      maxTokens: 4096,
      tier: 'standard',
    })

    const unmaskedResponse = unmaskPII(response.content, piiMappings)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any
    const parsed = safeParseJSON<Record<string, unknown>>(unmaskedResponse)
    if (parsed.success) {
      result = parsed.data
    } else {
      return NextResponse.json(
        { error: 'Failed to parse AI extraction response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      extractedText: extracted.text.slice(0, 5000),
      vendorInfo: result.vendorInfo || {},
      confidence: result.confidence || {},
      documentAnalysis: result.documentAnalysis || {},
    })
  } catch (error) {
    const safe = sanitizeAIError(error)
    return NextResponse.json({ error: safe.message }, { status: safe.status })
  }
}
