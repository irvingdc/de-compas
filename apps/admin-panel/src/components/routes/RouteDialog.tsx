import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material'
import { Route } from '../../types/route'

interface RouteDialogProps {
  open: boolean
  route: Route | null
  onClose: () => void
}

export const RouteDialog: React.FC<RouteDialogProps> = ({
  open,
  route,
  onClose,
}) => {
  if (!route) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Detalles de la Ruta - {route.name}
      </DialogTitle>
      <DialogContent>
        <Box className="space-y-4 mt-4">
          <Box className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <Box className="flex-1">
              <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mt-6 mb-1">
                Información General
              </Typography>
              <Box className="mt-2 space-y-2">
                <Typography><strong>Nombre:</strong> {route.name}</Typography>
                <Typography><strong>Origen:</strong> {route.origin.name}, {route.origin.city}</Typography>
                <Typography><strong>Destino:</strong> {route.destination.name}, {route.destination.city}</Typography>
                <Typography><strong>Distancia:</strong> {route.distance} km</Typography>
                <Typography><strong>Duración:</strong> {route.duration}</Typography>
                <Typography><strong>Precio:</strong> ${route.price}</Typography>
              </Box>
            </Box>
            <Box className="flex-1">
              <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mt-6 mb-1">
                Paradas Intermedias
              </Typography>
              <Box className="mt-2">
                {route.stops.length > 0 ? (
                  route.stops.map((stop, index) => (
                    <Typography key={stop.id} variant="body2">
                      {index + 1}. {stop.name}, {stop.city} - {stop.estimatedTime}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" className="dark:text-dark-text-secondary">
                    No hay paradas intermedias
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          
          {route.description && (
            <Box>
              <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mt-6 mb-1">
                Descripción
              </Typography>
              <Typography variant="body2" className="mt-1">
                {route.description}
              </Typography>
            </Box>
          )}

          {route.amenities && route.amenities.length > 0 && (
            <Box>
              <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mt-6 mb-1">
                Servicios Incluidos
              </Typography>
              <Box className="mt-2 flex flex-wrap gap-2">
                {route.amenities.map((amenity, index) => (
                  <Chip key={index} label={amenity} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
} 