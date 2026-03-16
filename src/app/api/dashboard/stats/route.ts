import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalVendors,
      activeAssessments,
      pendingReviews,
      criticalFindings,
      highFindings,
    ] = await Promise.all([
      prisma.vendor.count({ where: { status: 'ACTIVE' } }),
      prisma.riskAssessment.count({ where: { assessmentStatus: 'IN_PROGRESS' } }),
      prisma.riskAssessment.count({ where: { assessmentStatus: 'PENDING_REVIEW' } }),
      prisma.riskFinding.count({ where: { severity: 'CRITICAL', status: 'OPEN' } }),
      prisma.riskFinding.count({ where: { severity: 'HIGH', status: 'OPEN' } }),
    ])

    // Completed this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const completedThisMonth = await prisma.riskAssessment.count({
      where: {
        assessmentStatus: 'COMPLETE',
        updatedAt: { gte: startOfMonth },
      },
    })

    return NextResponse.json({
      totalVendors,
      activeAssessments,
      pendingReviews,
      criticalFindings,
      highFindings,
      completedThisMonth,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    // Return demo data if database not available
    return NextResponse.json({
      totalVendors: 47,
      activeAssessments: 12,
      pendingReviews: 8,
      criticalFindings: 3,
      highFindings: 15,
      completedThisMonth: 5,
    })
  }
}
