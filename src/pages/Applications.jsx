import { useState } from 'react'
import {
  Search,
  Filter,
  Eye,
  MoreVertical,
  ChevronDown,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Mail,
  Download,
} from 'lucide-react'
import { applications, appStatusMap } from '../data/mockData'

export default function Applications() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const filtered = applications.filter((app) => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusIcon = {
    pending_documents: AlertCircle,
    under_review: Clock,
    processing: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
  }

  const openDetail = (app) => {
    setSelectedApp(app)
    setShowDetail(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-da-black">Loan Applications</h2>
          <p className="text-sm text-gray-500">{applications.length} total applications</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, ID, or contact..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="input-field pr-10 appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending_documents">Pending Documents</option>
                <option value="under_review">Under Review</option>
                <option value="processing">Processing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
                  Application
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Loan Amount
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Vehicles
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Documents
                </th>
                <th className="py-3 px-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((app) => {
                const StatusIcon = statusIcon[app.status]
                const statusInfo = appStatusMap[app.status]
                return (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{app.companyName}</p>
                        <p className="text-xs text-gray-400">{app.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-sm text-gray-600 hidden md:table-cell">
                      {app.contactPerson}
                    </td>
                    <td className="py-4 px-3 text-sm font-medium text-gray-800 hidden lg:table-cell">
                      {app.loanAmount}
                    </td>
                    <td className="py-4 px-3 text-sm text-gray-600 hidden lg:table-cell">
                      {app.vehicleCount}
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
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          app.documentsStatus === 'complete'
                            ? 'bg-green-100 text-green-700'
                            : app.documentsStatus === 'partial'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {app.documentsStatus.charAt(0).toUpperCase() +
                          app.documentsStatus.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openDetail(app)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
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
            <p className="text-gray-500 font-medium">No applications found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {showDetail && selectedApp && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDetail(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-da-black">
                  Application Details
                </h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                      appStatusMap[selectedApp.status].color
                    }`}
                  >
                    {appStatusMap[selectedApp.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Application ID
                    </p>
                    <p className="text-sm font-medium text-gray-800">{selectedApp.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Submitted
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedApp.submittedDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Company
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedApp.companyName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Contact
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedApp.contactPerson}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Loan Amount
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedApp.loanAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Vehicle Count
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedApp.vehicleCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Documents
                    </p>
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {selectedApp.documentsStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedApp.lastUpdated}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Actions</h4>
                  <div className="flex flex-col gap-2">
                    <button className="btn-primary w-full">
                      <Mail size={16} />
                      Request Additional Documents
                    </button>
                    <button className="btn-secondary w-full">
                      <Download size={16} />
                      Download Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
