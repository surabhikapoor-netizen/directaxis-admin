import { AuroraGreen } from '../../pages/AuthLayout'

// Green header for the app's auth screens, running the same drifting aurora
// as the web sign-in panel.
export default function AuthHero({ title, subtitle }) {
  return (
    <div className="relative bg-da-green px-6 pt-8 pb-32 overflow-hidden flex-shrink-0">
      <AuroraGreen />

      <img
        src="/Logos/da-logo.svg"
        alt="Direct Axis"
        className="relative h-9 w-auto"
        style={{ filter: 'brightness(0) invert(1)' }}
      />

      <h1 className="relative text-white text-4xl font-bold mt-12">{title}</h1>
      <p className="relative text-white/75 text-sm mt-1">{subtitle}</p>

      {/* Wave that hands the green off to the form below: it sits low on the
          left, dips, then sweeps up towards the right. preserveAspectRatio is
          off so it stretches to any phone width without changing height. */}
      <svg
        className="absolute inset-x-0 bottom-0 w-full h-20 text-white"
        viewBox="0 0 390 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 20C70 52 140 62 205 52 270 42 335 10 390 2V80H0V20Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
