import React from 'react'
import { Vehicle } from '../../types/vehicle'
import { ConfirmationDialog } from '../common'

interface DeleteConfirmationDialogProps {
  open: boolean
  vehicle: Vehicle | null
  selectedCount: number
  onClose: () => void
  onConfirm: () => void
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  vehicle,
  selectedCount,
  onClose,
  onConfirm,
}) => {
  const isMultiple = selectedCount > 0

  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={isMultiple ? 'Eliminar vehículos seleccionados' : 'Eliminar vehículo'}
      message={
        isMultiple
          ? `¿Estás seguro de que deseas eliminar ${selectedCount} vehículos seleccionados? Esta acción no se puede deshacer.`
          : `¿Estás seguro de que deseas eliminar el vehículo "${vehicle?.brand} ${vehicle?.model}"? Esta acción no se puede deshacer.`
      }
      variant="danger"
    />
  )
} 