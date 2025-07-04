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
import { TravelerRow, Traveler } from './TravelerRow'

interface TravelerTableProps {
  travelers: Traveler[]
  loading: boolean
  selected: number[]
  page: number
  rowsPerPage: number
  totalTravelers: number
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRowClick: (id: number) => void
  onView: (traveler: Traveler) => void
  onEdit: (traveler: Traveler) => void
  onDelete: (travelerId: number) => void
  onToggleStatus: (travelerId: number) => void
  onChangePage: (event: unknown, newPage: number) => void
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const TravelerTable: React.FC<TravelerTableProps> = ({
  travelers,
  loading,
  selected,
  page,
  rowsPerPage,
  totalTravelers,
  onSelectAll,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
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

  if (travelers.length === 0) {
    return (
      <Card>
        <Box className="flex justify-center items-center py-12">
          <Typography variant="body1" color="text.secondary">
            No se encontraron viajeros
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
                  indeterminate={selected.length > 0 && selected.length < travelers.length}
                  checked={travelers.length > 0 && selected.length === travelers.length}
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
                Viajero
              </TableCell>
              <TableCell sx={{ minWidth: 180 }}>Contacto</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Estado</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Viajes</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Calificación</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Ubicación</TableCell>
              <TableCell 
                sx={{ minWidth: 150 }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {travelers.map((traveler) => (
              <TravelerRow
                key={traveler.id}
                traveler={traveler}
                isSelected={isSelected(traveler.id)}
                onRowClick={onRowClick}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalTravelers}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  )
} 