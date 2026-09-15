import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import AuthLayout, { authInput } from './AuthLayout'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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
    navigate(location.state?.from || '/web', { replace: true })
  }

  return (
    <AuthLayout>
      <div className="flex justify-center mb-6">
        <img src="/Logos/da-logo.svg" alt="Direct Axis" className="h-16 w-auto" />
      </div>

      <h1 className="text-3xl font-semibold text-da-black text-center tracking-tight">
        Sign in
      </h1>
      <p className="text-sm text-gray-500 text-center mt-2 mb-8">
        Use your Direct Axis credentials to access the admin portal.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
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

        <div>
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
          className="w-full rounded-full bg-da-green text-white py-3.5 text-sm font-semibold hover:bg-da-green-hover transition-colors mt-5"
        >
          Sign in
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&rsquo;t have an account?{' '}
        <Link to="/web/register" className="text-da-green font-medium hover:underline">
          Create one
        </Link>
      </p>

      <p className="text-center text-xs text-gray-400 mt-8">
        Direct Axis Fleet Solutions &middot; Admin Portal
      </p>
    </AuthLayout>
  )
}
