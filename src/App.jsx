import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ScanDocument from './pages/ScanDocument'
import Applications from './pages/Applications'
import Documents from './pages/Documents'
import Leads from './pages/Leads'
import Staff from './pages/Staff'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="scan" element={<ScanDocument />} />
        <Route path="applications" element={<Applications />} />
        <Route path="documents" element={<Documents />} />
        <Route path="leads" element={<Leads />} />
        <Route path="staff" element={<Staff />} />
      </Route>
    </Routes>
  )
}
