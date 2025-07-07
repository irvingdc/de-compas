import React from 'react'
import { Route } from '../../types/route'
import { ConfirmationDialog } from '../common'

interface StatusConfirmationDialogProps {
  open: boolean
  route: Route | null
  selectedCount: number
  action: 'activate' | 'deactivate'
  onClose: () => void
  onConfirm: () => void
}

export const StatusConfirmationDialog: React.FC<StatusConfirmationDialogProps> = ({
  open,
  route,
  selectedCount,
  action,
  onClose,
  onConfirm,
}) => {
  const isMultiple = selectedCount > 0
  const isActivate = action === 'activate'

  const getTitle = () => {
    if (isMultiple) {
      return isActivate ? 'Activar rutas seleccionadas' : 'Desactivar rutas seleccionadas'
    }
    return isActivate ? 'Activar ruta' : 'Desactivar ruta'
  }

  const getMessage = () => {
    if (isMultiple) {
      return isActivate
        ? `¿Estás seguro de que deseas activar ${selectedCount} rutas seleccionadas? Estas rutas estarán disponibles para reservas.`
        : `¿Estás seguro de que deseas desactivar ${selectedCount} rutas seleccionadas? Estas rutas no estarán disponibles para reservas.`
    }
    
    return isActivate
      ? `¿Estás seguro de que deseas activar la ruta "${route?.name}"? Esta ruta estará disponible para reservas.`
      : `¿Estás seguro de que deseas desactivar la ruta "${route?.name}"? Esta ruta no estará disponible para reservas.`
  }

  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={getTitle()}
      message={getMessage()}
      variant={isActivate ? 'info' : 'warning'}
      confirmText={isActivate ? 'Activar' : 'Desactivar'}
    />
  )
} 