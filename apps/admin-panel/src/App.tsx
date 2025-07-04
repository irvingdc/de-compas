import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Routes as RoutesPage } from './pages/Routes'
import { Drivers } from './pages/Drivers'
import { Travelers } from './pages/Travelers'
import { Trips } from './pages/Trips'
import { Finance } from './pages/Finance'
import { Settings } from './pages/Settings'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="travelers" element={<Travelers />} />
            <Route path="trips" element={<Trips />} />
            <Route path="finance" element={<Finance />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App 