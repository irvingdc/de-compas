import React from 'react'
import { Typography, Box } from '@mui/material'
import { Route } from '../../types/route'
import { ReusableDialog, ActionButton } from '../common'

interface RouteDialogProps {
  open: boolean
  route: Route | null
  onClose: () => void
}

export const RouteDialog: React.FC<RouteDialogProps> = ({
  open,
  route,
  onClose,
}) => {
  if (!route) return null

  return (
    <ReusableDialog
      open={open}
      onClose={onClose}
      title={`Detalles de la Ruta - ${route.name}`}
      actions={
        <ActionButton onClick={onClose}>
          Cerrar
        </ActionButton>
      }
    >
      <Box className="space-y-4">
        <Box>
          <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-2">
            Información General
          </Typography>
          <Box className="space-y-2">
            <Typography><strong>Nombre:</strong> {route.name}</Typography>
            <Typography><strong>Origen:</strong> {route.origin.name}, {route.origin.city}</Typography>
            <Typography><strong>Destino:</strong> {route.destination.name}, {route.destination.city}</Typography>
            <Typography><strong>Distancia:</strong> {route.distance} km</Typography>
            <Typography><strong>Duración:</strong> {route.duration}</Typography>
            <Typography><strong>Precio:</strong> ${route.price}</Typography>
          </Box>
        </Box>
        
        {route.description && (
          <Box>
            <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-2">
              Descripción
            </Typography>
            <Typography variant="body2">
              {route.description}
            </Typography>
          </Box>
        )}
      </Box>
    </ReusableDialog>
  )
} 