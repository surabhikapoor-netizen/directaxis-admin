// Shared shell for the signed-out screens: artwork panel left, form right.
import NotchedPanel from '../components/NotchedPanel'

// Slow-drifting aurora over a deep green base, all from the DA green family.
// Each blob runs its own long, offset loop so the pattern never visibly repeats.
const BLOBS = [
  // Deep shadows first, then restrained highlights on top.
  { className: 'aurora-c', color: '#0c2f26', position: '-bottom-[25%] -left-[10%] w-[85%] h-[85%]', opacity: 0.9, blur: 60 },
  { className: 'aurora-a', color: '#14483a', position: 'top-[45%] -right-[20%] w-[70%] h-[70%]', opacity: 0.85, blur: 65, delay: '-4s' },
  { className: 'aurora-b', color: '#26775a', position: '-top-[15%] -left-[15%] w-[75%] h-[75%]', opacity: 0.7, blur: 65 },
  { className: 'aurora-a', color: '#3da57e', position: 'top-[5%] right-[-5%] w-[55%] h-[55%]', opacity: 0.5, blur: 60, delay: '-7s' },
  { className: 'aurora-b', color: '#7ccfa9', position: 'top-[8%] right-[8%] w-[40%] h-[40%]', opacity: 0.32, blur: 70, delay: '-3s' },
]

// Light-ground version of the aurora, for the app's auth screens. Kept pale so
// the form stays legible on top of it.
const LIGHT_BLOBS = [
  { className: 'aurora-b', color: '#6ec79f', position: '-top-[20%] -left-[25%] w-[85%] h-[55%]', opacity: 0.9, blur: 60 },
  { className: 'aurora-a', color: '#8ad6b6', position: 'top-[18%] -right-[30%] w-[90%] h-[50%]', opacity: 0.9, blur: 65, delay: '-4s' },
  { className: 'aurora-c', color: '#5cbd94', position: '-bottom-[15%] -left-[20%] w-[95%] h-[45%]', opacity: 0.8, blur: 60, delay: '-2s' },
  { className: 'aurora-b', color: '#9cdfc4', position: 'bottom-[10%] -right-[20%] w-[80%] h-[45%]', opacity: 0.9, blur: 55, delay: '-6s' },
]

export function AuroraGreen() {
  return (
    <>
      {BLOBS.map((blob, i) => (
        <span
          key={i}
          className={`absolute rounded-full ${blob.position} ${blob.className}`}
          style={{
            backgroundColor: blob.color,
            opacity: blob.opacity,
            filter: `blur(${blob.blur}px)`,
            animationDelay: blob.delay,
          }}
        />
      ))}
    </>
  )
}

export function AuroraBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Green wash top and bottom, easing through a lighter band in the
          middle so the form still has a calm ground to sit on. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4fb68d] via-[#d3f0e3] to-[#57bd95]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-da-green/30 via-transparent to-da-green/25" />

      {LIGHT_BLOBS.map((blob, i) => (
        <span
          key={i}
          className={`absolute rounded-full ${blob.position} ${blob.className}`}
          style={{
            backgroundColor: blob.color,
            opacity: blob.opacity,
            filter: `blur(${blob.blur}px)`,
            animationDelay: blob.delay,
          }}
        />
      ))}
    </div>
  )
}

export function authInput(hasError) {
  return `w-full rounded-full border px-5 py-3 pr-12 text-sm outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-da-green/20 ${
    hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
      : 'border-gray-200 focus:border-da-green'
  }`
}

export default function AuthLayout({ header, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Inset so the artwork reads as a notched card rather than a hard edge. */}
      <div className="hidden lg:block p-6">
        <NotchedPanel
          className="relative w-full h-full overflow-hidden bg-[#123c31]"
          aria-hidden="true"
        >
          <AuroraGreen />

          {/* Watermark: flattened to white so the green/red lockup doesn't
              muddy against the green ground. */}
          <img
            src="/Logos/da-logo.svg"
            alt=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] opacity-[0.08]"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </NotchedPanel>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          {/* Lockup and page title stand on the background; only the fields and
              the actions below them sit on the card. */}
          {header && <div className="mb-12">{header}</div>}

          <div className="rounded-[28px] border border-gray-200/70 bg-white p-8 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_48px_-28px_rgba(18,60,49,0.35)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
