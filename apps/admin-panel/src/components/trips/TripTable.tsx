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
  Box,
  Typography,
  CircularProgress,
} from '@mui/material'
import { TripRow } from './TripRow'
import { Trip } from '../../types/trip'

interface TripTableProps {
  trips: Trip[]
  loading: boolean
  page: number
  rowsPerPage: number
  totalTrips: number
  onView: (trip: Trip) => void
  onChangePage: (event: unknown, newPage: number) => void
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const TripTable: React.FC<TripTableProps> = ({
  trips,
  loading,
  page,
  rowsPerPage,
  totalTrips,
  onView,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  if (loading) {
    return (
      <Card>
        <Box className="flex justify-center items-center py-12">
          <CircularProgress />
        </Box>
      </Card>
    )
  }

  if (trips.length === 0) {
    return (
      <Card>
        <Box className="flex justify-center items-center py-12">
          <Typography variant="body1" color="text.secondary">
            No se encontraron viajes
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
            minWidth: 1200, // Ancho mínimo para forzar scroll
          }
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                  backgroundColor: 'background.paper',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  minWidth: 200
                }}
              >
                Ruta
              </TableCell>
              <TableCell sx={{ minWidth: 150 }}>Conductor</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Pasajeros</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Horarios</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Estado</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Precio</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Fecha</TableCell>
              <TableCell 
                sx={{ minWidth: 80 }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((trip) => (
              <TripRow
                key={trip.id}
                trip={trip}
                onView={onView}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalTrips}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  )
} 