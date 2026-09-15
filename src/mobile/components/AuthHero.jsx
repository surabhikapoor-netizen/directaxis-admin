import { AuroraGreen } from '../../pages/AuthLayout'

// Green header for the app's auth screens, running the same drifting aurora
// as the web sign-in panel.
export default function AuthHero({ title, subtitle }) {
  return (
    <div className="relative bg-da-green px-6 pt-8 pb-28 overflow-hidden flex-shrink-0">
      <AuroraGreen />

      <img
        src="/Logos/da-logo.svg"
        alt="Direct Axis"
        className="relative h-9 w-auto"
        style={{ filter: 'brightness(0) invert(1)' }}
      />

      <h1 className="relative text-white text-4xl font-bold mt-12">{title}</h1>
      <p className="relative text-white/75 text-sm mt-1">{subtitle}</p>
    </div>
  )
}
