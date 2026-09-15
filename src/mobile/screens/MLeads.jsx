import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus,
  Send,
  Clock,
  AlertCircle,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  ChevronRight,
  FileText,
  UserPlus,
} from 'lucide-react'
import { leads, leadStatusMap } from '../../data/mockData'
import ScreenHeader from '../components/ScreenHeader'
import FilterChips from '../components/FilterChips'
import Sheet from '../components/Sheet'

const statusIcon = {
  link_sent: Send,
  otp_sent: Clock,
  documents_pending: AlertCircle,
  documents_complete: CheckCircle2,
  application_submitted: CheckCircle2,
}

export default function MLeads() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [allLeads, setAllLeads] = useState(leads)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedLead, setSelectedLead] = useState(null)
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [registered, setRegistered] = useState(false)

  const showRegister = searchParams.get('new') === '1'

  const openRegister = () => setSearchParams({ new: '1' })

  const closeRegister = () => {
    setSearchParams({})
    setFormData({ companyName: '', contactPerson: '', email: '', phone: '' })
    setFormErrors({})
    setRegistered(false)
  }

  const filtered = allLeads.filter((lead) => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus
    const query = search.toLowerCase()
    const matchesSearch =
      lead.companyName.toLowerCase().includes(query) ||
      lead.contactPerson.toLowerCase().includes(query) ||
      lead.id.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  const handleRegister = () => {
    const errors = {}
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required'
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format'
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    setFormErrors(errors)
    if (Object.keys(errors).length) return

    setAllLeads([
      {
        id: `LEAD-${String(allLeads.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'link_sent',
        registeredBy: 'Thandiwe N.',
        registeredDate: '2026-09-15',
        otpVerified: false,
        applicationProgress: 5,
        documentsUploaded: 0,
        documentsRequired: 5,
      },
      ...allLeads,
    ])
    setRegistered(true)
  }

  const chipOptions = [
    { value: 'all', label: 'All', count: allLeads.length },
    ...Object.entries(leadStatusMap).map(([key, status]) => ({
      value: key,
      label: status.label,
      count: allLeads.filter((l) => l.status === key).length,
    })),
  ]

  return (
    <div className="min-h-full bg-da-bg">
      <ScreenHeader
        title="Leads"
        subtitle={`${allLeads.length} total leads`}
        search={{ value: search, onChange: setSearch, placeholder: 'Search leads...' }}
        action={
          <button
            onClick={openRegister}
            className="w-10 h-10 rounded-full bg-da-green flex items-center justify-center text-white active:bg-da-green-hover flex-shrink-0"
          >
            <Plus size={20} />
          </button>
        }
      />

      <FilterChips options={chipOptions} value={filterStatus} onChange={setFilterStatus} />

      <div className="px-4 pb-10 space-y-2.5">
        {filtered.map((lead) => {
          const StatusIcon = statusIcon[lead.status]
          const statusInfo = leadStatusMap[lead.status]
          return (
            <button
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="m-card w-full p-4 text-left active:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-da-green-light flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} className="text-da-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {lead.companyName}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {lead.id} &middot; {lead.contactPerson}
                  </p>
                </div>
                <ChevronRight size={17} className="text-gray-300 flex-shrink-0 mt-1" />
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.color}`}
                >
                  <StatusIcon size={10} />
                  {statusInfo.label}
                </span>
                <span className="text-[10px] text-gray-400 ml-auto">
                  {lead.documentsUploaded}/{lead.documentsRequired} docs
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-da-green h-1.5 rounded-full"
                    style={{ width: `${lead.applicationProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-gray-500">
                  {lead.applicationProgress}%
                </span>
              </div>
            </button>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <UserPlus size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No leads found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search or filter</p>
          </div>
        )}
      </div>

      <Sheet open={!!selectedLead} onClose={() => setSelectedLead(null)} title="Lead Progress">
        {selectedLead && (
          <div className="space-y-5 pb-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{selectedLead.companyName}</h4>
              <p className="text-xs text-gray-400">{selectedLead.id}</p>
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                  leadStatusMap[selectedLead.status].color
                }`}
              >
                {leadStatusMap[selectedLead.status].label}
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Application Progress</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-da-green h-2.5 rounded-full"
                    style={{ width: `${selectedLead.applicationProgress}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-da-green">
                  {selectedLead.applicationProgress}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {[
                ['Contact Person', selectedLead.contactPerson],
                ['Email', selectedLead.email],
                ['Phone', selectedLead.phone],
                ['OTP Verified', selectedLead.otpVerified ? 'Yes' : 'Pending'],
                ['Registered By', selectedLead.registeredBy],
                ['Registered Date', selectedLead.registeredDate],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
                    {label}
                  </p>
                  <p className="text-xs font-medium text-gray-800 break-words">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="text-center flex-1">
                <p className="text-xl font-bold text-da-green">
                  {selectedLead.documentsUploaded}
                </p>
                <p className="text-[10px] text-gray-500">Uploaded</p>
              </div>
              <span className="text-gray-300">/</span>
              <div className="text-center flex-1">
                <p className="text-xl font-bold text-gray-800">
                  {selectedLead.documentsRequired}
                </p>
                <p className="text-[10px] text-gray-500">Required</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <button className="m-btn">
                <FileText size={17} />
                Request Additional Documents
              </button>
              <button className="m-btn-ghost">
                <Send size={17} />
                Resend Link
              </button>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet open={showRegister} onClose={closeRegister} title="Register New Lead" full>
        {registered ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={30} className="text-da-green" />
            </div>
            <h4 className="text-base font-semibold text-gray-800">Lead registered</h4>
            <p className="text-xs text-gray-500 mt-1.5">
              A link has been sent to {formData.contactPerson}
            </p>
            <p className="text-xs text-gray-400">at {formData.companyName}</p>
            <button onClick={closeRegister} className="m-btn mt-6">
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {[
              { key: 'companyName', label: 'Company Name', icon: Building2, placeholder: 'Enter company name' },
              { key: 'contactPerson', label: 'Contact Person', icon: User, placeholder: 'Enter person name' },
              { key: 'email', label: 'Email', icon: Mail, placeholder: 'email@company.co.za', type: 'email' },
              { key: 'phone', label: 'Cell Phone', icon: Phone, placeholder: '+27 XX XXX XXXX', type: 'tel' },
            ].map((field) => (
              <div key={field.key}>
                <label className="m-label flex items-center gap-1.5">
                  <field.icon size={13} />
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={field.type || 'text'}
                  value={formData[field.key]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className={`m-input ${formErrors[field.key] ? 'border-red-400 focus:ring-red-200' : ''}`}
                />
                {formErrors[field.key] && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors[field.key]}</p>
                )}
              </div>
            ))}

            <button onClick={handleRegister} className="m-btn mt-2">
              <Send size={16} />
              Register &amp; Send Link
            </button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
