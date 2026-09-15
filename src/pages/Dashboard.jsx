import { useNavigate } from 'react-router-dom'
import {
  ScanLine,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  Eye,
} from 'lucide-react'
import { dashboardStats, recentScans } from '../data/mockData'

const statusBadge = {
  completed: 'bg-green-100 text-green-700',
  processing: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
}

const statusIcon = {
  completed: CheckCircle2,
  processing: Clock,
  failed: XCircle,
}

export default function Dashboard() {
  const navigate = useNavigate()

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
      title: 'In Progress',
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
          <h1 className="text-2xl font-bold text-toyota-black">Good morning, Sarah</h1>
          <p className="text-gray-500 mt-1">
            Scan and extract information from customer documents quickly and securely.
          </p>
        </div>
        <button
          onClick={() => navigate('/scan')}
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
              if (stat.title === 'New Scans') navigate('/scan')
              else navigate('/documents')
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-toyota-black mt-1">{stat.count}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon size={22} className={stat.color.split(' ')[1]} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center text-sm text-toyota-green font-medium">
              View details
              <ChevronRight size={16} className="ml-1" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-toyota-black">Recent Scans</h3>
            <button
              onClick={() => navigate('/documents')}
              className="text-sm text-toyota-green font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Company
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Score
                  </th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentScans.slice(0, 5).map((scan) => {
                  const StatusIcon = statusIcon[scan.status]
                  return (
                    <tr key={scan.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText size={16} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                              {scan.fileName}
                            </p>
                            <p className="text-xs text-gray-400">{scan.documentType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600 hidden md:table-cell">
                        {scan.company}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-500 hidden lg:table-cell">
                        {scan.date}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[scan.status]}`}
                        >
                          <StatusIcon size={12} />
                          {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm font-medium hidden md:table-cell">
                        {scan.confidence ? (
                          <span className="text-toyota-green">{scan.confidence}%</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-toyota-black mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/scan')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-toyota-green hover:bg-toyota-green-light transition-all text-left"
            >
              <div className="p-2 bg-toyota-green-light rounded-lg">
                <ScanLine size={20} className="text-toyota-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Scan New Document</p>
                <p className="text-xs text-gray-500">Upload and extract data</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 ml-auto" />
            </button>

            <button
              onClick={() => navigate('/leads')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-toyota-green hover:bg-toyota-green-light transition-all text-left"
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Register New Lead</p>
                <p className="text-xs text-gray-500">Add a new company lead</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 ml-auto" />
            </button>

            <button
              onClick={() => navigate('/applications')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-toyota-green hover:bg-toyota-green-light transition-all text-left"
            >
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">View Applications</p>
                <p className="text-xs text-gray-500">Track loan applications</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 ml-auto" />
            </button>
          </div>

          <div className="mt-6 p-4 bg-toyota-deep-blue rounded-xl text-white">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} />
              <h4 className="font-semibold text-sm">Weekly Summary</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-xs text-gray-300">Docs Processed</p>
              </div>
              <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-xs text-gray-300">Avg. Confidence</p>
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-gray-300">New Leads</p>
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-gray-300">Approved Apps</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
