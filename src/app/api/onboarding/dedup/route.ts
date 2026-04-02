import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth'
import { findVendorMatches, type ExtractedVendorInfo } from '@/lib/vendors/dedup'
import { chat } from '@/lib/ai/provider'
import { safeParseJSON } from '@/lib/ai/validate'
import { SAFETY_PREAMBLE } from '@/lib/ai/safety-preamble'
import { sanitizeAIError } from '@/lib/ai/errors'

export const dynamic = 'force-dynamic'

interface DocumentSnippet {
  fileName: string
  textSnippet: string
  documentDate?: string | null
  documentType?: string | null
}

interface DocumentComparison {
  existingDocName: string
  newDocName: string
  similarity: 'identical' | 'updated' | 'different'
  existingDocDate: string | null
  newDocDate: string | null
  explanation: string
}

const SIMILARITY_PROMPT = `Compare these two document excerpts from the same vendor and determine their relationship.

Document A (existing, dated {dateA}):
<doc_a>
{docA}
</doc_a>

Document B (new upload, dated {dateB}):
<doc_b>
{docB}
</doc_b>

Return JSON:
{
  "similarity": "identical | updated | different",
  "confidence": 0.95,
  "explanation": "Brief explanation of the relationship"
}

Definitions:
- "identical": Same document content, possibly different formatting. Same findings and conclusions.
- "updated": Newer version of the same document type covering the same vendor. Contains updated information.
- "different": Different documents entirely (different type, scope, or subject).`

async function compareDocuments(
  existingDoc: { name: string; date: string | null; snippet: string },
  newDoc: { name: string; date: string | null; snippet: string }
): Promise<DocumentComparison> {
  try {
    const prompt = SIMILARITY_PROMPT
      .replace('{dateA}', existingDoc.date || 'unknown')
      .replace('{dateB}', newDoc.date || 'unknown')
      .replace('{docA}', existingDoc.snippet.slice(0, 3000))
      .replace('{docB}', newDoc.snippet.slice(0, 3000))

    const response = await chat(
      [
        { role: 'system', content: SAFETY_PREAMBLE + 'You are a document comparison expert.' },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.2, maxTokens: 500, tier: 'simple' }
    )

    const parsed = safeParseJSON<{ similarity: string; confidence: number; explanation: string }>(response.content)
    if (parsed.success && parsed.data) {
      const sim = parsed.data.similarity as 'identical' | 'updated' | 'different'
      return {
        existingDocName: existingDoc.name,
        newDocName: newDoc.name,
        similarity: ['identical', 'updated', 'different'].includes(sim) ? sim : 'different',
        existingDocDate: existingDoc.date,
        newDocDate: newDoc.date,
        explanation: parsed.data.explanation || '',
      }
    }
  } catch (e) {
    console.error('Document comparison error:', e)
  }

  return {
    existingDocName: existingDoc.name,
    newDocName: newDoc.name,
    similarity: 'different',
    existingDocDate: existingDoc.date,
    newDocDate: newDoc.date,
    explanation: 'Could not determine similarity',
  }
}

export async function POST(request: Request) {
  const denied = await requirePermission('vendors', 'view')
  if (denied) return denied

  try {
    const body = await request.json()
    const vendorInfo: ExtractedVendorInfo = body.vendorInfo
    const documents: DocumentSnippet[] = body.documents || []

    if (!vendorInfo || !vendorInfo.name) {
      return NextResponse.json(
        { error: 'vendorInfo with at least a name is required' },
        { status: 400 }
      )
    }

    // Find vendor matches using multi-point dedup
    const matches = await findVendorMatches(vendorInfo)

    // For each match, compare uploaded documents against existing
    const matchesWithComparisons = await Promise.all(
      matches.map(async (match) => {
        const documentComparisons: DocumentComparison[] = []

        if (match.vendor.documents.length > 0 && documents.length > 0) {
          // Compare each new document against existing documents of the same type
          for (const newDoc of documents) {
            // Find existing docs of the same type, or fall back to comparing all
            const existingCandidates = match.vendor.documents.filter(
              (ed) => ed.documentType === newDoc.documentType
            )
            const toCompare = existingCandidates.length > 0
              ? existingCandidates
              : match.vendor.documents.slice(0, 3) // compare against first 3 if no type match

            for (const existingDoc of toCompare) {
              // Get snippet from existing doc's analysis result
              let existingSnippet = ''
              if (existingDoc.analysisResult) {
                try {
                  const analysis = JSON.parse(existingDoc.analysisResult)
                  existingSnippet = [
                    analysis.summary || '',
                    ...(analysis.keyFindings || []),
                    ...(analysis.riskFactors || []),
                  ].join('\n').slice(0, 3000)
                } catch {
                  existingSnippet = existingDoc.analysisResult.slice(0, 3000)
                }
              }

              if (!existingSnippet && !newDoc.textSnippet) continue

              const comparison = await compareDocuments(
                {
                  name: existingDoc.documentName,
                  date: existingDoc.documentDate?.toISOString().split('T')[0] || null,
                  snippet: existingSnippet,
                },
                {
                  name: newDoc.fileName,
                  date: newDoc.documentDate || null,
                  snippet: newDoc.textSnippet,
                }
              )
              documentComparisons.push(comparison)
            }
          }
        }

        return {
          vendor: match.vendor,
          matchType: match.matchType,
          matchPoints: match.matchPoints,
          overallConfidence: match.overallConfidence,
          documentComparisons,
        }
      })
    )

    return NextResponse.json({ matches: matchesWithComparisons })
  } catch (error) {
    const safe = sanitizeAIError(error)
    return NextResponse.json({ error: safe.message }, { status: safe.status })
  }
}
