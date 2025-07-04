import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { createCustomTheme } from '../theme'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'

export const Login: React.FC = () => {
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (error) {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  // Forzar tema dark
  const darkTheme = createCustomTheme('dark')

  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="dark min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden" style={{ overflow: "hidden" }}>
        {/* Fondo gradiente decorativo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 w-full h-full z-0"
          style={{
            background: `linear-gradient(0deg, #FFCF06, #000 75%, #000000)`,
            filter: `blur(100px)`,
            overflow: `hidden`,
          }}
        />
        {/* Capa para oscurecer el fondo y mejorar legibilidad */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="max-w-md w-full space-y-8 z-20 relative">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6 pb-8">
              <img 
                src="/assets/LOGO_VERTICAL_YELLOW.png"
                alt="De Compas" 
                className="h-48 w-auto"
              />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-dark-text-primary">
              Panel Administrativo
            </h2>
            <p className="mt-2 text-center text-sm text-dark-text-secondary">
              Iniciar Sesión
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border dark:border-dark-border-primary placeholder-dark-text-muted text-dark-text-primary bg-dark-bg-card rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border dark:border-dark-border-primary placeholder-dark-text-muted text-dark-text-primary bg-dark-bg-card rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brand-black bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MuiThemeProvider>
  )
} 