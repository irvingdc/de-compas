import React from 'react'
import { Box, Typography, Card, CardContent, Divider } from '@mui/material'
import { TermsAndConditionsManager } from '../components/settings'

export const Settings: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          Configuración
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ajustes del sistema y gestión de documentos
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          
          <TermsAndConditionsManager
            type="travelers"
            title="Términos y Condiciones - Viajeros"
            description="Documentos que deben aceptar los usuarios viajeros en la aplicación móvil"
          />
          
          <Divider sx={{ my: 4 }} />
          
          <TermsAndConditionsManager
            type="drivers"
            title="Términos y Condiciones - Conductores"
            description="Documentos que deben aceptar los conductores en la aplicación móvil"
          />
        </CardContent>
      </Card>
    </Box>
  )
} 