import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Sends signed-out visitors to their variant's login, remembering where they
// were headed so sign-in can drop them back there.
export default function RequireAuth({ loginPath }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
