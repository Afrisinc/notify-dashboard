import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SsoCallbackPage from './pages/SsoCallbackPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Clients from './pages/admin/Clients'
import Notifications from './pages/admin/Notifications'
import Templates from './pages/admin/Templates'
import Analytics from './pages/admin/Analytics'
import Settings from './pages/admin/Settings'
import Support from './pages/admin/Support'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sso/callback" element={<SsoCallbackPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="templates" element={<Templates />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
