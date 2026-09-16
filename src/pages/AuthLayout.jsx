// Shared shell for the signed-out screens: one form card centred on a soft grey ground.

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
  return `w-full rounded-full border px-6 py-4 pr-12 text-[15px] outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-da-green/20 ${
    hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
      : 'border-gray-200 focus:border-da-green'
  }`
}

// Accent colour for the corner wash. One place to retune the whole backdrop.
const ACCENT = '30, 94, 75' // da-green #1E5E4B

// Vertical slats, softened into a wash by the mask that fades them out.
const SLATS =
  `repeating-linear-gradient(90deg,` +
  ` rgba(${ACCENT},0.20) 0px, rgba(${ACCENT},0.20) 22px,` +
  ` rgba(${ACCENT},0.07) 22px, rgba(${ACCENT},0.07) 46px)`

// White ground with the colour burning in from one corner: a smooth wash,
// then the slats on top, each faded out by its own radial mask.
function AuthBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white" aria-hidden="true">
      {/* Top-left: the dominant corner. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(105% 85% at 0% 0%, rgba(${ACCENT},0.62) 0%, rgba(${ACCENT},0.26) 30%, rgba(${ACCENT},0.06) 52%, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: SLATS,
          WebkitMaskImage: 'radial-gradient(95% 80% at 0% 0%, #000 0%, rgba(0,0,0,0.75) 28%, transparent 66%)',
          maskImage: 'radial-gradient(95% 80% at 0% 0%, #000 0%, rgba(0,0,0,0.75) 28%, transparent 66%)',
        }}
      />

      {/* Bottom-right: a much fainter echo, so the page is not lopsided. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 45% at 100% 100%, rgba(${ACCENT},0.20) 0%, rgba(${ACCENT},0.05) 40%, transparent 68%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: SLATS,
          opacity: 0.55,
          WebkitMaskImage: 'radial-gradient(48% 38% at 100% 100%, #000 0%, transparent 72%)',
          maskImage: 'radial-gradient(48% 38% at 100% 100%, #000 0%, transparent 72%)',
        }}
      />
    </div>
  )
}

export default function AuthLayout({ header, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuthBackdrop />

      <div className="relative min-h-screen flex items-center px-6 py-12 lg:px-16 xl:px-24">
        {/* Brand mark, centred in the open space beside the card. Below `lg`
            there is no such space, so the card carries the lockup instead. */}
        <div className="hidden lg:flex flex-1 items-center justify-start">
          <img
            src="/Logos/da-logo.svg"
            alt="Direct Axis"
            className="h-44 xl:h-56 w-auto opacity-25"
          />
        </div>

      <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:flex-none">
        {/* One card carries the whole screen: lockup, title, fields, actions
            and the footer line, so the form reads as a single object. */}
        <div className="rounded-[32px] border border-gray-200/90 bg-white px-8 py-12 sm:px-14 sm:py-14 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_12px_24px_-8px_rgba(15,23,42,0.10),0_40px_72px_-28px_rgba(15,23,42,0.40)]">
          {header && <div className="mb-10">{header}</div>}

          {children}
        </div>
      </div>
      </div>
    </div>
  )
}
