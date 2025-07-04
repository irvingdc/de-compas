import React from 'react'
import {
  Box,
  TableRow,
  TableCell,
  Checkbox,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Route as RouteIcon,
  Visibility as VisibilityIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
} from '@mui/icons-material'
import { Route } from '../../types/route'

interface RouteRowProps {
  route: Route
  isSelected: boolean
  onRowClick: (id: string) => void
  onView: (route: Route) => void
  onEdit: (route: Route) => void
  onDelete: (route: Route) => void
  onToggleStatus: (routeId: string, currentStatus: boolean) => void
}

export const RouteRow: React.FC<RouteRowProps> = ({
  route,
  isSelected,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getStatusColor = (active: boolean): 'success' | 'error' => {
    return active ? 'success' : 'error'
  }

  const getStatusText = (active: boolean): string => {
    return active ? 'Activa' : 'Inactiva'
  }

  return (
    <TableRow
      hover
      onClick={() => onRowClick(route.id)}
      selected={isSelected}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isSelected}
        />
      </TableCell>
      <TableCell>
        <Box className="flex items-center">
          <RouteIcon className="mr-2 text-gray-400" />
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {route.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {route.origin.city} → {route.destination.city}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Box>
          {route.stops.length > 0 ? (
            <Typography variant="body2">
              {route.stops.map(stop => stop.city).join(', ')}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Directo
            </Typography>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight="medium">
          ${route.price}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {route.duration}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={getStatusText(route.active)}
          color={getStatusColor(route.active)}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Box className="flex space-x-1">
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onView(route)
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(route)
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={route.active ? 'Desactivar' : 'Activar'}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onToggleStatus(route.id, route.active)
              }}
            >
              {route.active ? (
                <ToggleOnIcon fontSize="small" color="success" />
              ) : (
                <ToggleOffIcon fontSize="small" color="disabled" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(route)
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  )
} 