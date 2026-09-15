// Horizontally scrolling status filters — the mobile stand-in for the web dropdown.
export default function FilterChips({ options, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3">
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              isActive
                ? 'bg-da-green text-white border-da-green'
                : 'bg-white text-gray-600 border-gray-200 active:bg-gray-50'
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={isActive ? 'text-white/70 ml-1' : 'text-gray-400 ml-1'}>
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
