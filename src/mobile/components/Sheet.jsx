import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// Bottom sheet that renders into the device frame's overlay layer, so it stays
// clipped to the phone screen instead of covering the whole browser window.
export default function Sheet({ open, onClose, title, children, full = false }) {
  const [container, setContainer] = useState(null)

  useEffect(() => {
    setContainer(document.getElementById('mobile-overlay-root'))
  }, [])

  if (!open || !container) return null

  return createPortal(
    <div className="absolute inset-0 pointer-events-auto">
      <div
        className="absolute inset-0 bg-black/40 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />
      <div
        className={`absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl flex flex-col animate-[slideUp_0.28s_cubic-bezier(0.32,0.72,0,1)] ${
          full ? 'top-8' : 'max-h-[85%]'
        }`}
      >
        <div className="flex-shrink-0 pt-3 pb-1 flex justify-center">
          <span className="w-10 h-1 rounded-full bg-gray-300" />
        </div>
        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-base font-semibold text-da-black">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:bg-gray-200"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
      </div>
    </div>,
    container
  )
}
