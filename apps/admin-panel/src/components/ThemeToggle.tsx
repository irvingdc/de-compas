import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme, isDark } = useTheme()

  return (
    <Tooltip title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      <IconButton
        onClick={toggleTheme}
        className={`p-2 rounded-full transition-all duration-200 ${
          isDark 
            ? 'hover:bg-dark-bg-hover text-dark-text-primary' 
            : 'hover:bg-neutral-100 text-secondary-700'
        }`}
        sx={{
          minWidth: 40,
          minHeight: 40,
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-primary-500" />
        ) : (
          <Moon className="h-5 w-5 text-secondary-600" />
        )}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle 