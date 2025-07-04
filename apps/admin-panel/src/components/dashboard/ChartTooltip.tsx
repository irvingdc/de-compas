import React from 'react'
import { Box, Typography } from '@mui/material'

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  statName: string
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label, statName }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const formattedValue = statName === 'Ingresos del Mes' 
      ? `$${value.toLocaleString()}`
      : value.toLocaleString()
    
    // Mostrar nombres más descriptivos para las métricas diarias
    let displayName = statName
    if (statName === 'Ingresos del Mes') {
      displayName = 'Ingresos del día'
    } else if (statName === 'Viajes Hoy') {
      displayName = 'Viajes del día'
    }
    
    // Usar la fecha del label que viene directamente de los datos generados
    const actualDate = new Date(label || '')
    
    return (
      <Box className="bg-white dark:bg-dark-bg-secondary border border-divider rounded-lg shadow-lg p-3">
        <Typography variant="body2" className="text-brand-black dark:text-dark-text-primary font-medium">
          {actualDate.toLocaleDateString('es-ES', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </Typography>
        <Typography variant="body2" className="text-secondary-600 dark:text-dark-text-secondary">
          {displayName}: {formattedValue}
        </Typography>
      </Box>
    )
  }
  return null
} 