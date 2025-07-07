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
  VehicleFilters,
  VehicleTable,
  VehicleDialog,
  DeleteConfirmationDialog,
  StatusConfirmationDialog,
  useVehicles,
} from '../components/vehicles'
import { Vehicle } from '../types/vehicle'

export const Vehicles: React.FC = () => {
  const {
    // Estados
    vehicles,
    loading,
    error,
    selected,
    page,
    rowsPerPage,
    totalVehicles,
    filters,
    searchTerm,
    showFilters,
    deleteDialogOpen,
    viewDialogOpen,
    statusDialogOpen,
    selectedVehicle,
    statusAction,
    snackbar,
    
    // Acciones
    handleSearch,
    handleToggleStatus,
    handleDeleteVehicle,
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
    setDeleteDialogOpen,
    setViewDialogOpen,
    setStatusDialogOpen,
    setSelectedVehicle,
    setStatusAction,
    closeSnackbar,
    setError,
  } = useVehicles()

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setViewDialogOpen(true)
  }

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    // TODO: Implementar edición
    console.log('Edit vehicle:', vehicle)
  }

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setDeleteDialogOpen(true)
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
    } else if (selectedVehicle) {
      handleDeleteVehicle(selectedVehicle.id)
    }
  }

  const handleStatusConfirm = () => {
    if (statusAction === 'activate') {
      handleActivateMultiple()
    } else {
      handleDeactivateMultiple()
    }
  }

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" className="text-brand-black">
            Gestión de Vehículos
          </Typography>
          <Typography variant="body1" className="text-secondary-600">
            Administra los tipos de vehículos disponibles para conductores
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => console.log('TODO: Create vehicle')}
            color="primary"
          >
            Nuevo Vehículo
          </Button>
        </Stack>
      </Box>

      {/* Filtros y Búsqueda */}
      <VehicleFilters
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

      {/* Tabla de Vehículos */}
      <VehicleTable
        vehicles={vehicles}
        loading={loading}
        selected={selected}
        page={page}
        rowsPerPage={rowsPerPage}
        totalVehicles={totalVehicles}
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
        vehicle={selectedVehicle}
        selectedCount={selected.length}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Diálogo de Confirmación de Estado */}
      <StatusConfirmationDialog
        open={statusDialogOpen}
        vehicle={selectedVehicle}
        selectedCount={selected.length}
        action={statusAction}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={handleStatusConfirm}
      />

      {/* Diálogo de Detalles de Vehículo */}
      <VehicleDialog
        open={viewDialogOpen}
        vehicle={selectedVehicle}
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