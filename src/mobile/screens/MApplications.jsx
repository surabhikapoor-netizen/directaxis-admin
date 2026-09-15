import { useState } from 'react'
import { Building2, ChevronRight, Truck, FileText, CheckCircle2, XCircle } from 'lucide-react'
import { applications, appStatusMap } from '../../data/mockData'
import ScreenHeader from '../components/ScreenHeader'
import FilterChips from '../components/FilterChips'
import Sheet from '../components/Sheet'

const docStatusTone = {
  complete: 'text-da-green',
  partial: 'text-yellow-600',
  incomplete: 'text-red-500',
}

export default function MApplications() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedApp, setSelectedApp] = useState(null)

  const filtered = applications.filter((app) => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    const query = search.toLowerCase()
    const matchesSearch =
      app.companyName.toLowerCase().includes(query) ||
      app.contactPerson.toLowerCase().includes(query) ||
      app.id.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  const chipOptions = [
    { value: 'all', label: 'All', count: applications.length },
    ...Object.entries(appStatusMap).map(([key, status]) => ({
      value: key,
      label: status.label,
      count: applications.filter((a) => a.status === key).length,
    })),
  ]

  return (
    <div className="min-h-full bg-da-bg">
      <ScreenHeader
        title="Applications"
        subtitle={`${applications.length} loan applications`}
        back
        search={{ value: search, onChange: setSearch, placeholder: 'Search applications...' }}
      />

      <FilterChips options={chipOptions} value={filterStatus} onChange={setFilterStatus} />

      <div className="px-4 pb-10 space-y-2.5">
        {filtered.map((app) => {
          const statusInfo = appStatusMap[app.status]
          return (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className="m-card w-full p-4 text-left active:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-da-green-light flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} className="text-da-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{app.companyName}</p>
                  <p className="text-[11px] text-gray-400">
                    {app.id} &middot; {app.contactPerson}
                  </p>
                </div>
                <ChevronRight size={17} className="text-gray-300 flex-shrink-0 mt-1" />
              </div>

              <div className="flex items-end justify-between mt-3">
                <div>
                  <p className="text-base font-bold text-da-black leading-none">{app.loanAmount}</p>
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Truck size={11} />
                    {app.vehicleCount} vehicles
                  </p>
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>
            </button>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No applications found</p>
          </div>
        )}
      </div>

      <Sheet open={!!selectedApp} onClose={() => setSelectedApp(null)} title="Application Details">
        {selectedApp && (
          <div className="space-y-5 pb-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{selectedApp.companyName}</h4>
              <p className="text-xs text-gray-400">{selectedApp.id}</p>
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                  appStatusMap[selectedApp.status].color
                }`}
              >
                {appStatusMap[selectedApp.status].label}
              </span>
            </div>

            <div className="bg-da-deep-blue rounded-2xl p-4 text-white">
              <p className="text-[11px] text-gray-300">Requested Amount</p>
              <p className="text-2xl font-bold mt-0.5">{selectedApp.loanAmount}</p>
              <p className="text-[11px] text-gray-300 mt-2 flex items-center gap-1.5">
                <Truck size={12} />
                {selectedApp.vehicleCount} vehicles in scope
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {[
                ['Contact Person', selectedApp.contactPerson],
                ['Submitted', selectedApp.submittedDate],
                ['Last Updated', selectedApp.lastUpdated],
                ['Documents', selectedApp.documentsStatus],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
                    {label}
                  </p>
                  <p
                    className={`text-xs font-medium capitalize ${
                      label === 'Documents'
                        ? docStatusTone[selectedApp.documentsStatus]
                        : 'text-gray-800'
                    }`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              <button className="m-btn">
                <CheckCircle2 size={17} />
                Approve Application
              </button>
              <button className="m-btn-ghost">
                <FileText size={17} />
                Request Documents
              </button>
              <button className="w-full flex items-center justify-center gap-2 text-red-600 rounded-xl py-3.5 text-sm font-semibold active:bg-red-50">
                <XCircle size={17} />
                Reject
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
