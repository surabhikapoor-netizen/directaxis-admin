import { useNavigate } from 'react-router-dom'
import {
  ScanLine,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'
import { dashboardStats } from '../data/mockData'
import { firstName, useAuth } from '../auth/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const stats = [
    {
      title: 'New Scans',
      count: dashboardStats.newScans.count,
      subtitle: dashboardStats.newScans.change,
      icon: ScanLine,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Pending',
      count: dashboardStats.inProgress.count,
      subtitle: dashboardStats.inProgress.label,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
      iconBg: 'bg-yellow-100',
    },
    {
      title: 'Completed',
      count: dashboardStats.completed.count,
      subtitle: dashboardStats.completed.change,
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Failed',
      count: dashboardStats.failed.count,
      subtitle: dashboardStats.failed.label,
      icon: XCircle,
      color: 'bg-red-50 text-red-600',
      iconBg: 'bg-red-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-da-black">Good morning, {firstName(user)}</h1>
          <p className="text-gray-500 mt-1">
            Scan and extract information from customer documents quickly and securely.
          </p>
        </div>
        <button
          onClick={() => navigate('/web/scan')}
          className="btn-primary"
        >
          <ScanLine size={18} />
          New Scan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              if (stat.title === 'New Scans') navigate('/web/scan')
              else navigate('/web/documents')
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-da-black mt-1">{stat.count}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon size={22} className={stat.color.split(' ')[1]} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center text-sm text-da-green font-medium">
              View details
              <ChevronRight size={16} className="ml-1" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="card">
          <h3 className="text-lg font-semibold text-da-black mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/web/scan')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-da-green hover:bg-da-green-light transition-all text-left"
            >
              <div className="p-2 bg-da-green-light rounded-lg">
                <ScanLine size={20} className="text-da-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Scan New Document</p>
                <p className="text-xs text-gray-500">Upload and extract data</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 ml-auto" />
            </button>

          </div>
        </div>

        {/* Weekly Summary takes the rest of the row, its figures spread across
            the width rather than stacked in a narrow column. */}
        <div className="lg:col-span-2 p-6 bg-da-deep-blue rounded-xl shadow-sm text-white flex flex-col">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} />
            <h3 className="font-semibold">Weekly Summary</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-5 flex-1 content-center">
            <div>
              <p className="text-3xl font-bold">48</p>
              <p className="text-xs text-gray-300 mt-1">Docs Processed</p>
            </div>
            <div>
              <p className="text-3xl font-bold">95%</p>
              <p className="text-xs text-gray-300 mt-1">Avg. Confidence</p>
            </div>
            <div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-gray-300 mt-1">New Leads</p>
            </div>
            <div>
              <p className="text-3xl font-bold">3</p>
              <p className="text-xs text-gray-300 mt-1">Approved Apps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
