import React from 'react'
import { Typography, Box, Chip, Avatar, Divider } from '@mui/material'
import { ReusableDialog, ActionButton } from '../common'
import { Traveler } from '../../types/traveler'

interface TravelerDialogProps {
  open: boolean
  traveler: Traveler | null
  onClose: () => void
  onEdit: (id: string) => void
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
}

export const TravelerDialog: React.FC<TravelerDialogProps> = ({
  open,
  traveler,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  if (!traveler) return null

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'warning'
      case 'suspended': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active': return 'Activo'
      case 'inactive': return 'Inactivo'
      case 'suspended': return 'Suspendido'
      default: return status
    }
  }

  const handleEdit = () => traveler && onEdit(traveler.id)
  const handleDelete = () => traveler && onDelete(traveler.id)
  const handleToggleStatus = () => traveler && onToggleStatus(traveler.id)


  return (
    <ReusableDialog
      open={open}
      onClose={onClose}
      title={`Detalles del Viajero - ${traveler.name}`}
      maxWidth="md"
      actions={
        <>
          <ActionButton variant="secondary" onClick={onClose}>
            Cerrar
          </ActionButton>
          <ActionButton 
            variant="danger" 
            onClick={handleDelete}
          >
            Eliminar
          </ActionButton>
          <ActionButton 
            variant="primary" 
            onClick={handleEdit}
          >
            Editar
          </ActionButton>
          <ActionButton 
            variant={traveler.status === 'active' ? 'danger' : 'primary'} 
            onClick={handleToggleStatus}
          >
            {traveler.status === 'active' ? 'Suspender' : 'Activar'}
          </ActionButton>
        </>
      }
    >
      <Box className="space-y-6">
        {/* Información básica */}
        <Box className="flex items-start space-x-4">
          <Avatar 
            src={traveler.avatar} 
            alt={traveler.name}
            sx={{ width: 80, height: 80 }}
          >
            {traveler.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box className="flex-1">
            <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-2">
              {traveler.name}
            </Typography>
                          <Box className="flex items-center mb-3">
                <Typography><strong>Estado:</strong></Typography>
                <Chip 
                  label={getStatusText(traveler.status)} 
                  color={getStatusColor(traveler.status)}
                  size="small"
                  className="ml-2"
                />
              </Box>
            <Typography variant="body2" color="text.secondary">
              Registrado el {traveler.registeredAt}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Información de contacto */}
        <Box>
          <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
            Información de Contacto
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Box>
              <Typography><strong>Email:</strong> {traveler.email}</Typography>
              <Typography><strong>Teléfono:</strong> {traveler.phone}</Typography>
            </Box>
            <Box>
              <Typography><strong>Ubicación:</strong> {traveler.location || 'No especificada'}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Estadísticas de viajes */}
        <Box>
          <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
            Estadísticas de Viajes
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Box className="text-center p-3 bg-gray-50 dark:bg-dark-bg-hover rounded">
              <Typography variant="h4" className="font-bold text-primary-600">
                {traveler.totalTrips || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Viajes
              </Typography>
            </Box>
            <Box className="text-center p-3 bg-gray-50 dark:bg-dark-bg-hover rounded">
              <Typography variant="h4" className="font-bold text-primary-600">
                {traveler.rating ? `${traveler.rating}/5` : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calificación
              </Typography>
            </Box>
            <Box className="text-center p-3 bg-gray-50 dark:bg-dark-bg-hover rounded">
              <Typography variant="h4" className="font-bold text-primary-600">
                {traveler.lastTrip ? '✓' : '✗'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Último Viaje
              </Typography>
            </Box>
          </Box>
          {traveler.lastTrip && (
            <Typography variant="body2" color="text.secondary" className="mt-2">
              Último viaje realizado: {traveler.lastTrip}
            </Typography>
          )}
        </Box>

        {/* Preferencias */}
        {traveler.preferences && traveler.preferences.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
                Preferencias
              </Typography>
              <Box className="flex flex-wrap gap-2">
                {traveler.preferences.map((preference, index) => (
                  <Chip
                    key={index}
                    label={preference}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </ReusableDialog>
  )
} 