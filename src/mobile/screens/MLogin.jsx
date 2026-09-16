import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { useStatusBarTheme } from '../MobileShell'
import AuthHero from '../components/AuthHero'
import { authInput } from '../../pages/AuthLayout'

export default function MLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useStatusBarTheme(true, '#1E5E4B')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextErrors = {}
    if (!email.trim()) nextErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) nextErrors.email = 'Enter a valid email address'
    if (!password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    login(email)
    navigate(location.state?.from || '/app', { replace: true })
  }

  return (
    <div className="min-h-full flex flex-col bg-white">
      <AuthHero
        title="Welcome"
        subtitle="Use your Direct Axis credentials to access the admin portal."
      />

      <form onSubmit={handleSubmit} className="flex-1 bg-white px-6 pt-8 pb-8" noValidate>
        <div>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={authInput(errors.email)}
            />
            <Mail
              size={17}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1.5 ml-5">{errors.email}</p>}
        </div>

        <div className="mt-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={authInput(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1.5 ml-5">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-da-green text-white py-3.5 text-sm font-semibold active:bg-da-green-hover transition-colors mt-5"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&rsquo;t have an account?{' '}
          <Link to="/app/register" className="text-da-green font-medium">
            Create one
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-8">
          Admin Portal
        </p>
      </form>
    </div>
  )
}
