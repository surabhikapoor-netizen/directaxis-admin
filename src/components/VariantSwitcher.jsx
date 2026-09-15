import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Shield, Monitor, GripHorizontal, Minus, Layers } from 'lucide-react'

const VARIANTS = [
  { id: 'admin-app', label: 'DA Admin Portal - App', icon: Shield, path: '/app' },
  { id: 'admin-web', label: 'DA Admin Portal - Web', icon: Monitor, path: '/web' },
]

const POSITION_KEY = 'da.variantSwitcher.position'
const COLLAPSED_KEY = 'da.variantSwitcher.collapsed'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export default function VariantSwitcher() {
  const navigate = useNavigate()
  const location = useLocation()
  const panelRef = useRef(null)
  const dragState = useRef(null)

  const [position, setPosition] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === 'true'
    } catch {
      return false
    }
  })

  const activeId = location.pathname.startsWith('/app') ? 'admin-app' : 'admin-web'

  // Place the panel: restore the saved spot, otherwise dock it bottom-left.
  useLayoutEffect(() => {
    const el = panelRef.current
    if (!el) return

    const { width, height } = el.getBoundingClientRect()
    let next = null

    try {
      const saved = JSON.parse(localStorage.getItem(POSITION_KEY) || 'null')
      if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') next = saved
    } catch {
      next = null
    }

    // Bottom-right by default: bottom-left would sit over the sidebar's Logout.
    if (!next) {
      next = { x: window.innerWidth - width - 24, y: window.innerHeight - height - 24 }
    }

    setPosition({
      x: clamp(next.x, 8, Math.max(8, window.innerWidth - width - 8)),
      y: clamp(next.y, 8, Math.max(8, window.innerHeight - height - 8)),
    })
  }, [collapsed])

  // Keep the panel on screen when the window is resized.
  useEffect(() => {
    const onResize = () => {
      const el = panelRef.current
      if (!el) return
      const { width, height } = el.getBoundingClientRect()
      setPosition((prev) =>
        prev
          ? {
              x: clamp(prev.x, 8, Math.max(8, window.innerWidth - width - 8)),
              y: clamp(prev.y, 8, Math.max(8, window.innerHeight - height - 8)),
            }
          : prev
      )
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const savePosition = useCallback((pos) => {
    try {
      localStorage.setItem(POSITION_KEY, JSON.stringify(pos))
    } catch {
      /* storage unavailable — position just won't persist */
    }
  }, [])

  const handlePointerDown = (e) => {
    const el = panelRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    dragState.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  const handlePointerMove = (e) => {
    const drag = dragState.current
    if (!drag) return
    e.preventDefault()
    setPosition({
      x: clamp(e.clientX - drag.offsetX, 8, Math.max(8, window.innerWidth - drag.width - 8)),
      y: clamp(e.clientY - drag.offsetY, 8, Math.max(8, window.innerHeight - drag.height - 8)),
    })
  }

  const handlePointerUp = (e) => {
    if (!dragState.current) return
    dragState.current = null
    setDragging(false)
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    setPosition((prev) => {
      if (prev) savePosition(prev)
      return prev
    })
  }

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const style = {
    left: position ? `${position.x}px` : '24px',
    top: position ? `${position.y}px` : 'auto',
    bottom: position ? 'auto' : '24px',
    visibility: position ? 'visible' : 'hidden',
  }

  if (collapsed) {
    return (
      <div
        ref={panelRef}
        style={style}
        className={`fixed z-[9999] select-none ${dragging ? 'cursor-grabbing' : ''}`}
      >
        <button
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={() => {
            if (!dragging) toggleCollapsed()
          }}
          title="Show portal variants"
          className="w-10 h-10 rounded-xl bg-[#1c1c1e] border border-white/10 shadow-2xl shadow-black/50 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/20 transition-colors cursor-grab active:cursor-grabbing touch-none"
        >
          <Layers size={17} />
        </button>
      </div>
    )
  }

  return (
    <div
      ref={panelRef}
      style={style}
      className="fixed z-[9999] w-[212px] select-none rounded-2xl bg-[#1c1c1e] border border-white/10 p-1.5 shadow-2xl shadow-black/60 backdrop-blur"
    >
      <div className="flex items-center justify-between pb-1">
        <span className="w-5" />
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          title="Drag to move"
          className={`flex-1 flex justify-center py-0.5 text-neutral-500 hover:text-neutral-300 transition-colors touch-none ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <GripHorizontal size={15} />
        </div>
        <button
          onClick={toggleCollapsed}
          title="Minimise"
          className="w-5 h-5 rounded flex items-center justify-center text-neutral-600 hover:text-neutral-300 hover:bg-white/5 transition-colors"
        >
          <Minus size={12} />
        </button>
      </div>

      <div className="space-y-0.5">
        {VARIANTS.map((variant) => {
          const isActive = variant.id === activeId
          const Icon = variant.icon

          return (
            <button
              key={variant.id}
              onClick={() => navigate(variant.path)}
              title={variant.label}
              className={`w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-da-green text-white shadow-[0_0_22px_rgba(30,94,75,0.75)]'
                  : 'text-neutral-200 hover:bg-white/5'
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="truncate">{variant.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
