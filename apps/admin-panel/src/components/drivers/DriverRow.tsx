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
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { Driver } from '../../types/driver'

interface DriverRowProps {
  driver: Driver
  isSelected: boolean
  onRowClick: (id: string) => void
  onView: (driver: Driver) => void
  onApprove: (driverId: string) => void
  onReject: (driverId: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const DriverRow: React.FC<DriverRowProps> = ({
  driver,
  isSelected,
  onRowClick,
  onView,
  onApprove,
  onReject,
}) => {
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

  return (
    <TableRow
      hover
      onClick={() => onRowClick(driver.id)}
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
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {driver.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Registrado: {driver.registeredAt}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box>
          <Typography variant="body2">{driver.email}</Typography>
          <Typography variant="caption" color="text.secondary">
            {driver.phone}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={getStatusText(driver.status)}
          color={getStatusColor(driver.status)}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Chip
          label={driver.documentsComplete ? 'Completos' : 'Incompletos'}
          color={driver.documentsComplete ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2">{driver.vehicleType || 'N/A'}</Typography>
      </TableCell>
      <TableCell>
        <Box className="flex items-center">
          <Typography variant="body2">
            {driver.rating ? `${driver.rating}/5` : 'N/A'}
          </Typography>
          <span className="ml-1">⭐</span>
        </Box>
      </TableCell>
      <TableCell
        sx={{ minWidth: 150 }}
      >
        <Box className="flex space-x-1">
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onView(driver)
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {driver.status === 'pending' && (
            <>
              <Tooltip title="Aprobar">
                <IconButton
                  size="small"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation()
                    onApprove(driver.id)
                  }}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rechazar">
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation()
                    onReject(driver.id)
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </TableCell>
    </TableRow>
  )
} 