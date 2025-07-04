import React from 'react'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material'
import { DriverRow, Driver } from './DriverRow'

interface DriverTableProps {
  drivers: Driver[]
  loading: boolean
  selected: number[]
  page: number
  rowsPerPage: number
  totalDrivers: number
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRowClick: (id: number) => void
  onView: (driver: Driver) => void
  onApprove: (driverId: number) => void
  onReject: (driverId: number) => void
  onChangePage: (event: unknown, newPage: number) => void
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  loading,
  selected,
  page,
  rowsPerPage,
  totalDrivers,
  onSelectAll,
  onRowClick,
  onView,
  onApprove,
  onReject,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const isSelected = (id: number) => selected.indexOf(id) !== -1

  if (loading) {
    return (
      <Card>
        <Box className="flex justify-center items-center py-12">
          <CircularProgress />
        </Box>
      </Card>
    )
  }

  if (drivers.length === 0) {
    return (
      <Card>
        <Box className="flex justify-center items-center py-12">
          <Typography variant="body1" color="text.secondary">
            No se encontraron conductores
          </Typography>
        </Box>
      </Card>
    )
  }

  return (
    <Card>
      <TableContainer 
        component={Paper} 
        className="shadow-none"
        sx={{
          maxHeight: 600,
          overflowX: 'auto',
          '& .MuiTable-root': {
            minWidth: 1000, // Ancho mínimo para forzar scroll
          }
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                padding="checkbox"
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
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
                  indeterminate={selected.length > 0 && selected.length < drivers.length}
                  checked={drivers.length > 0 && selected.length === drivers.length}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell 
                sx={{
                  position: 'sticky',
                  left: 48,
                  zIndex: 3,
                  backgroundColor: 'background.paper',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  minWidth: 200
                }}
              >
                Conductor
              </TableCell>
              <TableCell sx={{ minWidth: 180 }}>Contacto</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Estado</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Documentos</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Vehículo</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Calificación</TableCell>
              <TableCell 
                sx={{ minWidth: 150 }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) => (
              <DriverRow
                key={driver.id}
                driver={driver}
                isSelected={isSelected(driver.id)}
                onRowClick={onRowClick}
                onView={onView}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalDrivers}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  )
} 