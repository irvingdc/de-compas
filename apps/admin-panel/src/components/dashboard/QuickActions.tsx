import React from 'react'
import { Box, Typography, Card, Button } from '@mui/material'

export const QuickActions: React.FC = () => {
  return (
    <Card>
      <Box className="px-6 py-4 border-b border-divider">
        <Typography variant="h6" component="h3" className="text-brand-black dark:text-dark-text-primary">
          Acciones Rápidas
        </Typography>
      </Box>
      <Box className="p-6 space-y-4">
        <Button 
          variant="contained" 
          fullWidth 
          className="bg-brand-yellow text-brand-black hover:bg-brand-yellow/90"
        >
          Crear Nueva Ruta
        </Button>
        <Button 
          variant="contained" 
          fullWidth 
          className="bg-secondary-800 text-white hover:bg-secondary-900"
        >
          Revisar Conductores Pendientes
        </Button>
        <Button 
          variant="outlined" 
          fullWidth 
          className="border-neutral-300 text-secondary-800 hover:bg-neutral-50 dark:border-dark-border-primary dark:text-dark-text-primary dark:hover:bg-dark-bg-hover"
        >
          Generar Reporte Mensual
        </Button>
      </Box>
    </Card>
  )
} 