import React from 'react'
import { Typography, Box, Chip, Divider, Avatar } from '@mui/material'
import { ReusableDialog, ActionButton } from '../common'
import { Trip } from '../../types/trip'

interface TripDialogProps {
  trip: Trip | null
  onClose: () => void
}

export const TripDialog: React.FC<TripDialogProps> = ({
  trip,
  onClose,
}) => {
  if (!trip) return null

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'info'
      case 'scheduled': return 'default'
      case 'cancelled': return 'error'
      case 'delayed': return 'warning'
      default: return 'default'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed': return 'Completado'
      case 'in_progress': return 'En Progreso'
      case 'scheduled': return 'Programado'
      case 'cancelled': return 'Cancelado'
      case 'delayed': return 'Retrasado'
      default: return status
    }
  }

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPaymentMethodText = (method: string): string => {
    switch (method) {
      case 'cash': return 'Efectivo'
      case 'card': return 'Tarjeta'
      case 'transfer': return 'Transferencia'
      default: return method
    }
  }

  const getPassengerStatusColor = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'cancelled': return 'error'
      case 'no_show': return 'warning'
      default: return 'default'
    }
  }

  const getPassengerStatusText = (status: string): string => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'cancelled': return 'Cancelado'
      case 'no_show': return 'No Presentó'
      default: return status
    }
  }

  return (
    <ReusableDialog
      open={!!trip}
      onClose={onClose}
      title={`Detalles del Viaje - ${trip.routeName}`}
      maxWidth="lg"
      actions={
        <ActionButton variant="secondary" onClick={onClose}>
          Cerrar
        </ActionButton>
      }
    >
      <Box className="space-y-6">
        {/* Información General */}
        <Box>
          <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
            Información General
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Box className="space-y-2">
              <Typography><strong>Ruta:</strong> {trip.routeName}</Typography>
              <Typography><strong>Origen:</strong> {trip.origin}</Typography>
              <Typography><strong>Destino:</strong> {trip.destination}</Typography>
              <Typography><strong>Distancia:</strong> {trip.distance} km</Typography>
              <Typography><strong>Precio:</strong> ${trip.price}</Typography>
            </Box>
            <Box className="space-y-2">
              <Box className="flex items-center">
                <Typography><strong>Estado:</strong></Typography>
                <Chip 
                  label={getStatusText(trip.status)} 
                  color={getStatusColor(trip.status)}
                  size="small"
                  className="ml-2"
                />
              </Box>
              <Typography><strong>Pasajeros:</strong> {trip.passengers.length}/{trip.maxPassengers}</Typography>
              <Typography><strong>Creado:</strong> {formatDateTime(trip.createdAt)}</Typography>
              <Typography><strong>Actualizado:</strong> {formatDateTime(trip.updatedAt)}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Horarios */}
        <Box>
          <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
            Horarios
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Box className="space-y-2">
              <Typography variant="subtitle2" color="text.secondary">Estimados</Typography>
              <Typography><strong>Salida:</strong> {formatDateTime(trip.estimatedDeparture)}</Typography>
              <Typography><strong>Llegada:</strong> {formatDateTime(trip.estimatedArrival)}</Typography>
            </Box>
            <Box className="space-y-2">
              <Typography variant="subtitle2" color="text.secondary">Reales</Typography>
              {trip.actualDeparture ? (
                <Typography><strong>Salida:</strong> {formatDateTime(trip.actualDeparture)}</Typography>
              ) : (
                <Typography color="text.secondary">No registrada</Typography>
              )}
              {trip.actualArrival ? (
                <Typography><strong>Llegada:</strong> {formatDateTime(trip.actualArrival)}</Typography>
              ) : (
                <Typography color="text.secondary">No registrada</Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Información del Conductor */}
        <Box>
          <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
            Conductor
          </Typography>
          <Box className="bg-neutral-50 dark:bg-dark-bg-hover p-4 rounded-lg">
            <Box className="flex items-center space-x-3">
              <Avatar className="bg-brand-yellow text-brand-black">
                {trip.driverName.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" className="font-semibold text-brand-black dark:text-dark-text-primary">
                  {trip.driverName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trip.driverEmail}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trip.driverPhone}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Pasajeros */}
        <Box>
          <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
            Pasajeros ({trip.passengers.length}/{trip.maxPassengers})
          </Typography>
          {trip.passengers.length === 0 ? (
            <Box className="text-center py-8">
              <Typography color="text.secondary">No hay pasajeros registrados</Typography>
            </Box>
          ) : (
            <Box className="space-y-3">
              {trip.passengers.map((passenger) => (
                <Box key={passenger.id} className="bg-neutral-50 dark:bg-dark-bg-hover p-4 rounded-lg">
                  <Box className="flex items-center justify-between mb-2">
                    <Box className="flex items-center space-x-3">
                      <Avatar className="bg-blue-500 text-white">
                        {passenger.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" className="font-semibold text-brand-black dark:text-dark-text-primary">
                          {passenger.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {passenger.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="flex items-center space-x-2">
                      <Chip 
                        label={`Asiento ${passenger.seatNumber}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip 
                        label={getPassengerStatusText(passenger.status)}
                        color={getPassengerStatusColor(passenger.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <Box>
                      <Typography variant="body2"><strong>Teléfono:</strong> {passenger.phone}</Typography>
                      <Typography variant="body2"><strong>Recogida:</strong> {passenger.pickupLocation}</Typography>
                      <Typography variant="body2"><strong>Destino:</strong> {passenger.dropoffLocation}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2"><strong>Pago:</strong> {getPaymentMethodText(passenger.paymentMethod)}</Typography>
                      <Typography variant="body2"><strong>Estado Pago:</strong> {passenger.paymentStatus}</Typography>
                      {passenger.specialRequests && (
                        <Typography variant="body2"><strong>Solicitudes:</strong> {passenger.specialRequests}</Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Notas y Razones */}
        {(trip.notes || trip.cancellationReason || trip.delayReason) && (
          <>
            <Divider />
            <Box>
              <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
                Información Adicional
              </Typography>
              <Box className="space-y-2">
                {trip.notes && (
                  <Typography><strong>Notas:</strong> {trip.notes}</Typography>
                )}
                {trip.cancellationReason && (
                  <Typography color="error"><strong>Razón de Cancelación:</strong> {trip.cancellationReason}</Typography>
                )}
                {trip.delayReason && (
                  <Typography color="warning.main"><strong>Razón de Retraso:</strong> {trip.delayReason}</Typography>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </ReusableDialog>
  )
} 