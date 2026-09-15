import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  ScanLine,
  Download,
  Eye,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'
import { documents, docStatusMap } from '../../data/mockData'
import ScreenHeader from '../components/ScreenHeader'
import FilterChips from '../components/FilterChips'
import Sheet from '../components/Sheet'

const statusIcon = {
  extracted: CheckCircle2,
  processing: Clock,
  failed: XCircle,
  pending: Clock,
}

export default function MDocuments() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDoc, setSelectedDoc] = useState(null)

  const filtered = documents.filter((doc) => {
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    const query = search.toLowerCase()
    const matchesSearch =
      doc.fileName.toLowerCase().includes(query) ||
      doc.company.toLowerCase().includes(query) ||
      doc.type.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  const chipOptions = [
    { value: 'all', label: 'All', count: documents.length },
    ...Object.entries(docStatusMap).map(([key, status]) => ({
      value: key,
      label: status.label,
      count: documents.filter((d) => d.status === key).length,
    })),
  ]

  return (
    <div className="min-h-full bg-da-bg">
      <ScreenHeader
        title="Documents"
        subtitle={`${documents.length} documents`}
        search={{ value: search, onChange: setSearch, placeholder: 'Search documents...' }}
        action={
          <button
            onClick={() => navigate('/app/scan')}
            className="w-10 h-10 rounded-full bg-da-green flex items-center justify-center text-white active:bg-da-green-hover flex-shrink-0"
          >
            <ScanLine size={19} />
          </button>
        }
      />

      <FilterChips options={chipOptions} value={filterStatus} onChange={setFilterStatus} />

      <div className="px-4 pb-10 space-y-2.5">
        {filtered.map((doc) => {
          const StatusIcon = statusIcon[doc.status]
          const statusInfo = docStatusMap[doc.status]
          return (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="m-card w-full p-4 flex items-start gap-3 text-left active:bg-gray-50"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{doc.fileName}</p>
                <p className="text-[11px] text-gray-400 truncate">
                  {doc.company} &middot; {doc.fileSize}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.color}`}
                  >
                    <StatusIcon size={10} />
                    {statusInfo.label}
                  </span>
                  {doc.confidenceScore && (
                    <span className="text-[10px] font-semibold text-da-green">
                      {doc.confidenceScore}%
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={17} className="text-gray-300 flex-shrink-0 mt-1" />
            </button>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No documents found</p>
          </div>
        )}
      </div>

      <Sheet open={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Document Details">
        {selectedDoc && (
          <div className="space-y-5 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FileText size={22} className="text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 break-all">
                  {selectedDoc.fileName}
                </p>
                <p className="text-[11px] text-gray-400">
                  {selectedDoc.type} &middot; {selectedDoc.fileSize}
                </p>
              </div>
            </div>

            {selectedDoc.confidenceScore && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Confidence Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-da-green h-2.5 rounded-full"
                      style={{ width: `${selectedDoc.confidenceScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-da-green">
                    {selectedDoc.confidenceScore}%
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {[
                ['Document ID', selectedDoc.id],
                ['Linked Lead', selectedDoc.leadId],
                ['Company', selectedDoc.company],
                ['Upload Date', selectedDoc.uploadDate],
                ['Status', docStatusMap[selectedDoc.status].label],
                ['File Size', selectedDoc.fileSize],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
                    {label}
                  </p>
                  <p className="text-xs font-medium text-gray-800 break-words">{value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              <button className="m-btn">
                <Eye size={17} />
                View Document
              </button>
              <button className="m-btn-ghost">
                <Download size={17} />
                Download
              </button>
              <button className="w-full flex items-center justify-center gap-2 text-red-600 rounded-xl py-3.5 text-sm font-semibold active:bg-red-50">
                <Trash2 size={17} />
                Delete
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
