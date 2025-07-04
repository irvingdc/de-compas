import React from 'react'
import { Typography, Box, Chip } from '@mui/material'
import { ReusableDialog, ActionButton } from '../common'
import { Driver } from '../../types/driver'

interface DriverDialogProps {
  driver: Driver | null
  onClose: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const DriverDialog: React.FC<DriverDialogProps> = ({
  driver,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!driver) return null

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'approved': return 'Aprobado'
      case 'pending': return 'Pendiente'
      case 'rejected': return 'Rechazado'
      default: return status
    }
  }

  const handleEdit = () => driver && onEdit(driver.id)
  const handleDelete = () => driver && onDelete(driver.id)

  return (
    <ReusableDialog
      open={!!driver}
      onClose={onClose}
      title={`Detalles del Conductor - ${driver.name}`}
      maxWidth="md"
      actions={
        <>
          <ActionButton variant="secondary" onClick={onClose}>
            Cerrar
          </ActionButton>
          {driver.status === 'pending' && (
            <>
              <ActionButton 
                variant="danger" 
                onClick={handleDelete}
              >
                Rechazar
              </ActionButton>
              <ActionButton 
                variant="primary" 
                onClick={handleEdit}
              >
                Aprobar
              </ActionButton>
            </>
          )}
        </>
      }
    >
      <Box className="space-y-4">
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Box>
            <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
              Información Personal
            </Typography>
            <Box className="space-y-2">
              <Typography><strong>Nombre:</strong> {driver.name}</Typography>
              <Typography><strong>Email:</strong> {driver.email}</Typography>
              <Typography><strong>Teléfono:</strong> {driver.phone}</Typography>
              <Typography><strong>Licencia:</strong> {driver.licenseNumber || 'No especificada'}</Typography>
              <Typography><strong>Registrado:</strong> {driver.registeredAt}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
              Información del Vehículo
            </Typography>
            <Box className="space-y-2">
              <Typography><strong>Tipo:</strong> {driver.vehicleType || 'No especificado'}</Typography>
              <Typography><strong>Calificación:</strong> {driver.rating ? `${driver.rating}/5 ⭐` : 'N/A'}</Typography>
              <Box className="flex items-center">
                <Typography><strong>Estado:</strong></Typography>
                <Chip 
                  label={getStatusText(driver.status)} 
                  color={getStatusColor(driver.status)}
                  size="small"
                  className="ml-2"
                />
              </Box>
              <Box className="flex items-center">
                <Typography><strong>Documentos:</strong></Typography>
                <Chip 
                  label={driver.documentsComplete ? 'Completos' : 'Incompletos'}
                  color={driver.documentsComplete ? 'success' : 'error'}
                  size="small"
                  className="ml-2"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ReusableDialog>
  )
} 