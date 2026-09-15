import { Navigate, Route, Routes } from 'react-router-dom'
import VariantSwitcher from './components/VariantSwitcher'
import { AuthProvider } from './auth/AuthContext'
import RequireAuth from './auth/RequireAuth'

// DA Admin Portal - Web
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ScanDocument from './pages/ScanDocument'
import Applications from './pages/Applications'
import Documents from './pages/Documents'
import Leads from './pages/Leads'
import Staff from './pages/Staff'

// DA Admin Portal - App
import MobileShell from './mobile/MobileShell'
import MLogin from './mobile/screens/MLogin'
import MRegister from './mobile/screens/MRegister'
import MHome from './mobile/screens/MHome'
import MScan from './mobile/screens/MScan'
import MLeads from './mobile/screens/MLeads'
import MDocuments from './mobile/screens/MDocuments'
import MApplications from './mobile/screens/MApplications'
import MStaff from './mobile/screens/MStaff'
import MMore from './mobile/screens/MMore'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/web" replace />} />

        <Route path="/web/login" element={<Login />} />
        <Route path="/web/register" element={<Register />} />
        <Route path="/web" element={<RequireAuth loginPath="/web/login" />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="scan" element={<ScanDocument />} />
            <Route path="applications" element={<Applications />} />
            <Route path="documents" element={<Documents />} />
            <Route path="leads" element={<Leads />} />
            <Route path="staff" element={<Staff />} />
          </Route>
        </Route>

        <Route path="/app" element={<MobileShell />}>
          <Route path="login" element={<MLogin />} />
          <Route path="register" element={<MRegister />} />
          <Route element={<RequireAuth loginPath="/app/login" />}>
            <Route index element={<MHome />} />
            <Route path="scan" element={<MScan />} />
            <Route path="leads" element={<MLeads />} />
            <Route path="documents" element={<MDocuments />} />
            <Route path="applications" element={<MApplications />} />
            <Route path="staff" element={<MStaff />} />
            <Route path="more" element={<MMore />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/web" replace />} />
      </Routes>

      <VariantSwitcher />
    </AuthProvider>
  )
}
