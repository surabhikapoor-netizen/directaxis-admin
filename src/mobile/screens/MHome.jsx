import { useNavigate } from 'react-router-dom'
import {
  ScanLine,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  ChevronRight,
  UserPlus,
  TrendingUp,
} from 'lucide-react'
import { dashboardStats } from '../../data/mockData'
import { firstName, useAuth } from '../../auth/AuthContext'

export default function MHome() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const stats = [
    {
      title: 'New Scans',
      count: dashboardStats.newScans.count,
      subtitle: dashboardStats.newScans.change,
      icon: ScanLine,
      tint: 'bg-blue-50 text-blue-600',
      to: '/app/scan',
    },
    {
      title: 'Pending',
      count: dashboardStats.inProgress.count,
      subtitle: dashboardStats.inProgress.label,
      icon: Clock,
      tint: 'bg-yellow-50 text-yellow-600',
      to: '/app/documents',
    },
    {
      title: 'Completed',
      count: dashboardStats.completed.count,
      subtitle: dashboardStats.completed.change,
      icon: CheckCircle2,
      tint: 'bg-green-50 text-green-600',
      to: '/app/documents',
    },
    {
      title: 'Failed',
      count: dashboardStats.failed.count,
      subtitle: dashboardStats.failed.label,
      icon: XCircle,
      tint: 'bg-red-50 text-red-600',
      to: '/app/documents',
    },
  ]

  const quickActions = [
    {
      label: 'Scan Document',
      hint: 'Upload and extract data',
      icon: ScanLine,
      tint: 'bg-da-green-light text-da-green',
      to: '/app/scan',
    },
    {
      label: 'Register New Lead',
      hint: 'Add a new company lead',
      icon: UserPlus,
      tint: 'bg-blue-50 text-blue-600',
      to: '/app/leads?new=1',
    },
    {
      label: 'View Applications',
      hint: 'Track loan applications',
      icon: TrendingUp,
      tint: 'bg-purple-50 text-purple-600',
      to: '/app/applications',
    },
  ]

  return (
    <div className="pb-10">
      {/* Elliptical bottom radius sweeps the hero into the cards below. */}
      <div
        className="bg-da-green px-5 pt-2 pb-20"
        style={{
          borderBottomLeftRadius: '50% 44px',
          borderBottomRightRadius: '50% 44px',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-white rounded-xl px-2.5 py-2">
              <img src="/Logos/da-logo.svg" alt="Direct Axis" className="h-7 w-auto" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20">
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => navigate('/app/more')}
              className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:bg-white/25"
            >
              <span className="text-white text-[11px] font-semibold">{user.avatar}</span>
            </button>
          </div>
        </div>

        <h1 className="text-white text-2xl font-bold mt-5">
          Good morning, {firstName(user)}
        </h1>
        <p className="text-white/70 text-[13px] mt-1 leading-snug">
          Scan and extract customer documents quickly and securely.
        </p>
      </div>

      <div className="px-5 -mt-12">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <button
              key={stat.title}
              onClick={() => navigate(stat.to)}
              className="m-card p-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.tint}`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-da-black mt-2.5 leading-none">{stat.count}</p>
              <p className="text-xs font-medium text-gray-600 mt-1.5">{stat.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate">{stat.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-sm font-semibold text-da-black mb-3">Quick Actions</h2>
        <div className="m-card divide-y divide-gray-100 overflow-hidden">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.to)}
              className="w-full flex items-center gap-3 p-3.5 text-left active:bg-gray-50"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.tint}`}>
                <action.icon size={19} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{action.label}</p>
                <p className="text-[11px] text-gray-500">{action.hint}</p>
              </div>
              <ChevronRight size={17} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-6">
        <div className="bg-da-deep-blue rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={17} />
            <h3 className="font-semibold text-sm">Weekly Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '48', label: 'Docs Processed' },
              { value: '95%', label: 'Avg. Confidence' },
              { value: '12', label: 'New Leads' },
              { value: '3', label: 'Approved Apps' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-bold leading-none">{item.value}</p>
                <p className="text-[11px] text-gray-300 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
