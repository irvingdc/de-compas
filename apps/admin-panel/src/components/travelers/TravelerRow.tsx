import React from 'react'
import {
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

export interface Traveler {
  id: number
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'suspended'
  registeredAt: string
  lastTrip?: string
  totalTrips?: number
  rating?: number
  avatar?: string
  location?: string
  preferences?: string[]
}

interface TravelerRowProps {
  traveler: Traveler
  isSelected: boolean
  onRowClick: (id: number) => void
  onView: (traveler: Traveler) => void
  onEdit: (traveler: Traveler) => void
  onDelete: (travelerId: number) => void
  onToggleStatus: (travelerId: number) => void
}

export const TravelerRow: React.FC<TravelerRowProps> = ({
  traveler,
  isSelected,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
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



  return (
    <TableRow
      hover
      onClick={() => onRowClick(traveler.id)}
      selected={isSelected}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell 
        padding="checkbox"
        sx={{
          position: 'sticky',
          left: 0,
          zIndex: 2,
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          minWidth: 48,
          maxWidth: 48,
          width: 48
        }}
      >
        <Checkbox
          color="primary"
          checked={isSelected}
        />
      </TableCell>
      <TableCell
        sx={{
          position: 'sticky',
          left: 48,
          zIndex: 2,
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box className="flex items-center space-x-3">
          <Avatar 
            src={traveler.avatar} 
            alt={traveler.name}
            sx={{ width: 40, height: 40 }}
          >
            {traveler.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {traveler.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Registrado: {traveler.registeredAt}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Box>
          <Typography variant="body2">{traveler.email}</Typography>
          <Typography variant="caption" color="text.secondary">
            {traveler.phone}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={getStatusText(traveler.status)}
          color={getStatusColor(traveler.status)}
          size="small"
          variant="outlined"
        />
      </TableCell>

      <TableCell>
        <Box>
          <Typography variant="body2">
            {traveler.totalTrips || 0} viajes
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Último: {traveler.lastTrip || 'N/A'}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box className="flex items-center">
          <Typography variant="body2">
            {traveler.rating ? `${traveler.rating}/5` : 'N/A'}
          </Typography>
          <span className="ml-1">⭐</span>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{traveler.location || 'N/A'}</Typography>
      </TableCell>
      <TableCell
        // Elimino sticky de acciones
        sx={{ minWidth: 150 }}
      >
        <Box className="flex space-x-1">
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onView(traveler)
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(traveler)
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {traveler.status === 'active' ? (
            <Tooltip title="Suspender">
              <IconButton
                size="small"
                color="warning"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleStatus(traveler.id)
                }}
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activar">
              <IconButton
                size="small"
                color="success"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleStatus(traveler.id)
                }}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(traveler.id)
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