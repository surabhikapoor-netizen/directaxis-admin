import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import AuthLayout, { authInput } from './AuthLayout'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Full name is required'
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))
      nextErrors.email = 'Enter a valid email address'
    if (!form.password) nextErrors.password = 'Password is required'
    else if (form.password.length < 8)
      nextErrors.password = 'Use at least 8 characters'
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirm your password'
    else if (form.confirmPassword !== form.password)
      nextErrors.confirmPassword = 'Passwords do not match'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    register(form.name, form.email)
    navigate('/web', { replace: true })
  }

  return (
    <AuthLayout
      header={
        <>
          <div className="flex justify-center mb-6">
            <img src="/Logos/da-logo.svg" alt="Direct Axis" className="h-16 w-auto" />
          </div>

          <h1 className="text-4xl font-semibold text-da-black text-center tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-gray-500 text-center mt-2">
            Set up your access to the Direct Axis admin portal.
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div>
          <div className="relative">
            <input
              type="text"
              value={form.name}
              onChange={update('name')}
              placeholder="Full name"
              className={authInput(errors.name)}
            />
            <User
              size={17}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1.5 ml-5">{errors.name}</p>}
        </div>

        <div>
          <div className="relative">
            <input
              type="email"
              value={form.email}
              onChange={update('email')}
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
              value={form.password}
              onChange={update('password')}
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

        <div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              placeholder="Confirm password"
              className={authInput(errors.confirmPassword)}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1.5 ml-5">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-da-green text-white py-3.5 text-sm font-semibold hover:bg-da-green-hover transition-colors mt-5"
        >
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/web/login" className="text-da-green font-medium hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-gray-400 mt-8">
        Direct Axis Fleet Solutions &middot; Admin Portal
      </p>
    </AuthLayout>
  )
}
