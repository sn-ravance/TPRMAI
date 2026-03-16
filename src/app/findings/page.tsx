'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertTriangle,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Building2,
} from 'lucide-react'

interface Finding {
  id: string
  findingId: string | null
  title: string
  description: string | null
  recommendation: string | null
  severity: string
  status: string
  findingCategory: string | null
  dueDate: string | null
  identifiedDate: string
  identifiedBy: string | null
  vendor: {
    id: string
    name: string
  }
  document: {
    id: string
    documentType: string
    documentName: string
  } | null
  assessment: {
    id: string
    assessmentType: string
    assessmentDate: string | null
  } | null
}

interface Summary {
  severityCounts: Record<string, number>
  statusCounts: Record<string, number>
  categories: string[]
  vendors: { id: string; name: string }[]
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)

  // Filter states
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('ALL')
  const [status, setStatus] = useState('ALL')
  const [category, setCategory] = useState('ALL')
  const [vendorId, setVendorId] = useState('ALL')
  const [includeAll, setIncludeAll] = useState(false)
  const [page, setPage] = useState(1)

  const fetchFindings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (severity !== 'ALL') params.set('severity', severity)
      if (status !== 'ALL') params.set('status', status)
      if (category !== 'ALL') params.set('category', category)
      if (vendorId !== 'ALL') params.set('vendorId', vendorId)
      if (includeAll) params.set('includeAll', 'true')
      params.set('page', page.toString())
      params.set('limit', '25')

      const res = await fetch(`/api/findings?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setFindings(data.findings || [])
        setSummary(data.summary || null)
        setPagination(data.pagination || null)
      }
    } catch (error) {
      console.error('Failed to fetch findings:', error)
    } finally {
      setLoading(false)
    }
  }, [search, severity, status, category, vendorId, includeAll, page])

  useEffect(() => {
    fetchFindings()
  }, [fetchFindings])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchFindings()
  }

  const clearFilters = () => {
    setSearch('')
    setSeverity('ALL')
    setStatus('ALL')
    setCategory('ALL')
    setVendorId('ALL')
    setIncludeAll(false)
    setPage(1)
  }

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-600 text-white'
      case 'HIGH':
        return 'bg-orange-500 text-white'
      case 'MEDIUM':
        return 'bg-yellow-500 text-black'
      case 'LOW':
        return 'bg-blue-500 text-white'
      case 'INFORMATIONAL':
        return 'bg-gray-400 text-white'
      default:
        return 'bg-gray-300'
    }
  }

  const getStatusColor = (stat: string) => {
    switch (stat) {
      case 'OPEN':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'IN_REMEDIATION':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PENDING_VERIFICATION':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'ACCEPTED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const hasActiveFilters = search || severity !== 'ALL' || status !== 'ALL' || category !== 'ALL' || vendorId !== 'ALL' || includeAll

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Findings</h1>
          <p className="text-gray-500">Search and manage security findings across all vendors</p>
        </div>
        {pagination && (
          <div className="text-sm text-gray-500">
            {pagination.total} total findings
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL'].map((sev) => (
            <Card
              key={sev}
              className={`cursor-pointer transition-all ${severity === sev ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
              onClick={() => {
                setSeverity(severity === sev ? 'ALL' : sev)
                setPage(1)
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(sev)}`}>
                    {sev}
                  </span>
                  <span className="text-2xl font-bold">
                    {summary.severityCounts[sev] || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search findings by title, description, ID, or vendor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {hasActiveFilters && (
                <Button type="button" variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              <Select value={severity} onValueChange={(v) => { setSeverity(v); setPage(1); }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Severity</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="INFORMATIONAL">Informational</SelectItem>
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_REMEDIATION">In Remediation</SelectItem>
                  <SelectItem value="PENDING_VERIFICATION">Pending Verification</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>

              {summary?.categories && summary.categories.length > 0 && (
                <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    {summary.categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {summary?.vendors && summary.vendors.length > 0 && (
                <Select value={vendorId} onValueChange={(v) => { setVendorId(v); setPage(1); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Vendors</SelectItem>
                    {summary.vendors.map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={includeAll}
                  onChange={(e) => { setIncludeAll(e.target.checked); setPage(1); }}
                  className="rounded border-gray-300"
                />
                Include closed
              </label>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Findings ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : findings.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Finding</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {findings.map((finding) => (
                    <TableRow
                      key={finding.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedFinding(finding)}
                    >
                      <TableCell className="font-mono text-sm">
                        {finding.findingId || finding.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium truncate">{finding.title}</div>
                        {finding.description && (
                          <div className="text-sm text-gray-500 truncate">
                            {finding.description.slice(0, 80)}...
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {finding.vendor.name}
                        </div>
                      </TableCell>
                      <TableCell>{finding.findingCategory || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(finding.status)} variant="outline">
                          {finding.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {finding.dueDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(finding.dueDate).toLocaleDateString()}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} findings
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No findings found
              </h3>
              <p className="text-gray-500">
                {hasActiveFilters
                  ? 'Try adjusting your search or filters'
                  : 'Findings will appear here after document analysis'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Finding Detail Modal */}
      <Dialog open={!!selectedFinding} onOpenChange={() => setSelectedFinding(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedFinding && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(selectedFinding.severity)}`}>
                    {selectedFinding.severity}
                  </span>
                  {selectedFinding.findingId || selectedFinding.id.slice(0, 8)}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedFinding.title}</h3>
                  <Badge className={getStatusColor(selectedFinding.status)} variant="outline">
                    {selectedFinding.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Vendor:</span>
                    <p className="font-medium">{selectedFinding.vendor.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <p className="font-medium">{selectedFinding.findingCategory || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Identified:</span>
                    <p className="font-medium">
                      {new Date(selectedFinding.identifiedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Due Date:</span>
                    <p className="font-medium">
                      {selectedFinding.dueDate
                        ? new Date(selectedFinding.dueDate).toLocaleDateString()
                        : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Identified By:</span>
                    <p className="font-medium">{selectedFinding.identifiedBy || '-'}</p>
                  </div>
                  {selectedFinding.document && (
                    <div>
                      <span className="text-gray-500">Source Document:</span>
                      <p className="font-medium flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {selectedFinding.document.documentType}
                      </p>
                    </div>
                  )}
                </div>

                {selectedFinding.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedFinding.description}
                    </p>
                  </div>
                )}

                {selectedFinding.recommendation && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Recommendation</h4>
                    <p className="text-gray-700 whitespace-pre-wrap bg-blue-50 p-3 rounded-lg">
                      {selectedFinding.recommendation}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
