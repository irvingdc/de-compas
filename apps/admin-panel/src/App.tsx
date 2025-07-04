import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { createCustomTheme } from './theme'
import { useTheme } from './contexts/ThemeContext'
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

// Componente interno que usa el tema
const AppContent = () => {
  const { mode } = useTheme()
  const theme = createCustomTheme(mode)

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
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
    </MuiThemeProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App 