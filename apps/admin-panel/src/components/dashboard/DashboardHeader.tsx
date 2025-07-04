import React from 'react'
import { Box, Typography } from '@mui/material'

export const DashboardHeader: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" className="text-brand-black dark:text-dark-text-primary">
        Dashboard
      </Typography>
      <Typography variant="body1" className="text-secondary-600 dark:text-dark-text-secondary">
        Bienvenido al panel administrativo de De Compas
      </Typography>
    </Box>
  )
} 