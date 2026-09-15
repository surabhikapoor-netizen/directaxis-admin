import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Search } from 'lucide-react'

// White title bar used by every list screen, with an optional inline search box.
export default function ScreenHeader({
  title,
  subtitle,
  back = false,
  action = null,
  search = null,
}) {
  const navigate = useNavigate()

  return (
    <div className="bg-white px-5 pt-1 pb-4 sticky top-0 z-20 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-da-black active:bg-gray-100"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-bold text-da-black leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>

      {search && (
        <div className="relative mt-3">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder || 'Search...'}
            className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-da-green/30 placeholder:text-gray-400"
          />
        </div>
      )}
    </div>
  )
}
