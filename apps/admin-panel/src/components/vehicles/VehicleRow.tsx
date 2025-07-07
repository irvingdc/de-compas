import React from 'react'
import {
  TableRow,
  TableCell,
  Checkbox,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  DirectionsCar as CarIcon,
  EventSeat as SeatIcon,
  Battery90 as BatteryIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material'
import { Vehicle } from '../../types/vehicle'

interface VehicleRowProps {
  vehicle: Vehicle
  isSelected: boolean
  onSelect: (id: string) => void
  onView: (vehicle: Vehicle) => void
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicle: Vehicle) => void
  onToggleStatus: (vehicleId: string, currentStatus: boolean) => void
}

export const VehicleRow: React.FC<VehicleRowProps> = ({
  vehicle,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const handleRowClick = () => {
    onSelect(vehicle.id)
  }

  const handleViewClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    onView(vehicle)
  }

  const handleToggleStatus = (event: React.MouseEvent) => {
    event.stopPropagation()
    onToggleStatus(vehicle.id, vehicle.active)
  }

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation()
    onEdit(vehicle)
  }

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation()
    onDelete(vehicle)
  }

  return (
    <TableRow
      hover
      onClick={handleRowClick}
      selected={isSelected}
      className="cursor-pointer"
      sx={{
        '&:hover': {
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected}
          color="primary"
        />
      </TableCell>
      
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={vehicle.imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            variant="rounded"
            sx={{ width: 56, height: 40 }}
          >
            <CarIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {vehicle.brand} {vehicle.model}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {vehicle.year}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <SeatIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {vehicle.seats} asientos
          </Typography>
        </Stack>
      </TableCell>
      
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <BatteryIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="body2">
              {vehicle.kmRange} km
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {vehicle.kmPerCharge} km/carga
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <TimeIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {vehicle.chargeTime} min
          </Typography>
        </Stack>
      </TableCell>
      
      <TableCell>
        <Chip
          label={vehicle.active ? 'Activo' : 'Inactivo'}
          size="small"
          variant="outlined"
          color={vehicle.active ? 'success' : 'default'}
        />
      </TableCell>
      
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {vehicle.createdAt.toDate().toLocaleDateString()}
        </Typography>
      </TableCell>
      
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={handleViewClick}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={handleEdit}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={vehicle.active ? 'Desactivar' : 'Activar'}>
            <IconButton
              size="small"
              onClick={handleToggleStatus}
              color={vehicle.active ? 'warning' : 'success'}
            >
              {vehicle.active ? <ToggleOffIcon fontSize="small" /> : <ToggleOnIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={handleDelete}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  )
} 