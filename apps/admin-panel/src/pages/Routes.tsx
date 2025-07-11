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
  CreateRouteDialog,
  DeleteConfirmationDialog,
  StatusConfirmationDialog,
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
    createDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    viewDialogOpen,
    statusDialogOpen,
    selectedRoute,
    statusAction,
    snackbar,
    
    // Acciones
    handleSearch,
    handleCreateRoute,
    handleUpdateRoute,
    handleToggleStatus,
    handleDeleteRoute,
    handleDeleteMultiple,
    handleActivateMultiple,
    handleDeactivateMultiple,
    handleSelectAllClick,
    handleRowClick,
    handleChangePage,
    handleChangeRowsPerPage,
    setFilters,
    setSearchTerm,
    setShowFilters,
    setCreateDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
    setViewDialogOpen,
    setStatusDialogOpen,
    setSelectedRoute,
    setStatusAction,
    closeSnackbar,
    setError,
  } = useRoutes()

  const handleView = (route: Route) => {
    setSelectedRoute(route)
    setViewDialogOpen(true)
  }

  const handleEdit = (route: Route) => {
    setSelectedRoute(route)
    setEditDialogOpen(true)
  }

  const handleDelete = (route: Route) => {
    setSelectedRoute(route)
    setDeleteDialogOpen(true)
  }

  const handleToggleStatusAction = (route: Route) => {
    setSelectedRoute(route)
    setStatusAction(route.active ? 'deactivate' : 'activate')
    setStatusDialogOpen(true)
  }

  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true)
  }

  const handleActivateSelected = () => {
    setStatusAction('activate')
    setStatusDialogOpen(true)
  }

  const handleDeactivateSelected = () => {
    setStatusAction('deactivate')
    setStatusDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selected.length > 0) {
      handleDeleteMultiple()
    } else if (selectedRoute) {
      handleDeleteRoute(selectedRoute.id)
    }
  }

  const handleStatusConfirm = () => {
    if (selected.length > 0) {
      if (statusAction === 'activate') {
        handleActivateMultiple()
      } else {
        handleDeactivateMultiple()
      }
    } else if (selectedRoute) {
      handleToggleStatus(selectedRoute.id, selectedRoute.active)
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
            onClick={() => setCreateDialogOpen(true)}
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
        onActivateSelected={handleActivateSelected}
        onDeactivateSelected={handleDeactivateSelected}
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
        onToggleStatus={handleToggleStatusAction}
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

      {/* Diálogo de Confirmación de Estado */}
      <StatusConfirmationDialog
        open={statusDialogOpen}
        route={selectedRoute}
        selectedCount={selected.length}
        action={statusAction}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={handleStatusConfirm}
      />

      {/* Diálogo de Crear Ruta */}
      <CreateRouteDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateRoute}
      />

      {/* Diálogo de Editar Ruta */}
      <CreateRouteDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleCreateRoute}
        editRoute={selectedRoute}
        onUpdate={handleUpdateRoute}
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