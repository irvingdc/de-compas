import React from 'react'
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material'
import { Trip } from '../../types/trip'

interface TripRowProps {
  trip: Trip
  onView: (trip: Trip) => void
}

export const TripRow: React.FC<TripRowProps> = ({
  trip,
  onView,
}) => {
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

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    onView(trip)
  }

  return (
    <TableRow
      hover
      onClick={() => onView(trip)}
      sx={{ cursor: 'pointer' }}
    >
      {/* Ruta */}
      <TableCell>
        <Box>
          <Typography variant="body2" fontWeight="medium" className="text-brand-black dark:text-dark-text-primary">
            {trip.routeName}
          </Typography>
          <Box className="flex items-center mt-1">
            <LocationIcon className="h-3 w-3 text-gray-400 dark:text-dark-text-muted mr-1" />
            <Typography variant="caption" color="text.secondary">
              {trip.origin} → {trip.destination}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Conductor */}
      <TableCell>
        <Box>
          <Typography variant="body2" className="text-brand-black dark:text-dark-text-primary">
            {trip.driverName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {trip.driverEmail}
          </Typography>
        </Box>
      </TableCell>

      {/* Pasajeros */}
      <TableCell>
        <Box className="flex items-center">
          <PersonIcon className="h-4 w-4 text-gray-400 dark:text-dark-text-muted mr-1" />
          <Typography variant="body2" className="text-brand-black dark:text-dark-text-primary">
            {trip.passengers.length}/{trip.maxPassengers}
          </Typography>
        </Box>
      </TableCell>

      {/* Horarios */}
      <TableCell>
        <Box>
          <Box className="flex items-center">
            <ScheduleIcon className="h-3 w-3 text-gray-400 dark:text-dark-text-muted mr-1" />
            <Typography variant="caption" color="text.secondary">
              Salida: {formatTime(trip.estimatedDeparture)}
            </Typography>
          </Box>
          <Box className="flex items-center mt-1">
            <ScheduleIcon className="h-3 w-3 text-gray-400 dark:text-dark-text-muted mr-1" />
            <Typography variant="caption" color="text.secondary">
              Llegada: {formatTime(trip.estimatedArrival)}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Estado */}
      <TableCell>
        <Chip 
          label={getStatusText(trip.status)} 
          color={getStatusColor(trip.status)}
          size="small"
        />
      </TableCell>

      {/* Precio */}
      <TableCell>
        <Typography variant="body2" className="text-brand-black dark:text-dark-text-primary">
          ${trip.price}
        </Typography>
      </TableCell>

      {/* Fecha */}
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {formatDateTime(trip.estimatedDeparture)}
        </Typography>
      </TableCell>

      {/* Acciones */}
      <TableCell align="right">
        <Box className="flex items-center justify-end">
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={handleView}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  )
} 