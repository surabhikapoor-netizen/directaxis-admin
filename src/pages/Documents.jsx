import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  ScanLine,
  FileText,
  Eye,
  Download,
  MoreVertical,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Filter,
} from 'lucide-react'
import { documents, docStatusMap } from '../data/mockData'

export default function Documents() {
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const filtered = documents.filter((doc) => {
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    const matchesType = filterType === 'all' || doc.type === filterType
    const matchesSearch =
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  const statusIcon = {
    extracted: CheckCircle2,
    processing: Clock,
    failed: XCircle,
    pending: Clock,
  }

  const uniqueTypes = [...new Set(documents.map((d) => d.type))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-da-black">Document Management</h2>
          <p className="text-sm text-gray-500">{documents.length} total documents</p>
        </div>
        <button onClick={() => navigate('/web/scan')} className="btn-primary">
          <ScanLine size={18} />
          Scan New Document
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: documents.length, color: 'bg-blue-50 text-blue-600' },
          {
            label: 'Extracted',
            count: documents.filter((d) => d.status === 'extracted').length,
            color: 'bg-green-50 text-green-600',
          },
          {
            label: 'Processing',
            count: documents.filter((d) => d.status === 'processing').length,
            color: 'bg-yellow-50 text-yellow-600',
          },
          {
            label: 'Failed',
            count: documents.filter((d) => d.status === 'failed').length,
            color: 'bg-red-50 text-red-600',
          },
        ].map((stat) => (
          <div key={stat.label} className="card py-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color.split(' ')[1]}`}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="input-field pr-10 appearance-none cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                className="input-field pr-10 appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="extracted">Extracted</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Company
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Type
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Size
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Confidence
                </th>
                <th className="py-3 px-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((doc) => {
                const StatusIcon = statusIcon[doc.status]
                const statusInfo = docStatusMap[doc.status]
                return (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                            {doc.fileName}
                          </p>
                          <p className="text-xs text-gray-400">{doc.uploadDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-sm text-gray-600 hidden md:table-cell">
                      {doc.company}
                    </td>
                    <td className="py-4 px-3 text-sm text-gray-600 hidden lg:table-cell">
                      {doc.type}
                    </td>
                    <td className="py-4 px-3 text-sm text-gray-500 hidden lg:table-cell">
                      {doc.fileSize}
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-4 px-3 hidden md:table-cell">
                      {doc.confidenceScore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-da-green h-1.5 rounded-full"
                              style={{ width: `${doc.confidenceScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-da-green">
                            {doc.confidenceScore}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedDoc(doc)
                            setShowDetail(true)
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                        >
                          <Eye size={16} />
                        </button>
                        {doc.status === 'failed' && (
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-orange-400 hover:text-orange-600">
                            <RefreshCw size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No documents found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {showDetail && selectedDoc && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDetail(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-da-black">Document Details</h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{selectedDoc.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {selectedDoc.type} &middot; {selectedDoc.fileSize}
                    </p>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    docStatusMap[selectedDoc.status].color
                  }`}
                >
                  {docStatusMap[selectedDoc.status].label}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Document ID
                    </p>
                    <p className="text-sm font-medium text-gray-800">{selectedDoc.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Company
                    </p>
                    <p className="text-sm font-medium text-gray-800">{selectedDoc.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Lead ID
                    </p>
                    <p className="text-sm font-medium text-gray-800">{selectedDoc.leadId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Upload Date
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedDoc.uploadDate}
                    </p>
                  </div>
                  {selectedDoc.confidenceScore && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Confidence Score
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-da-green h-2 rounded-full"
                            style={{ width: `${selectedDoc.confidenceScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-da-green">
                          {selectedDoc.confidenceScore}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                  <button className="btn-primary w-full">
                    <Eye size={16} />
                    View Extracted Data
                  </button>
                  <button className="btn-secondary w-full">
                    <Download size={16} />
                    Download Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
