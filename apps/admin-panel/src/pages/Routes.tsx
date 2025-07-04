import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Snackbar,
} from '@mui/material'

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Route as RouteIcon,
  Visibility as VisibilityIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
} from '@mui/icons-material'

import { Route, RouteFilters } from '../types/route'
import { routeService } from '../services/routeService'

export const Routes: React.FC = () => {
  // Estados principales
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  
  // Paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRoutes, setTotalRoutes] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  
  // Filtros
  const [filters, setFilters] = useState<RouteFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  
  // Notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  })

  // Cargar rutas
  useEffect(() => {
    loadRoutes()
  }, [page, rowsPerPage, filters])

  const loadRoutes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await routeService.getRoutes(filters, rowsPerPage)
      
      setRoutes(result.routes)
      setTotalRoutes(result.total)
      setHasMore(result.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar rutas')
      showSnackbar('Error al cargar rutas', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadRoutes()
      return
    }

    try {
      setLoading(true)
      const result = await routeService.searchRoutes(searchTerm, rowsPerPage)
      setRoutes(result.routes)
      setTotalRoutes(result.total)
      setHasMore(result.hasMore)
    } catch (err) {
      showSnackbar('Error al buscar rutas', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = routes.map((route) => route.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleRowClick = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleToggleStatus = async (routeId: string, currentStatus: boolean) => {
    try {
      await routeService.toggleRouteStatus(routeId, !currentStatus)
      loadRoutes()
      showSnackbar(
        `Ruta ${!currentStatus ? 'activada' : 'desactivada'} exitosamente`,
        'success'
      )
    } catch (err) {
      showSnackbar('Error al cambiar estado de la ruta', 'error')
    }
  }

  const handleDeleteRoute = async (routeId: string) => {
    try {
      await routeService.deleteRoute(routeId)
      loadRoutes()
      showSnackbar('Ruta eliminada exitosamente', 'success')
      setDeleteDialogOpen(false)
    } catch (err) {
      showSnackbar('Error al eliminar ruta', 'error')
    }
  }

  const handleDeleteMultiple = async () => {
    try {
      await routeService.deleteMultipleRoutes(selected)
      loadRoutes()
      setSelected([])
      showSnackbar(`${selected.length} rutas eliminadas exitosamente`, 'success')
      setDeleteDialogOpen(false)
    } catch (err) {
      showSnackbar('Error al eliminar rutas', 'error')
    }
  }

  const handleCreateSampleData = async () => {
    try {
      setLoading(true)
      await routeService.createSampleRoutes()
      loadRoutes()
      showSnackbar('Datos de prueba creados exitosamente', 'success')
    } catch (err) {
      showSnackbar('Error al crear datos de prueba', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity })
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const getStatusColor = (active: boolean): 'success' | 'error' => {
    return active ? 'success' : 'error'
  }

  const getStatusText = (active: boolean): string => {
    return active ? 'Activa' : 'Inactiva'
  }

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" className="text-gray-900">
            Gestión de Rutas
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Administra las rutas disponibles
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Nueva Ruta
          </Button>
          {routes.length === 0 && !loading && (
            <Button
              variant="outlined"
              onClick={handleCreateSampleData}
              disabled={loading}
            >
              Crear Datos de Prueba
            </Button>
          )}
        </Stack>
      </Box>

      {/* Filters and Search */}
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="Buscar por nombre, origen o destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                size="small"
                className="flex-1"
                InputProps={{
                  startAdornment: <SearchIcon className="mr-2 text-gray-400" />,
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterListIcon />}
              >
                Filtros
              </Button>
            </Stack>

            {/* Filtros avanzados */}
            {showFilters && (
              <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <TextField
                  label="Origen"
                  size="small"
                  value={filters.origin || ''}
                  onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Destino"
                  size="small"
                  value={filters.destination || ''}
                  onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  fullWidth
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filters.active !== undefined ? filters.active.toString() : ''}
                    label="Estado"
                    onChange={(e) => {
                      const value = e.target.value
                      setFilters({
                        ...filters,
                        active: value === '' ? undefined : value === 'true'
                      })
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="true">Activas</MenuItem>
                    <MenuItem value="false">Inactivas</MenuItem>
                  </Select>
                </FormControl>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Precio mín"
                    type="number"
                    size="small"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) || undefined })}
                  />
                  <TextField
                    label="Precio máx"
                    type="number"
                    size="small"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) || undefined })}
                  />
                </Stack>
              </Box>
            )}

            {/* Acciones en lote */}
            {selected.length > 0 && (
              <Box className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                <Typography variant="body2" color="text.secondary">
                  {selected.length} rutas seleccionadas
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                  startIcon={<DeleteIcon />}
                >
                  Eliminar seleccionadas
                </Button>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Routes Table */}
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
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Ruta</TableCell>
                <TableCell>Paradas</TableCell>
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
                routes.map((route) => {
                  const isItemSelected = isSelected(route.id)
                  
                  return (
                    <TableRow
                      key={route.id}
                      hover
                      onClick={() => handleRowClick(route.id)}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
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
                                setSelectedRoute(route)
                                setViewDialogOpen(true)
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
                                setSelectedRoute(route)
                                setEditDialogOpen(true)
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
                                handleToggleStatus(route.id, route.active)
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
                                setSelectedRoute(route)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalRoutes}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selected.length > 0 ? 'Eliminar rutas seleccionadas' : 'Eliminar ruta'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {selected.length > 0
              ? `¿Estás seguro de que deseas eliminar ${selected.length} rutas seleccionadas?`
              : `¿Estás seguro de que deseas eliminar la ruta "${selectedRoute?.name}"?`
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-2">
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={selected.length > 0 ? handleDeleteMultiple : () => selectedRoute && handleDeleteRoute(selectedRoute.id)}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Route Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles de la Ruta - {selectedRoute?.name}
        </DialogTitle>
        <DialogContent>
          {selectedRoute && (
                         <Box className="space-y-4 mt-4">
               <Box className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                 <Box className="flex-1">
                   <Typography variant="subtitle2" className="text-gray-600">
                     Información General
                   </Typography>
                   <Box className="mt-2 space-y-2">
                     <Typography><strong>Nombre:</strong> {selectedRoute.name}</Typography>
                     <Typography><strong>Origen:</strong> {selectedRoute.origin.name}, {selectedRoute.origin.city}</Typography>
                     <Typography><strong>Destino:</strong> {selectedRoute.destination.name}, {selectedRoute.destination.city}</Typography>
                     <Typography><strong>Distancia:</strong> {selectedRoute.distance} km</Typography>
                     <Typography><strong>Duración:</strong> {selectedRoute.duration}</Typography>
                     <Typography><strong>Precio:</strong> ${selectedRoute.price}</Typography>
                   </Box>
                 </Box>
                 <Box className="flex-1">
                   <Typography variant="subtitle2" className="text-gray-600">
                     Paradas Intermedias
                   </Typography>
                   <Box className="mt-2">
                     {selectedRoute.stops.length > 0 ? (
                       selectedRoute.stops.map((stop, index) => (
                         <Typography key={stop.id} variant="body2">
                           {index + 1}. {stop.name}, {stop.city} - {stop.estimatedTime}
                         </Typography>
                       ))
                     ) : (
                       <Typography variant="body2" color="text.secondary">
                         No hay paradas intermedias
                       </Typography>
                     )}
                   </Box>
                 </Box>
               </Box>
              
              {selectedRoute.description && (
                <Box>
                  <Typography variant="subtitle2" className="text-gray-600">
                    Descripción
                  </Typography>
                  <Typography variant="body2" className="mt-1">
                    {selectedRoute.description}
                  </Typography>
                </Box>
              )}

              {selectedRoute.amenities && selectedRoute.amenities.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" className="text-gray-600">
                    Servicios Incluidos
                  </Typography>
                  <Box className="mt-2 flex flex-wrap gap-2">
                    {selectedRoute.amenities.map((amenity, index) => (
                      <Chip key={index} label={amenity} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
} 