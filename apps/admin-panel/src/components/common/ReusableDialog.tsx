import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Button,
  ButtonProps,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

export interface ReusableDialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  actions?: React.ReactNode
  showCloseButton?: boolean
}

/**
 * Componente de Dialog reutilizable con header, contenido y footer separados por dividers.
 * 
 * @example
 * ```tsx
 * <ReusableDialog
 *   open={open}
 *   onClose={handleClose}
 *   title="Título del Dialog"
 *   actions={
 *     <>
 *       <ActionButton variant="secondary" onClick={handleCancel}>
 *         Cancelar
 *       </ActionButton>
 *       <ActionButton variant="primary" onClick={handleSave}>
 *         Guardar
 *       </ActionButton>
 *     </>
 *   }
 * >
 *   <Typography>Contenido del dialog</Typography>
 * </ReusableDialog>
 * ```
 */
export const ReusableDialog: React.FC<ReusableDialogProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm',
  actions,
  showCloseButton = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={true}
      disableEscapeKeyDown={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 200,
        }
      }}
    >
      {/* Header */}
      <Box className="px-6 py-4 bg-neutral-100 dark:bg-dark-bg-hover">
        <Box className="flex items-center justify-between">
          <Typography 
            variant="h5" 
            component="h2"
            className="font-bold text-brand-black dark:text-dark-text-primary"
          >
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              size="small"
              className="text-neutral-500 hover:text-neutral-700 dark:text-dark-text-secondary dark:hover:text-dark-text-primary"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Content */}
      <DialogContent className="px-6 py-4">
        {children}
      </DialogContent>

      {/* Footer */}
      {actions && (
        <>
          <Box className="px-6 py-2 bg-neutral-100 dark:bg-dark-bg-hover">
            <DialogActions className="justify-end p-0">
              {actions}
            </DialogActions>
          </Box>
        </>
      )}
    </Dialog>
  )
}

// Componente helper para botones de acción comunes
export interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger'
}

/**
 * Botón de acción preestilizado para usar en los dialogs.
 * 
 * @example
 * ```tsx
 * <ActionButton variant="primary" onClick={handleSave}>
 *   Guardar
 * </ActionButton>
 * 
 * <ActionButton variant="secondary" onClick={handleCancel}>
 *   Cancelar
 * </ActionButton>
 * 
 * <ActionButton variant="danger" onClick={handleDelete}>
 *   Eliminar
 * </ActionButton>
 * ```
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          variant: 'contained' as const,
          className: 'bg-brand-yellow text-brand-black hover:bg-brand-yellow/90'
        }
      case 'secondary':
        return {
          variant: 'outlined' as const,
          className: 'border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-dark-border-primary dark:text-dark-text-primary dark:hover:bg-dark-bg-hover'
        }
      case 'danger':
        return {
          variant: 'outlined' as const,
          className: 'border-red-300 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20'
        }
      default:
        return {
          variant: 'text' as const,
          className: 'text-neutral-600 hover:bg-neutral-100 dark:text-dark-text-secondary dark:hover:bg-dark-bg-hover'
        }
    }
  }

  const variantProps = getVariantProps()

  return (
    <Button
      {...variantProps}
      {...props}
      className={`${variantProps.className} ${props.className || ''}`}
    >
      {children}
    </Button>
  )
}

/*
 * EJEMPLOS DE USO:
 * 
 * 1. Dialog simple de confirmación:
 * ```tsx
 * <ReusableDialog
 *   open={confirmOpen}
 *   onClose={handleCloseConfirm}
 *   title="Confirmar eliminación"
 *   maxWidth="sm"
 *   actions={
 *     <>
 *       <ActionButton variant="secondary" onClick={handleCloseConfirm}>
 *         Cancelar
 *       </ActionButton>
 *       <ActionButton variant="danger" onClick={handleDelete}>
 *         Eliminar
 *       </ActionButton>
 *     </>
 *   }
 * >
 *   <Typography>
 *     ¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.
 *   </Typography>
 * </ReusableDialog>
 * ```
 * 
 * 2. Dialog de formulario:
 * ```tsx
 * <ReusableDialog
 *   open={formOpen}
 *   onClose={handleCloseForm}
 *   title="Crear nueva ruta"
 *   maxWidth="lg"
 *   actions={
 *     <>
 *       <ActionButton variant="secondary" onClick={handleCloseForm}>
 *         Cancelar
 *       </ActionButton>
 *       <ActionButton variant="primary" onClick={handleSave} disabled={!isValid}>
 *         Guardar
 *       </ActionButton>
 *     </>
 *   }
 * >
 *   <Box className="space-y-4">
 *     <TextField label="Nombre" fullWidth />
 *     <TextField label="Origen" fullWidth />
 *     <TextField label="Destino" fullWidth />
 *   </Box>
 * </ReusableDialog>
 * ```
 * 
 * 3. Dialog de solo lectura:
 * ```tsx
 * <ReusableDialog
 *   open={viewOpen}
 *   onClose={handleCloseView}
 *   title="Detalles del usuario"
 *   actions={
 *     <ActionButton onClick={handleCloseView}>
 *       Cerrar
 *     </ActionButton>
 *   }
 * >
 *   <Box className="space-y-2">
 *     <Typography><strong>Nombre:</strong> Juan Pérez</Typography>
 *     <Typography><strong>Email:</strong> juan@example.com</Typography>
 *     <Typography><strong>Rol:</strong> Conductor</Typography>
 *   </Box>
 * </ReusableDialog>
 * ```
 */ 