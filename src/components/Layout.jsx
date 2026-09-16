import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ScanLine,
  FolderOpen,
  UserCircle,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Settings,
} from 'lucide-react'
import { shortName, useAuth } from '../auth/AuthContext'

const navItems = [
  { path: '/web', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/web/scan', label: 'Scan Document', icon: ScanLine },
  { path: '/web/documents', label: 'Documents', icon: FolderOpen },
  { path: '/web/staff', label: 'Staff Members', icon: UserCircle },
]

const pageTitles = {
  '/web': 'Dashboard',
  '/web/scan': 'Scan Document',
  '/web/documents': 'Documents',
  '/web/staff': 'Staff Members',
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/web/login', { replace: true })
  }

  const pageTitle = pageTitles[location.pathname] || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-da-green transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 pt-6 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* The lockup is green and red, so it needs a light plate on the green sidebar. */}
              <div className="inline-flex flex-shrink-0 bg-white rounded-2xl px-3 py-2.5 shadow-lg shadow-black/20 ring-1 ring-black/5">
                <img src="/Logos/da-logo.svg" alt="Direct Axis" className="h-8 w-auto" />
              </div>
              <button
                className="ml-auto -mr-1 flex-shrink-0 lg:hidden text-gray-300 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/web'}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-white/10">
            <NavLink
              to="/web/settings"
              className="sidebar-link"
              onClick={() => setSidebarOpen(false)}
            >
              <Settings size={20} />
              Settings
            </NavLink>
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-red-300 hover:text-red-200 hover:bg-red-500/10"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-semibold text-da-black">{pageTitle}</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none ml-2 text-sm w-48"
                />
              </div>

              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="relative">
                <button
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1.5"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="w-8 h-8 bg-da-green rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">{user.avatar}</span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {shortName(user)}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <UserCircle size={16} />
                        My Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Settings size={16} />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-da-bg">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
