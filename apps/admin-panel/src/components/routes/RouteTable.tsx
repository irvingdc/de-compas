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
  Typography,
  CircularProgress,
} from '@mui/material'
import { Route } from '../../types/route'
import { RouteRow } from './RouteRow'

interface RouteTableProps {
  routes: Route[]
  loading: boolean
  selected: string[]
  page: number
  rowsPerPage: number
  totalRoutes: number
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRowClick: (id: string) => void
  onView: (route: Route) => void
  onEdit: (route: Route) => void
  onDelete: (route: Route) => void
  onToggleStatus: (routeId: string, currentStatus: boolean) => void
  onChangePage: (event: unknown, newPage: number) => void
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const RouteTable: React.FC<RouteTableProps> = ({
  routes,
  loading,
  selected,
  page,
  rowsPerPage,
  totalRoutes,
  onSelectAll,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const isSelected = (id: string) => selected.indexOf(id) !== -1

  return (
    <Card>
      <TableContainer component={Paper} className="shadow-none">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < routes.length}
                  checked={routes.length > 0 && selected.length === routes.length}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell>Ruta</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : routes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay rutas disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              routes.map((route) => (
                <RouteRow
                  key={route.id}
                  route={route}
                  isSelected={isSelected(route.id)}
                  onRowClick={onRowClick}
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
        component="div"
        count={totalRoutes}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Card>
  )
} 