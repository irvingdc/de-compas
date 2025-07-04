import React from 'react'
import { Typography, Box } from '@mui/material'
import { ReusableDialog, ActionButton } from './ReusableDialog'

export interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Componente de confirmación reutilizable para acciones importantes.
 * 
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   open={deleteDialogOpen}
 *   onClose={() => setDeleteDialogOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Confirmar eliminación"
 *   message="¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer."
 *   variant="danger"
 * />
 * ```
 */
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message,
  confirmText,
  cancelText = 'Cancelar',
  variant = 'info',
  maxWidth = 'sm',
}) => {
  const getConfirmText = () => {
    if (confirmText) return confirmText
    
    switch (variant) {
      case 'danger':
        return 'Eliminar'
      case 'warning':
        return 'Continuar'
      case 'info':
      default:
        return 'Confirmar'
    }
  }

  const getConfirmVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger'
      case 'warning':
        return 'primary'
      case 'info':
      default:
        return 'primary'
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <ReusableDialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      actions={
        <>
          <ActionButton variant="secondary" onClick={onClose}>
            {cancelText}
          </ActionButton>
          <ActionButton 
            variant={getConfirmVariant() as any} 
            onClick={handleConfirm}
          >
            {getConfirmText()}
          </ActionButton>
        </>
      }
    >
      <Box className="py-2">
        <Typography className="text-neutral-700 dark:text-dark-text-secondary">
          {message}
        </Typography>
      </Box>
    </ReusableDialog>
  )
} 

/*
 * EJEMPLOS DE USO DEL CONFIRMATION DIALOG:
 * 
 * 1. Eliminación simple:
 * ```tsx
 * <ConfirmationDialog
 *   open={deleteOpen}
 *   onClose={() => setDeleteOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Eliminar elemento"
 *   message="¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer."
 *   variant="danger"
 * />
 * ```
 * 
 * 2. Aprobación de conductor:
 * ```tsx
 * <ConfirmationDialog
 *   open={approveOpen}
 *   onClose={() => setApproveOpen(false)}
 *   onConfirm={handleApprove}
 *   title="Confirmar Aprobación"
 *   message={`¿Estás seguro de aprobar al conductor ${driverName}?`}
 *   confirmText="Aprobar"
 *   variant="info"
 * />
 * ```
 * 
 * 3. Cambio de estado con advertencia:
 * ```tsx
 * <ConfirmationDialog
 *   open={statusOpen}
 *   onClose={() => setStatusOpen(false)}
 *   onConfirm={handleStatusChange}
 *   title="Cambiar Estado"
 *   message="Al cambiar el estado, se enviará una notificación al usuario. ¿Deseas continuar?"
 *   confirmText="Cambiar"
 *   variant="warning"
 * />
 * ```
 * 
 * 4. Logout simple:
 * ```tsx
 * <ConfirmationDialog
 *   open={logoutOpen}
 *   onClose={() => setLogoutOpen(false)}
 *   onConfirm={handleLogout}
 *   title="¿Cerrar sesión?"
 *   message="¿Estás seguro de que deseas cerrar tu sesión?"
 *   confirmText="Cerrar sesión"
 *   variant="info"
 * />
 * ```
 * 
 * 5. Acción destructiva con texto personalizado:
 * ```tsx
 * <ConfirmationDialog
 *   open={dangerOpen}
 *   onClose={() => setDangerOpen(false)}
 *   onConfirm={handleDangerAction}
 *   title="Acción Destructiva"
 *   message="Esta acción eliminará permanentemente todos los datos asociados. No podrás recuperarlos."
 *   confirmText="Eliminar Todo"
 *   cancelText="Mantener"
 *   variant="danger"
 * />
 * ```
 */ 