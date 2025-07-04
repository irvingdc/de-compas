import React from 'react'
import { Route } from '../../types/route'
import { ConfirmationDialog } from '../common'

interface DeleteConfirmationDialogProps {
  open: boolean
  route: Route | null
  selectedCount: number
  onClose: () => void
  onConfirm: () => void
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  route,
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
      title={isMultiple ? 'Eliminar rutas seleccionadas' : 'Eliminar ruta'}
      message={
        isMultiple
          ? `¿Estás seguro de que deseas eliminar ${selectedCount} rutas seleccionadas? Esta acción no se puede deshacer.`
          : `¿Estás seguro de que deseas eliminar la ruta "${route?.name}"? Esta acción no se puede deshacer.`
      }
      variant="danger"
    />
  )
} 