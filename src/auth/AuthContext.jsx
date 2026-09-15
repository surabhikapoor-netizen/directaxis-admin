import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { staffMembers } from '../data/mockData'

const STORAGE_KEY = 'da.auth.user'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

// Prototype sign-in: any password is accepted. A known staff email signs you in
// as that person, anything else becomes a generic account for that address.
function resolveUser(email) {
  const match = staffMembers.find(
    (staff) => staff.email.toLowerCase() === email.trim().toLowerCase()
  )
  if (match) {
    return { name: match.name, email: match.email, role: match.role, avatar: match.avatar }
  }

  const localPart = email.trim().split('@')[0].replace(/[._-]+/g, ' ')
  const name = localPart
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  return {
    name: name || 'Direct Axis User',
    email: email.trim(),
    role: 'Staff Member',
    avatar: initialsOf(name || 'Direct Axis'),
  }
}

function initialsOf(name) {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return 'DA'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// "Thandiwe Nkosi" -> "Thandiwe N." for the compact header chip.
export function shortName(user) {
  if (!user) return ''
  const parts = user.name.split(' ').filter(Boolean)
  if (parts.length < 2) return parts[0] || ''
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

export function firstName(user) {
  if (!user) return ''
  return user.name.split(' ')[0]
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const login = useCallback((email) => {
    const nextUser = resolveUser(email)
    setUser(nextUser)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    } catch {
      /* storage unavailable — the session just won't survive a reload */
    }
    return nextUser
  }, [])

  const register = useCallback((name, email) => {
    const nextUser = {
      name: name.trim(),
      email: email.trim(),
      role: 'Staff Member',
      avatar: initialsOf(name.trim()),
    }
    setUser(nextUser)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    } catch {
      /* storage unavailable — the session just won't survive a reload */
    }
    return nextUser
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}
