import React from 'react'
import {
  Box,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  TravelerFilters,
  TravelerTable,
  TravelerDialog,
  useTravelers,
} from '../components/travelers'
import { ConfirmationDialog } from '../components/common'
import { Traveler } from '../types/traveler'

export const Travelers: React.FC = () => {
  const {
    // Estados
    travelers,
    loading,
    error,
    selected,
    page,
    rowsPerPage,
    totalTravelers,
    filters,
    searchTerm,
    showFilters,
    viewDialogOpen,
    selectedTraveler,
    snackbar,
    
    // Acciones
    handleSearch,
    handleToggleStatus,
    handleDeleteTraveler,
    handleDeleteMultiple,
    handleSelectAllClick,
    handleRowClick,
    handleChangePage,
    handleChangeRowsPerPage,
    setFilters,
    setSearchTerm,
    setShowFilters,
    setViewDialogOpen,
    setSelectedTraveler,
    closeSnackbar,
    setError,
  } = useTravelers()

  // Estados para diálogos de confirmación
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = React.useState(false)
  const [travelerToAction, setTravelerToAction] = React.useState<typeof selectedTraveler>(null)

  const handleView = (traveler: typeof selectedTraveler) => {
    setSelectedTraveler(traveler)
    setViewDialogOpen(true)
  }

  const handleEditTraveler = (traveler: Traveler) => {
    // TODO: Implementar edición
    console.log('Edit traveler:', traveler.id)
  }

  const handleEditTravelerById = (id: string) => {
    const traveler = travelers.find((t: Traveler) => t.id === id)
    if (traveler) {
      handleEditTraveler(traveler)
    }
  }

  const handleDeleteTravelerLocal = (traveler: Traveler) => {
    setTravelerToAction(traveler)
    setDeleteDialogOpen(true)
  }

  const handleDeleteTravelerById = (id: string) => {
    const traveler = travelers.find((t: Traveler) => t.id === id)
    if (traveler) {
      handleDeleteTravelerLocal(traveler)
    }
  }

  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true)
  }

  const handleToggleStatusAction = (travelerId: string) => {
    const traveler = travelers.find((t: Traveler) => t.id === travelerId)
    if (traveler) {
      setTravelerToAction(traveler)
      setToggleStatusDialogOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (selected.length > 0) {
      await handleDeleteMultiple()
    } else if (travelerToAction) {
      await handleDeleteTraveler(travelerToAction.id)
    }
    setDeleteDialogOpen(false)
    setTravelerToAction(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (travelerToAction) {
      await handleToggleStatus(travelerToAction.id)
      setToggleStatusDialogOpen(false)
      setTravelerToAction(null)
    }
  }

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" className="text-brand-black">
          Gestión de Viajeros
        </Typography>
        <Typography variant="body1" className="text-secondary-600">
          Administra los viajeros registrados
        </Typography>
      </Box>

      {/* Filtros y Búsqueda */}
      <TravelerFilters
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

      {/* Tabla de Viajeros */}
      <TravelerTable
        travelers={travelers}
        loading={loading}
        selected={selected}
        page={page}
        rowsPerPage={rowsPerPage}
        totalTravelers={totalTravelers}
        onSelectAll={handleSelectAllClick}
        onRowClick={handleRowClick}
        onView={handleView}
        onEdit={handleEditTraveler}
        onDelete={handleDeleteTravelerById}
        onToggleStatus={handleToggleStatusAction}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

      {/* Diálogo de Detalles de Viajero */}
      <TravelerDialog
        open={viewDialogOpen}
        traveler={selectedTraveler}
        onClose={() => setViewDialogOpen(false)}
        onEdit={handleEditTravelerById}
        onToggleStatus={handleToggleStatusAction}
        onDelete={handleDeleteTravelerById}
      />

      {/* Diálogos de Confirmación */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message={
          selected.length > 0
            ? `¿Estás seguro de eliminar ${selected.length} viajero(s) seleccionado(s)?`
            : `¿Estás seguro de eliminar al viajero ${travelerToAction?.name}?`
        }
        confirmText="Eliminar"
        variant="danger"
      />
      <ConfirmationDialog
        open={toggleStatusDialogOpen}
        onClose={() => setToggleStatusDialogOpen(false)}
        onConfirm={handleConfirmToggleStatus}
        title="Confirmar Cambio de Estado"
        message={`¿Estás seguro de ${travelerToAction?.status === 'active' ? 'suspender' : 'activar'} al viajero ${travelerToAction?.name}?`}
        confirmText={travelerToAction?.status === 'active' ? 'Suspender' : 'Activar'}
        variant={travelerToAction?.status === 'active' ? 'warning' : 'info'}
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