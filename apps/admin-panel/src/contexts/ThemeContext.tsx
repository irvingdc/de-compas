import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    // Cargar tema desde localStorage o detectar preferencia del sistema
    const savedTheme = localStorage.getItem('decompas-theme') as ThemeMode
    if (savedTheme) {
      setMode(savedTheme)
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setMode(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    // Aplicar clase al HTML para Tailwind CSS
    const html = document.documentElement
    if (mode === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    // Guardar en localStorage
    localStorage.setItem('decompas-theme', mode)
  }, [mode])

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')
  }

  const value: ThemeContextType = {
    mode,
    toggleTheme,
    isDark: mode === 'dark',
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 