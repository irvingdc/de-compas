import React from 'react'
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Add as AddIcon,
} from '@mui/icons-material'
import {
  RouteFilters,
  RouteTable,
  RouteDialog,
  DeleteConfirmationDialog,
  useRoutes,
} from '../components/routes'
import { Route } from '../types/route'

export const Routes: React.FC = () => {
  const {
    // Estados
    routes,
    loading,
    error,
    selected,
    page,
    rowsPerPage,
    totalRoutes,
    filters,
    searchTerm,
    showFilters,
    deleteDialogOpen,
    viewDialogOpen,
    selectedRoute,
    snackbar,
    
    // Acciones
    handleSearch,
    handleToggleStatus,
    handleDeleteRoute,
    handleDeleteMultiple,
    handleSelectAllClick,
    handleRowClick,
    handleChangePage,
    handleChangeRowsPerPage,
    setFilters,
    setSearchTerm,
    setShowFilters,
    setDeleteDialogOpen,
    setViewDialogOpen,
    setSelectedRoute,
    closeSnackbar,
    setError,
  } = useRoutes()

  const handleView = (route: Route) => {
    setSelectedRoute(route)
    setViewDialogOpen(true)
  }

  const handleEdit = (route: Route) => {
    setSelectedRoute(route)
    // TODO: Implementar edición
    console.log('Edit route:', route)
  }

  const handleDelete = (route: Route) => {
    setSelectedRoute(route)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selected.length > 0) {
      handleDeleteMultiple()
    } else if (selectedRoute) {
      handleDeleteRoute(selectedRoute.id)
    }
  }

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" className="text-brand-black">
            Gestión de Rutas
          </Typography>
          <Typography variant="body1" className="text-secondary-600">
            Administra las rutas disponibles
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => console.log('TODO: Create route')}
            color="primary"
          >
            Nueva Ruta
          </Button>
        </Stack>
      </Box>

      {/* Filtros y Búsqueda */}
      <RouteFilters
        filters={filters}
        searchTerm={searchTerm}
        showFilters={showFilters}
        selectedCount={selected.length}
        onFiltersChange={setFilters}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Mensaje de Error */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabla de Rutas */}
      <RouteTable
        routes={routes}
        loading={loading}
        selected={selected}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRoutes={totalRoutes}
        onSelectAll={handleSelectAllClick}
        onRowClick={handleRowClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        route={selectedRoute}
        selectedCount={selected.length}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Diálogo de Detalles de Ruta */}
      <RouteDialog
        open={viewDialogOpen}
        route={selectedRoute}
        onClose={() => setViewDialogOpen(false)}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
} 