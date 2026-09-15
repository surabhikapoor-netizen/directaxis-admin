import { useState } from 'react'
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  MoreVertical,
  X,
  Users,
  FileText,
  Building2,
  Eye,
} from 'lucide-react'
import { staffMembers } from '../data/mockData'

export default function Staff() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Fleet Sales',
  })
  const [allStaff, setAllStaff] = useState(staffMembers)

  const departments = [...new Set(staffMembers.map((s) => s.department))]

  const filtered = allStaff.filter((staff) => {
    const matchesDept =
      filterDepartment === 'all' || staff.department === filterDepartment
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDept && matchesSearch
  })

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) return

    const initials = newMember.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    setAllStaff([
      ...allStaff,
      {
        id: `STAFF-${String(allStaff.length + 1).padStart(3, '0')}`,
        ...newMember,
        leadsManaged: 0,
        activeApplications: 0,
        status: 'active',
        avatar: initials,
      },
    ])
    setNewMember({ name: '', email: '', role: '', department: 'Fleet Sales' })
    setShowAddMember(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-da-black">Staff Members</h2>
          <p className="text-sm text-gray-500">{allStaff.length} team members</p>
        </div>
        <button onClick={() => setShowAddMember(true)} className="btn-primary">
          <UserPlus size={18} />
          Add Staff Member
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="input-field max-w-xs"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((staff) => (
          <div key={staff.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-da-deep-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{staff.avatar}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{staff.name}</h4>
                  <p className="text-xs text-gray-500">{staff.role}</p>
                </div>
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full mt-1 ${
                  staff.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Building2 size={14} />
                {staff.department}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Mail size={14} />
                <span className="truncate">{staff.email}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-da-black">{staff.leadsManaged}</p>
                <p className="text-xs text-gray-500">Leads</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-da-black">{staff.activeApplications}</p>
                <p className="text-xs text-gray-500">Active Apps</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedStaff(staff)
                setShowDetail(true)
              }}
              className="btn-secondary w-full mt-4 text-sm"
            >
              <Eye size={14} />
              View Profile
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-12">
          <Users size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No staff members found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {showAddMember && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowAddMember(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-da-black">Add Staff Member</h3>
                  <button
                    onClick={() => setShowAddMember(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter full name"
                      value={newMember.name}
                      onChange={(e) =>
                        setNewMember({ ...newMember, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="name@directaxis.co.za"
                      value={newMember.email}
                      onChange={(e) =>
                        setNewMember({ ...newMember, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Sales Consultant"
                      value={newMember.role}
                      onChange={(e) =>
                        setNewMember({ ...newMember, role: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      className="input-field"
                      value={newMember.department}
                      onChange={(e) =>
                        setNewMember({ ...newMember, department: e.target.value })
                      }
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAddMember}
                    className="btn-primary w-full mt-4"
                    disabled={!newMember.name || !newMember.email || !newMember.role}
                  >
                    <UserPlus size={16} />
                    Add Member
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showDetail && selectedStaff && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDetail(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-da-black">Staff Profile</h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-da-deep-blue rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">
                      {selectedStaff.avatar}
                    </span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {selectedStaff.name}
                  </h4>
                  <p className="text-gray-500">{selectedStaff.role}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                      selectedStaff.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {selectedStaff.status === 'active' ? 'Active' : 'Away'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedStaff.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Department
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedStaff.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Staff ID
                    </p>
                    <p className="text-sm font-medium text-gray-800">{selectedStaff.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-da-black">
                      {selectedStaff.leadsManaged}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Leads Managed</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-da-black">
                      {selectedStaff.activeApplications}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Active Applications</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                  <button className="btn-primary w-full">
                    <Mail size={16} />
                    Send Email
                  </button>
                  <button className="btn-secondary w-full">
                    <FileText size={16} />
                    View Assigned Leads
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
