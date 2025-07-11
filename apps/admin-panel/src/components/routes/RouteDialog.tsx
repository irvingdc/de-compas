import React from 'react'
import { Typography, Box } from '@mui/material'
import { Route } from '../../types/route'
import { ReusableDialog, ActionButton } from '../common'
import { RoutePreview } from './RoutePreview'

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
      maxWidth="lg"
      actions={
        <ActionButton onClick={onClose}>
          Cerrar
        </ActionButton>
      }
    >
      <RoutePreview route={route} showMapTitle={false} />
    </ReusableDialog>
  )
} 