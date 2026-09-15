import { useState } from 'react'
import {
  Search,
  Plus,
  Eye,
  MoreVertical,
  ChevronDown,
  UserPlus,
  Send,
  Mail,
  Phone,
  Building2,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  FileText,
  ChevronRight,
} from 'lucide-react'
import { leads, leadStatusMap } from '../data/mockData'

export default function Leads() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [allLeads, setAllLeads] = useState(leads)
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const filtered = allLeads.filter((lead) => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus
    const matchesSearch =
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusIcon = {
    link_sent: Send,
    otp_sent: Clock,
    documents_pending: AlertCircle,
    documents_complete: CheckCircle2,
    application_submitted: CheckCircle2,
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required'
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format'
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRegister = () => {
    if (!validateForm()) return

    const newLead = {
      id: `LEAD-${String(allLeads.length + 1).padStart(3, '0')}`,
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      status: 'link_sent',
      registeredBy: 'Sarah K.',
      registeredDate: '2026-09-15',
      otpVerified: false,
      applicationProgress: 5,
      documentsUploaded: 0,
      documentsRequired: 5,
    }

    setAllLeads([newLead, ...allLeads])
    setRegistrationSuccess(true)
  }

  const resetForm = () => {
    setFormData({ companyName: '', contactPerson: '', email: '', phone: '' })
    setFormErrors({})
    setRegistrationSuccess(false)
    setShowRegister(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-da-black">Lead Management</h2>
          <p className="text-sm text-gray-500">{allLeads.length} total leads</p>
        </div>
        <button onClick={() => setShowRegister(true)} className="btn-primary">
          <UserPlus size={18} />
          Register New Lead
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {Object.entries(leadStatusMap).map(([key, status]) => (
          <div
            key={key}
            className={`card py-4 cursor-pointer hover:shadow-md transition-shadow ${
              filterStatus === key ? 'ring-2 ring-da-green' : ''
            }`}
            onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
          >
            <p className="text-xs text-gray-500">{status.label}</p>
            <p className="text-2xl font-bold text-da-black mt-1">
              {allLeads.filter((l) => l.status === key).length}
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
              placeholder="Search leads..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="input-field pr-10 appearance-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              {Object.entries(leadStatusMap).map(([key, status]) => (
                <option key={key} value={key}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Progress
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Documents
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Registered
                </th>
                <th className="py-3 px-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((lead) => {
                const StatusIcon = statusIcon[lead.status]
                const statusInfo = leadStatusMap[lead.status]
                return (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{lead.companyName}</p>
                        <p className="text-xs text-gray-400">{lead.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-3 hidden md:table-cell">
                      <div>
                        <p className="text-sm text-gray-700">{lead.contactPerson}</p>
                        <p className="text-xs text-gray-400">{lead.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-4 px-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-da-green h-1.5 rounded-full"
                            style={{ width: `${lead.applicationProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{lead.applicationProgress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-sm text-gray-600 hidden lg:table-cell">
                      {lead.documentsUploaded}/{lead.documentsRequired}
                    </td>
                    <td className="py-4 px-3 text-sm text-gray-500 hidden md:table-cell">
                      {lead.registeredDate}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowDetail(true)
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                        >
                          <Eye size={16} />
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
            <UserPlus size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No leads found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {showRegister && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={resetForm} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-da-black">Register New Lead</h3>
                  <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                    <X size={20} />
                  </button>
                </div>

                {registrationSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-da-green" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Lead Registered Successfully!
                    </h4>
                    <p className="text-gray-500 text-sm mb-2">
                      A link has been sent to the customer.
                    </p>
                    <p className="text-sm text-gray-400 mb-6">
                      {formData.contactPerson} at {formData.companyName}
                    </p>
                    <button onClick={resetForm} className="btn-primary w-full">
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Building2 size={14} className="inline mr-1" />
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`input-field ${formErrors.companyName ? 'border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="Enter company name"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                      />
                      {formErrors.companyName && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.companyName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <User size={14} className="inline mr-1" />
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`input-field ${formErrors.contactPerson ? 'border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="Enter person name"
                        value={formData.contactPerson}
                        onChange={(e) =>
                          setFormData({ ...formData, contactPerson: e.target.value })
                        }
                      />
                      {formErrors.contactPerson && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.contactPerson}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Mail size={14} className="inline mr-1" />
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={`input-field ${formErrors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="email@company.co.za"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Phone size={14} className="inline mr-1" />
                        Cell Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className={`input-field ${formErrors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="+27 XX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <button onClick={handleRegister} className="btn-primary w-full mt-6">
                      <Send size={16} />
                      Register & Send Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {showDetail && selectedLead && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDetail(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-da-black">Lead Progress</h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {selectedLead.companyName}
                  </h4>
                  <p className="text-sm text-gray-500">{selectedLead.id}</p>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    leadStatusMap[selectedLead.status].color
                  }`}
                >
                  {leadStatusMap[selectedLead.status].label}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Application Progress</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-da-green h-3 rounded-full transition-all"
                        style={{ width: `${selectedLead.applicationProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-da-green">
                      {selectedLead.applicationProgress}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Contact Person
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedLead.contactPerson}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-800">{selectedLead.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      OTP Verified
                    </p>
                    <p className="text-sm font-medium">
                      {selectedLead.otpVerified ? (
                        <span className="text-da-green flex items-center gap-1">
                          <CheckCircle2 size={14} /> Yes
                        </span>
                      ) : (
                        <span className="text-yellow-600 flex items-center gap-1">
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Registered By
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedLead.registeredBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Registered Date
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedLead.registeredDate}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">Documents</p>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-da-green">
                        {selectedLead.documentsUploaded}
                      </p>
                      <p className="text-xs text-gray-500">Uploaded</p>
                    </div>
                    <div className="text-gray-300">/</div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {selectedLead.documentsRequired}
                      </p>
                      <p className="text-xs text-gray-500">Required</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                  <button className="btn-primary w-full">
                    <FileText size={16} />
                    Request Additional Documents
                  </button>
                  <button className="btn-secondary w-full">
                    <Send size={16} />
                    Resend Link
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
