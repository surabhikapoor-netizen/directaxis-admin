import { useState } from 'react'
import { Mail, Phone, MessageSquare, ChevronRight, Users } from 'lucide-react'
import { staffMembers } from '../../data/mockData'
import ScreenHeader from '../components/ScreenHeader'
import FilterChips from '../components/FilterChips'
import Sheet from '../components/Sheet'

export default function MStaff() {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [selected, setSelected] = useState(null)

  const departments = [...new Set(staffMembers.map((s) => s.department))]

  const filtered = staffMembers.filter((staff) => {
    const matchesDept = department === 'all' || staff.department === department
    const query = search.toLowerCase()
    const matchesSearch =
      staff.name.toLowerCase().includes(query) ||
      staff.role.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query)
    return matchesDept && matchesSearch
  })

  const chipOptions = [
    { value: 'all', label: 'All', count: staffMembers.length },
    ...departments.map((dept) => ({
      value: dept,
      label: dept,
      count: staffMembers.filter((s) => s.department === dept).length,
    })),
  ]

  return (
    <div className="min-h-full bg-da-bg">
      <ScreenHeader
        title="Staff Members"
        subtitle={`${staffMembers.length} team members`}
        back
        search={{ value: search, onChange: setSearch, placeholder: 'Search staff...' }}
      />

      <FilterChips options={chipOptions} value={department} onChange={setDepartment} />

      <div className="px-4 pb-10 space-y-2.5">
        {filtered.map((staff) => (
          <button
            key={staff.id}
            onClick={() => setSelected(staff)}
            className="m-card w-full p-4 flex items-center gap-3 text-left active:bg-gray-50"
          >
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full bg-da-green flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{staff.avatar}</span>
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  staff.status === 'active' ? 'bg-green-500' : 'bg-yellow-400'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{staff.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{staff.role}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] text-gray-500">
                  <span className="font-semibold text-da-black">{staff.leadsManaged}</span> leads
                </span>
                <span className="text-[10px] text-gray-500">
                  <span className="font-semibold text-da-black">{staff.activeApplications}</span>{' '}
                  apps
                </span>
              </div>
            </div>
            <ChevronRight size={17} className="text-gray-300 flex-shrink-0" />
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No staff found</p>
          </div>
        )}
      </div>

      <Sheet open={!!selected} onClose={() => setSelected(null)} title="Staff Profile">
        {selected && (
          <div className="space-y-5 pb-2">
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-20 h-20 rounded-full bg-da-green flex items-center justify-center">
                <span className="text-white text-xl font-semibold">{selected.avatar}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mt-3">{selected.name}</h4>
              <p className="text-xs text-gray-500">{selected.role}</p>
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium mt-2 capitalize ${
                  selected.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {selected.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <p className="text-xl font-bold text-da-black">{selected.leadsManaged}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Leads Managed</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <p className="text-xl font-bold text-da-black">{selected.activeApplications}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Active Apps</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                ['Staff ID', selected.id],
                ['Department', selected.department],
                ['Email', selected.email],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-medium text-gray-800 text-right break-all">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              <button className="m-btn">
                <Mail size={17} />
                Send Email
              </button>
              <div className="flex gap-2.5">
                <button className="m-btn-ghost">
                  <Phone size={17} />
                  Call
                </button>
                <button className="m-btn-ghost">
                  <MessageSquare size={17} />
                  Message
                </button>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
