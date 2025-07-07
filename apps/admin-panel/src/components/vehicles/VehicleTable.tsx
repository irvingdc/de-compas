import React from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Typography,
  Skeleton,
  Stack,
  Paper,
} from '@mui/material'
import { Vehicle } from '../../types/vehicle'
import { VehicleRow } from './VehicleRow'

interface VehicleTableProps {
  vehicles: Vehicle[]
  loading: boolean
  selected: string[]
  page: number
  rowsPerPage: number
  totalVehicles: number
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRowClick: (id: string) => void
  onView: (vehicle: Vehicle) => void
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicle: Vehicle) => void
  onToggleStatus: (vehicleId: string, currentStatus: boolean) => void
  onChangePage: (event: unknown, newPage: number) => void
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  loading,
  selected,
  page,
  rowsPerPage,
  totalVehicles,
  onSelectAll,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const isAllSelected = vehicles.length > 0 && selected.length === vehicles.length
  const isPartiallySelected = selected.length > 0 && selected.length < vehicles.length

  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell padding="checkbox">
        <Skeleton variant="circular" width={20} height={20} />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton variant="rounded" width={56} height={40} />
          <Box>
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={80} height={16} />
          </Box>
        </Stack>
      </TableCell>
      <TableCell><Skeleton variant="text" width={80} /></TableCell>
      <TableCell><Skeleton variant="text" width={100} /></TableCell>
      <TableCell><Skeleton variant="text" width={70} /></TableCell>
      <TableCell><Skeleton variant="text" width={80} /></TableCell>
      <TableCell><Skeleton variant="text" width={100} /></TableCell>
      <TableCell><Skeleton variant="text" width={120} /></TableCell>
    </TableRow>
  )

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={isPartiallySelected}
                  checked={isAllSelected}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell>Vehículo</TableCell>
              <TableCell>Asientos</TableCell>
              <TableCell>Rango</TableCell>
              <TableCell>Carga</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Mostrar skeletons mientras carga
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box className="py-8">
                    <Typography variant="body1" color="text.secondary">
                      No se encontraron vehículos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Intenta ajustar los filtros o agrega un nuevo vehículo
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <VehicleRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={selected.includes(vehicle.id)}
                  onSelect={onRowClick}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalVehicles}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </Paper>
  )
} 