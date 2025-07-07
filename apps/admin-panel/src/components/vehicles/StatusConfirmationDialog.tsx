import React from 'react'
import { Vehicle } from '../../types/vehicle'
import { ConfirmationDialog } from '../common'

interface StatusConfirmationDialogProps {
  open: boolean
  vehicle: Vehicle | null
  selectedCount: number
  action: 'activate' | 'deactivate'
  onClose: () => void
  onConfirm: () => void
}

export const StatusConfirmationDialog: React.FC<StatusConfirmationDialogProps> = ({
  open,
  vehicle,
  selectedCount,
  action,
  onClose,
  onConfirm,
}) => {
  const isMultiple = selectedCount > 0
  const isActivate = action === 'activate'

  const getTitle = () => {
    if (isMultiple) {
      return isActivate ? 'Activar vehículos seleccionados' : 'Desactivar vehículos seleccionados'
    }
    return isActivate ? 'Activar vehículo' : 'Desactivar vehículo'
  }

  const getMessage = () => {
    if (isMultiple) {
      return isActivate
        ? `¿Estás seguro de que deseas activar ${selectedCount} vehículos seleccionados? Estos vehículos estarán disponibles para que los conductores los seleccionen al registrarse.`
        : `¿Estás seguro de que deseas desactivar ${selectedCount} vehículos seleccionados? Estos vehículos no estarán disponibles para que los conductores los seleccionen.`
    }
    
    return isActivate
      ? `¿Estás seguro de que deseas activar el vehículo "${vehicle?.brand} ${vehicle?.model}"? Este vehículo estará disponible para que los conductores lo seleccionen al registrarse.`
      : `¿Estás seguro de que deseas desactivar el vehículo "${vehicle?.brand} ${vehicle?.model}"? Este vehículo no estará disponible para que los conductores lo seleccionen.`
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