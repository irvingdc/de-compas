import React from 'react'
import {
  Box,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  DriverFilters,
  DriverTable,
  DriverDialog,
  useDrivers,
} from '../components/drivers'
import { ConfirmationDialog } from '../components/common'
import { Driver } from '../types/driver'

export const Drivers: React.FC = () => {
  const {
    // Datos
    drivers,
    loading,
    error,
    selected,
    page,
    rowsPerPage,
    totalDrivers,
    filters,
    searchTerm,
    showFilters,
    selectedDriver,
    snackbar,
    
    // Acciones
    handleSearch,
    handleApproveDriver,
    handleRejectDriver,
    handleDeleteDriver,
    handleDeleteMultiple,
    handleSelectAllClick,
    handleRowClick,
    handleChangePage,
    handleChangeRowsPerPage,
    setFilters,
    setSearchTerm,
    setShowFilters,
    setViewDialogOpen,
    setSelectedDriver,
    closeSnackbar,
    setError,
  } = useDrivers()

  // Estados para diálogos de confirmación
  const [approveDialogOpen, setApproveDialogOpen] = React.useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [driverToAction, setDriverToAction] = React.useState<typeof selectedDriver>(null)

  const handleView = (driver: typeof selectedDriver) => {
    setSelectedDriver(driver)
    setViewDialogOpen(true)
  }

  const handleApprove = (driverId: string) => {
    const driver = drivers.find((d: Driver) => d.id === driverId)
    if (driver) {
      setDriverToAction(driver)
      setApproveDialogOpen(true)
    }
  }

  const handleReject = (driverId: string) => {
    const driver = drivers.find((d: Driver) => d.id === driverId)
    if (driver) {
      setDriverToAction(driver)
      setRejectDialogOpen(true)
    }
  }

  const handleEditDriver = (driver: Driver) => {
    // TODO: Implementar edición
    console.log('Edit driver:', driver.id)
  }

  const handleDeleteDriverLocal = (driver: Driver) => {
    setDriverToAction(driver)
    setDeleteDialogOpen(true)
  }

  const handleEditDriverById = (id: string) => {
    const driver = drivers.find((d: Driver) => d.id === id)
    if (driver) {
      handleEditDriver(driver)
    }
  }

  const handleDeleteDriverById = (id: string) => {
    const driver = drivers.find((d: Driver) => d.id === id)
    if (driver) {
      handleDeleteDriverLocal(driver)
    }
  }

  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true)
  }

  const handleConfirmApprove = async () => {
    if (driverToAction) {
      await handleApproveDriver(driverToAction.id)
      setApproveDialogOpen(false)
      setDriverToAction(null)
    }
  }

  const handleConfirmReject = async () => {
    if (driverToAction) {
      await handleRejectDriver(driverToAction.id)
      setRejectDialogOpen(false)
      setDriverToAction(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (selected.length > 0) {
      await handleDeleteMultiple()
    } else if (driverToAction) {
      await handleDeleteDriver(driverToAction.id)
    }
    setDeleteDialogOpen(false)
    setDriverToAction(null)
  }

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" className="text-brand-black">
          Gestión de Conductores
        </Typography>
        <Typography variant="body1" className="text-secondary-600">
          Revisa y aprueba conductores
        </Typography>
      </Box>

      {/* Filtros y Búsqueda */}
      <DriverFilters
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

      {/* Tabla de Conductores */}
      <DriverTable
        drivers={drivers}
        loading={loading}
        selected={selected}
        page={page}
        rowsPerPage={rowsPerPage}
        totalDrivers={totalDrivers}
        onSelectAll={handleSelectAllClick}
        onRowClick={handleRowClick}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onEdit={handleEditDriver}
        onDelete={handleDeleteDriverLocal}
      />

      {/* Diálogo de Detalles de Conductor */}
      <DriverDialog
        driver={selectedDriver}
        onClose={() => setViewDialogOpen(false)}
        onEdit={handleEditDriverById}
        onDelete={handleDeleteDriverById}
      />

      {/* Diálogos de Confirmación */}
      <ConfirmationDialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={handleConfirmApprove}
        title="Confirmar Aprobación"
        message={`¿Estás seguro de aprobar al conductor ${driverToAction?.name}?`}
        confirmText="Aprobar"
        variant="info"
      />
      <ConfirmationDialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={handleConfirmReject}
        title="Confirmar Rechazo"
        message={`¿Estás seguro de rechazar al conductor ${driverToAction?.name}?`}
        confirmText="Rechazar"
        variant="danger"
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message={
          selected.length > 0
            ? `¿Estás seguro de eliminar ${selected.length} conductor(es) seleccionado(s)?`
            : `¿Estás seguro de eliminar al conductor ${driverToAction?.name}?`
        }
        confirmText="Eliminar"
        variant="danger"
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