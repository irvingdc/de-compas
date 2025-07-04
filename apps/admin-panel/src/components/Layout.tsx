import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { ThemeToggle } from './ThemeToggle'
import { ConfirmationDialog } from './common'
import { 
  Home, 
  Map, 
  Users, 
  UserCheck, 
  Car, 
  DollarSign, 
  Settings, 
  LogOut 
} from 'lucide-react'
import { Tooltip } from '@mui/material'

export const Layout: React.FC = () => {
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const location = useLocation()
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Rutas', href: '/routes', icon: Map },
    { name: 'Conductores', href: '/drivers', icon: UserCheck },
    { name: 'Viajeros', href: '/travelers', icon: Users },
    { name: 'Viajes', href: '/trips', icon: Car },
    { name: 'Finanzas', href: '/finance', icon: DollarSign },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark:bg-dark-bg-primary' : 'bg-neutral-50'}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 shadow-lg border-r ${
        isDark 
          ? 'bg-dark-bg-card border-dark-border-secondary' 
          : 'bg-white border-neutral-200'
      }`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className={`flex h-16 items-center justify-center border-b px-4 ${
            isDark ? 'border-dark-border-secondary' : 'border-neutral-200'
          }`}>
            <img 
              src={isDark ? "/assets/LOGO_HORIZONTAL_YELLOW.png" : "/assets/LOGO_HORIZONTAL_BLACK.png"}
              alt="De Compas" 
              className="h-10 w-auto"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? `${isDark ? 'bg-primary-900 text-primary-400' : 'bg-primary-100 text-primary-700'} border-l-4 border-primary-500`
                      : `${isDark ? 'text-dark-text-secondary hover:bg-dark-bg-hover hover:text-dark-text-primary' : 'text-secondary-700 hover:bg-neutral-100 hover:text-secondary-900'}`
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    isActive 
                      ? `${isDark ? 'text-primary-400' : 'text-primary-600'}` 
                      : `${isDark ? 'text-dark-text-muted' : 'text-secondary-600'}`
                  }`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className={`border-t p-4 ${isDark ? 'border-dark-border-secondary' : 'border-neutral-200'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-brand-black">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDark ? 'text-dark-text-primary' : 'text-brand-black'}`}>{user?.email}</p>
                <p className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-secondary-600'}`}>Administrador</p>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <ThemeToggle />
              <Tooltip title="Cerrar sesión">
                <button
                  onClick={() => setLogoutDialogOpen(true)}
                  className={`p-2 rounded-full transition-colors ${
                    isDark 
                      ? 'text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-bg-hover' 
                      : 'text-secondary-400 hover:text-secondary-500 hover:bg-neutral-100'
                  }`}
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogo de confirmación para cerrar sesión */}
      <ConfirmationDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="¿Cerrar sesión?"
        message="¿Estás seguro de que deseas cerrar tu sesión?"
        confirmText="Cerrar sesión"
        variant="info"
      />

      {/* Main content */}
      <div className="ml-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
} 