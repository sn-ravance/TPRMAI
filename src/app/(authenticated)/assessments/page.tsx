'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable, Column } from '@/components/ui/data-table'
import {
  ClipboardCheck,
  Search,
  Filter,
  Calendar,
  Building2,
} from 'lucide-react'

interface Assessment {
  id: string
  assessmentType: string
  assessmentStatus: string
  riskRating: string | null
  overallAssessmentScore: number | null
  assessmentDate: string | null
  assessedBy: string | null
  summary: string | null
  createdAt: string
  vendor: { id: string; name: string }
  _count: { riskFindings: number }
}

const statusVariant = (s: string) => {
  switch (s) {
    case 'COMPLETE': case 'APPROVED': return 'low'
    case 'IN_PROGRESS': case 'PENDING_REVIEW': return 'medium'
    case 'DRAFT': return 'info'
    default: return 'secondary'
  }
}

const ratingVariant = (r: string | null) => {
  switch (r) {
    case 'CRITICAL': return 'critical'
    case 'HIGH': return 'high'
    case 'MEDIUM': return 'medium'
    case 'LOW': return 'low'
    default: return 'secondary'
  }
}

const typeLabel = (t: string) => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

export default function AssessmentsPage() {
  const router = useRouter()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    fetch(`/api/assessments?${params}`)
      .then((r) => r.json())
      .then((data) => setAssessments(Array.isArray(data) ? data : []))
      .catch(() => setAssessments([]))
      .finally(() => setLoading(false))
  }, [statusFilter])

  const filtered = assessments.filter((a) =>
    !search || a.vendor.name.toLowerCase().includes(search.toLowerCase()) ||
    a.assessmentType.toLowerCase().includes(search.toLowerCase())
  )

  // Summary counts
  const total = assessments.length
  const inProgress = assessments.filter((a) => a.assessmentStatus === 'IN_PROGRESS').length
  const pendingReview = assessments.filter((a) => a.assessmentStatus === 'PENDING_REVIEW').length
  const complete = assessments.filter((a) => a.assessmentStatus === 'COMPLETE' || a.assessmentStatus === 'APPROVED').length

  const columns: Column<Assessment>[] = [
    {
      key: 'vendor.name',
      header: 'Vendor',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{row.vendor.name}</span>
        </div>
      ),
    },
    {
      key: 'assessmentType',
      header: 'Type',
      sortable: true,
      render: (row) => typeLabel(row.assessmentType),
    },
    {
      key: 'assessmentStatus',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <Badge variant={statusVariant(row.assessmentStatus)}>
          {row.assessmentStatus.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'riskRating',
      header: 'Risk Rating',
      sortable: true,
      render: (row) =>
        row.riskRating ? (
          <Badge variant={ratingVariant(row.riskRating)}>{row.riskRating}</Badge>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: 'overallAssessmentScore',
      header: 'Score',
      sortable: true,
      className: 'text-center',
      render: (row) =>
        row.overallAssessmentScore != null ? (
          <span className="font-mono">{row.overallAssessmentScore}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: '_count.riskFindings',
      header: 'Findings',
      sortable: true,
      className: 'text-center',
      render: (row) => row._count.riskFindings,
    },
    {
      key: 'assessedBy',
      header: 'Assessed By',
      render: (row) => row.assessedBy || <span className="text-gray-400">—</span>,
    },
    {
      key: 'assessmentDate',
      header: 'Date',
      sortable: true,
      render: (row) =>
        row.assessmentDate
          ? new Date(row.assessmentDate).toLocaleDateString()
          : <span className="text-gray-400">—</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <p className="text-sm text-gray-500">Track and manage vendor risk assessments</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-blue-300" onClick={() => setStatusFilter('')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-yellow-300" onClick={() => setStatusFilter('IN_PROGRESS')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">{inProgress}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-orange-300" onClick={() => setStatusFilter('PENDING_REVIEW')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold">{pendingReview}</p>
              </div>
              <Filter className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-green-300" onClick={() => setStatusFilter('COMPLETE')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Complete</p>
                <p className="text-2xl font-bold">{complete}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vendor or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {statusFilter && (
              <Button variant="ghost" size="sm" onClick={() => setStatusFilter('')}>
                Clear filter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filtered}
            loading={loading}
            emptyIcon={<ClipboardCheck className="h-12 w-12 text-gray-300 mb-3" />}
            emptyTitle="No assessments yet"
            emptyDescription="Assessments will appear here when CARA analyzes vendor risk."
            onRowClick={(row) => router.push(`/vendors/${row.vendor.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
