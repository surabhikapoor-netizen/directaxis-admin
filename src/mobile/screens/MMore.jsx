import { useNavigate } from 'react-router-dom'
import {
  FileText,
  UserCircle,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Monitor,
} from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'
import { useAuth } from '../../auth/AuthContext'

const groups = [
  {
    title: 'Workspace',
    items: [
      { label: 'Loan Applications', icon: FileText, to: '/app/applications' },
      { label: 'Staff Members', icon: UserCircle, to: '/app/staff' },
      { label: 'Open Web Portal', icon: Monitor, to: '/web' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Notifications', icon: Bell },
      { label: 'Settings', icon: Settings },
      { label: 'Privacy & Security', icon: Shield },
    ],
  },
  {
    title: 'Support',
    items: [{ label: 'Help Centre', icon: HelpCircle }],
  },
]

export default function MMore() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/app/login', { replace: true })
  }

  return (
    <div className="min-h-full bg-da-bg pb-10">
      <ScreenHeader title="More" />

      <div className="px-4 pt-4">
        <div className="m-card p-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-da-green flex items-center justify-center flex-shrink-0">
            <span className="text-white text-base font-semibold">{user.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-[11px] text-gray-500">{user.role}</p>
            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
          </div>
          <ChevronRight size={17} className="text-gray-300" />
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.title} className="px-4 mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2 px-1">
            {group.title}
          </p>
          <div className="m-card divide-y divide-gray-50 overflow-hidden">
            {group.items.map((item) => (
              <button
                key={item.label}
                onClick={() => item.to && navigate(item.to)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50"
              >
                <item.icon size={18} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-800 flex-1">{item.label}</span>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="px-4 mt-5">
        <button
          onClick={handleLogout}
          className="m-card w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-red-50"
        >
          <LogOut size={18} className="text-red-500 flex-shrink-0" />
          <span className="text-sm font-medium text-red-600">Logout</span>
        </button>
      </div>

      <p className="text-center text-[11px] text-gray-400 mt-6">
        Direct Axis Fleet Solutions &middot; v1.0.0
      </p>
    </div>
  )
}
