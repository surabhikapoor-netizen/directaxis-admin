import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, Users, ScanLine, FolderOpen, LayoutGrid } from 'lucide-react'

const ChromeContext = createContext(() => {})

// Lets a screen repaint the strip behind the status bar (e.g. the camera view
// goes dark, the form steps go white) instead of being fixed per route.
export function useStatusBarTheme(light, bg) {
  const setChrome = useContext(ChromeContext)
  useEffect(() => {
    setChrome({ light, bg })
    return () => setChrome(null)
  }, [light, bg, setChrome])
}

// Each screen owns the strip behind the status bar, so the clock and icons
// invert to stay readable on dark headers.
const screenChrome = {
  '/app': { light: true, bg: '#1E5E4B' },
  '/app/scan': { light: true, bg: '#1A1A1A' },
}

const defaultChrome = { light: false, bg: '#FFFFFF' }

// Brushed-titanium edge, reused by the frame and the physical buttons.
const TITANIUM =
  'sm:bg-[linear-gradient(145deg,#eaeaef_0%,#a3a3ab_22%,#d9d9df_48%,#8d8d96_74%,#e2e2e7_100%)]'

const SIDE_BUTTONS = [
  { key: 'silent', position: '-left-[5px] top-[118px] w-[5px] h-[32px] rounded-l' },
  { key: 'volume-up', position: '-left-[5px] top-[178px] w-[5px] h-[58px] rounded-l' },
  { key: 'volume-down', position: '-left-[5px] top-[250px] w-[5px] h-[58px] rounded-l' },
  { key: 'power', position: '-right-[5px] top-[212px] w-[5px] h-[92px] rounded-r' },
]

const tabs = [
  { path: '/app', label: 'Home', icon: Home, end: true },
  { path: '/app/leads', label: 'Leads', icon: Users },
  { path: '/app/scan', label: 'Scan', icon: ScanLine, primary: true },
  { path: '/app/documents', label: 'Docs', icon: FolderOpen },
  { path: '/app/more', label: 'More', icon: LayoutGrid },
]

function StatusBar({ light, bg }) {
  const tone = light ? 'text-white' : 'text-da-black'

  return (
    <div
      className="relative z-30 flex items-end justify-between px-8 pt-[18px] pb-2 flex-shrink-0 transition-colors duration-300"
      style={{ backgroundColor: bg }}
    >
      <span className={`text-[15px] font-semibold tracking-tight ${tone}`}>9:41</span>
      <div className={`flex items-center gap-1.5 ${tone}`}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
          <path d="M8 10.5 10.2 8a3.2 3.2 0 0 0-4.4 0L8 10.5Z" />
          <path d="M8 6.2c1.5 0 2.9.6 4 1.6l1.5-1.7A8.2 8.2 0 0 0 8 3.9a8.2 8.2 0 0 0-5.5 2.2L4 7.8a5.9 5.9 0 0 1 4-1.6Z" />
          <path d="M8 1.6c2.4 0 4.6.9 6.3 2.4L15.8 2.3A10.8 10.8 0 0 0 8 0 10.8 10.8 0 0 0 .2 2.3L1.7 4A9.3 9.3 0 0 1 8 1.6Z" />
        </svg>
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="16" height="9" rx="2" fill="currentColor" />
          <path d="M23.5 4.5v4a2.2 2.2 0 0 0 0-4Z" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}

function TabBar() {
  return (
    <nav className="relative z-30 flex-shrink-0 bg-white border-t border-gray-200/80 px-2 pt-2 pb-1">
      <div className="flex items-end justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              tab.primary
                ? 'flex flex-col items-center gap-1 -mt-7 w-16'
                : `flex flex-col items-center gap-1 w-16 py-1 transition-colors ${
                    isActive ? 'text-da-green' : 'text-gray-400'
                  }`
            }
          >
            {({ isActive }) =>
              tab.primary ? (
                <>
                  <span className="w-14 h-14 rounded-full bg-da-green flex items-center justify-center shadow-lg shadow-da-green/35 ring-4 ring-white">
                    <tab.icon size={24} className="text-white" />
                  </span>
                  <span
                    className={`text-[10px] font-medium ${
                      isActive ? 'text-da-green' : 'text-gray-400'
                    }`}
                  >
                    {tab.label}
                  </span>
                </>
              ) : (
                <>
                  <tab.icon size={21} strokeWidth={isActive ? 2.4 : 2} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </>
              )
            }
          </NavLink>
        ))}
      </div>
      <div className="flex justify-center pt-2 pb-1">
        <span className="w-32 h-1 rounded-full bg-da-black/80" />
      </div>
    </nav>
  )
}

export default function MobileShell() {
  const location = useLocation()
  const [override, setOverride] = useState(null)
  const setChrome = useCallback((value) => setOverride(value), [])

  const chrome = override || screenChrome[location.pathname] || defaultChrome
  const hideTabBar = ['/app/scan', '/app/login', '/app/register'].includes(
    location.pathname
  )

  return (
    <ChromeContext.Provider value={setChrome}>
      <div className="min-h-[100dvh] w-full bg-[#0b0b0d] flex items-center justify-center sm:p-10">
        {/* Titanium outer edge */}
        <div className={`relative w-full h-[100dvh] sm:w-[418px] sm:h-[872px] sm:max-h-[calc(100dvh-5rem)] sm:rounded-[3.6rem] sm:p-[3px] sm:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] ${TITANIUM}`}>
          {SIDE_BUTTONS.map((button) => (
            <span
              key={button.key}
              className={`hidden sm:block absolute ${button.position} ${TITANIUM} shadow-sm`}
            />
          ))}

          {/* Black bezel */}
          <div className="relative w-full h-full sm:rounded-[3.45rem] sm:bg-black sm:p-[11px]">
            <div
              className="relative w-full h-full overflow-hidden bg-da-bg flex flex-col sm:rounded-[2.95rem]"
              style={{ backgroundColor: chrome.bg }}
            >
              <div className="hidden sm:flex absolute top-[11px] left-1/2 -translate-x-1/2 w-[126px] h-[35px] bg-black rounded-full z-40 items-center justify-end pr-3.5">
                <span className="w-[10px] h-[10px] rounded-full bg-[#141c2b] ring-1 ring-[#2b3448]" />
              </div>

              <StatusBar light={chrome.light} bg={chrome.bg} />

              <main className="flex-1 overflow-y-auto overscroll-contain bg-da-bg">
                <Outlet />
              </main>

              {!hideTabBar && <TabBar />}

              {/* Sheets and modals portal here so they stay inside the device frame. */}
              <div id="mobile-overlay-root" className="absolute inset-0 z-50 pointer-events-none sm:rounded-[2.95rem] overflow-hidden" />
            </div>
          </div>
        </div>
      </div>
    </ChromeContext.Provider>
  )
}
