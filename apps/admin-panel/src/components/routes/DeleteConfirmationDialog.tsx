import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'
import { Route } from '../../types/route'

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isMultiple ? 'Eliminar rutas seleccionadas' : 'Eliminar ruta'}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {isMultiple
            ? `¿Estás seguro de que deseas eliminar ${selectedCount} rutas seleccionadas?`
            : `¿Estás seguro de que deseas eliminar la ruta "${route?.name}"?`
          }
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mt-2">
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
} 