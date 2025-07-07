import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
} from '@mui/material'
import {
  DirectionsCar as CarIcon,
  EventSeat as SeatIcon,
  Battery90 as BatteryIcon,
  AccessTime as TimeIcon,
  DateRange as DateIcon,
  Person as PersonIcon,
  Image as ImageIcon,
} from '@mui/icons-material'
import { Vehicle } from '../../types/vehicle'

interface VehicleDialogProps {
  open: boolean
  vehicle: Vehicle | null
  onClose: () => void
}

export const VehicleDialog: React.FC<VehicleDialogProps> = ({
  open,
  vehicle,
  onClose,
}) => {
  if (!vehicle) return null

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    try {
      return timestamp.toDate().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={vehicle.imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            variant="rounded"
            sx={{ width: 60, height: 45 }}
          >
            <CarIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {vehicle.brand} {vehicle.model}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Año {vehicle.year}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3}>
          {/* Estado */}
          <Box>
            <Chip
              label={vehicle.active ? 'Activo' : 'Inactivo'}
              color={vehicle.active ? 'success' : 'default'}
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Especificaciones del vehículo */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Especificaciones
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SeatIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Asientos
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {vehicle.seats} asientos
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <BatteryIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Rango total
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {vehicle.kmRange} km
                  </Typography>
                </Box>
              </Stack>
              

              
              <Stack direction="row" spacing={1} alignItems="center">
                <TimeIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tiempo de carga
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {vehicle.chargeTime} minutos
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Imagen del vehículo */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Imagen
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                minHeight: 200,
                bgcolor: 'grey.50',
              }}
            >
              {vehicle.imageUrl ? (
                <img
                  src={vehicle.imageUrl}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <Stack alignItems="center" spacing={1}>
                  <ImageIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay imagen disponible
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>

          {/* Información de creación */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Información del registro
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <DateIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Creado
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(vehicle.createdAt)}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <DateIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Actualizado
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(vehicle.updatedAt)}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Creado por
                  </Typography>
                  <Typography variant="body1">
                    {vehicle.createdBy || 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
} 