import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'

// Force dynamic to prevent static generation issues with pdf-parse
export const dynamic = 'force-dynamic'

// Lazy import pdf-parse to avoid build-time file loading issues
const pdfParse = async (buffer: Buffer) => {
  const pdf = await import('pdf-parse')
  return pdf.default(buffer)
}

const anthropic = new Anthropic()

const ANALYSIS_PROMPT = `You are an expert Third Party Risk Management (TPRM) analyst.
Analyze the provided vendor document and extract:
1. Key security controls and certifications
2. Risk findings and gaps
3. Compliance status (SOC 2, ISO 27001, etc.)
4. Data handling practices
5. Business continuity capabilities
6. Recommended risk rating (CRITICAL, HIGH, MEDIUM, LOW)

Format your response as JSON with the following structure:
{
  "documentType": "SOC2_TYPE2 | ISO27001 | PENTEST | CAIQ | BCP | ARCHITECTURE | BRIDGE_LETTER | SOA | EXECUTIVE_SUMMARY | OTHER",
  "summary": "Brief summary of the document",
  "keyFindings": ["finding1", "finding2"],
  "riskFactors": ["risk1", "risk2"],
  "strengths": ["strength1", "strength2"],
  "recommendedRating": "MEDIUM",
  "controlsCovered": ["control1", "control2"],
  "expirationDate": "2025-12-31 or null",
  "recommendations": ["recommendation1", "recommendation2"]
}`

// Extract text from PDF using pdf-parse (dynamically imported)
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer)
    return (data as { text: string }).text
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract PDF content')
  }
}

// Extract text from DOCX using JSZip
async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(buffer)
    const documentXml = await zip.file('word/document.xml')?.async('string')

    if (!documentXml) {
      throw new Error('No document.xml found in DOCX')
    }

    // Extract text from XML, removing tags
    const text = documentXml
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return text
  } catch (error) {
    console.error('DOCX extraction error:', error)
    throw new Error('Failed to extract DOCX content')
  }
}

// Extract text from XLSX
async function extractXlsxText(buffer: Buffer): Promise<string> {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const texts: string[] = []

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]
      const csv = XLSX.utils.sheet_to_csv(sheet)
      texts.push(`=== Sheet: ${sheetName} ===\n${csv}`)
    }

    return texts.join('\n\n')
  } catch (error) {
    console.error('XLSX extraction error:', error)
    throw new Error('Failed to extract XLSX content')
  }
}

// Convert image to base64 for vision API
function imageToBase64(buffer: Buffer, mimeType: string): { type: 'base64'; media_type: string; data: string } {
  return {
    type: 'base64',
    media_type: mimeType,
    data: buffer.toString('base64'),
  }
}

// Detect file type from extension and MIME
function getFileType(filename: string, mimeType: string): 'pdf' | 'docx' | 'xlsx' | 'image' | 'text' {
  const ext = filename.toLowerCase().split('.').pop() || ''

  if (ext === 'pdf' || mimeType === 'application/pdf') return 'pdf'
  if (ext === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx'
  if (ext === 'doc' || mimeType === 'application/msword') return 'docx'
  if (ext === 'xlsx' || ext === 'xls' || mimeType.includes('spreadsheet')) return 'xlsx'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext) || mimeType.startsWith('image/')) return 'image'

  return 'text'
}

// Get proper MIME type for images
function getImageMimeType(filename: string, originalMime: string): string {
  const ext = filename.toLowerCase().split('.').pop() || ''
  const mimeMap: Record<string, string> = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
  }
  return mimeMap[ext] || originalMime || 'image/png'
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const vendorId = formData.get('vendorId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileType = getFileType(file.name, file.type)

    let content: string = ''
    let isImage = false
    let imageData: { type: 'base64'; media_type: string; data: string } | null = null

    // Extract content based on file type
    switch (fileType) {
      case 'pdf':
        content = await extractPdfText(buffer)
        break
      case 'docx':
        content = await extractDocxText(buffer)
        break
      case 'xlsx':
        content = await extractXlsxText(buffer)
        break
      case 'image':
        isImage = true
        imageData = imageToBase64(buffer, getImageMimeType(file.name, file.type))
        break
      case 'text':
      default:
        content = buffer.toString('utf-8')
        break
    }

    // Analyze with Claude
    let response

    if (isImage && imageData) {
      // Use vision API for images
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: imageData as { type: 'base64'; media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'; data: string },
              },
              {
                type: 'text',
                text: `${ANALYSIS_PROMPT}\n\nAnalyze this vendor document image (likely an architecture diagram, certificate, or similar):`,
              },
            ],
          },
        ],
      })
    } else {
      // Use text API for documents
      const truncatedContent = content.slice(0, 100000) // Claude has ~200k context, leave room for prompt
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: ANALYSIS_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Analyze this vendor document:\n\n${truncatedContent}`,
          },
        ],
      })
    }

    // Extract text content from response
    const analysisText = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    let analysis
    try {
      // Extract JSON from response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse', summary: analysisText }
    } catch {
      analysis = { summary: analysisText, error: 'JSON parse failed' }
    }

    // Store document in database
    if (vendorId) {
      const document = await prisma.document.create({
        data: {
          vendorId,
          documentName: file.name,
          documentType: analysis.documentType || 'OTHER',
          mimeType: file.type,
          fileSize: file.size,
          status: 'ANALYZED',
          analysisResult: JSON.stringify(analysis),
          retrievedBy: 'DORA',
        },
      })

      // Create findings
      if (analysis.riskFactors?.length > 0) {
        for (const risk of analysis.riskFactors) {
          await prisma.riskFinding.create({
            data: {
              vendorId,
              documentId: document.id,
              title: risk,
              severity: analysis.recommendedRating === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
              identifiedBy: 'SARA',
              status: 'OPEN',
            },
          })
        }
      }

      return NextResponse.json({ document, analysis })
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Document analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    )
  }
}
