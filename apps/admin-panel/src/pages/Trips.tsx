import React, { useState } from 'react'
import { Box, Typography, Alert, Snackbar } from '@mui/material'
import { TripFilters, TripTable, TripDialog, useTrips } from '../components/trips'
import { ConfirmationDialog } from '../components/common'
import { Trip } from '../types/trip'

export const Trips: React.FC = () => {
  const {
    trips,
    loading,
    error,
    selected,
    page,
    rowsPerPage,
    totalTrips,
    filters,
    searchTerm,
    showFilters,
    loadTrips,
    handleSearch,
    handleDeleteTrip,
    handleDeleteMultiple,
    handleSelectAllClick,
    handleRowClick,
    handleChangePage,
    handleChangeRowsPerPage,
    setFilters,
    setSearchTerm,
    setShowFilters,
    closeSnackbar,
    setError,
  } = useTrips()

  // Estados para diálogos
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tripToDelete, setTripToDelete] = useState<string | null>(null)

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  })

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  // Manejadores de acciones
  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip)
    setViewDialogOpen(true)
  }

  const handleEditTrip = (tripId: string) => {
    // TODO: Implementar edición de viaje
    showSnackbar('Funcionalidad de edición en desarrollo', 'info')
  }

  const handleDeleteTripClick = (tripId: string) => {
    setTripToDelete(tripId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (tripToDelete) {
      await handleDeleteTrip(tripToDelete)
      setDeleteDialogOpen(false)
      setTripToDelete(null)
    }
  }

  const handleDeleteMultipleClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleConfirmDeleteMultiple = async () => {
    await handleDeleteMultiple()
    setDeleteDialogOpen(false)
  }

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false)
    setSelectedTrip(null)
  }

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box>
        <Typography variant="h4" className="font-bold text-brand-black dark:text-dark-text-primary">
          Gestión de Viajes
        </Typography>
        <Typography variant="body1" color="text.secondary" className="dark:text-dark-text-secondary">
          Monitorea viajes activos y programados, revisa información histórica y gestiona pasajeros
        </Typography>
      </Box>

      {/* Filtros */}
      <TripFilters
        filters={filters}
        searchTerm={searchTerm}
        showFilters={showFilters}
        selectedCount={selected.length}
        onFiltersChange={setFilters}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onDeleteSelected={handleDeleteMultipleClick}
      />

      {/* Tabla */}
      <TripTable
        trips={trips}
        loading={loading}
        selected={selected}
        page={page}
        rowsPerPage={rowsPerPage}
        totalTrips={totalTrips}
        onSelectAll={handleSelectAllClick}
        onRowClick={handleRowClick}
        onView={handleViewTrip}
        onEdit={handleEditTrip}
        onDelete={handleDeleteTripClick}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

      {/* Diálogo de detalles */}
      <TripDialog
        trip={selectedTrip}
        onClose={handleCloseViewDialog}
        onEdit={handleEditTrip}
        onDelete={handleDeleteTripClick}
      />

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Confirmar Eliminación"
        message={
          tripToDelete
            ? "¿Estás seguro de que quieres eliminar este viaje? Esta acción no se puede deshacer."
            : `¿Estás seguro de que quieres eliminar ${selected.length} viajes seleccionados? Esta acción no se puede deshacer.`
        }
        onConfirm={tripToDelete ? handleConfirmDelete : handleConfirmDeleteMultiple}
        onClose={() => {
          setDeleteDialogOpen(false)
          setTripToDelete(null)
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          className="mt-4"
        >
          {error}
        </Alert>
      )}
    </Box>
  )
} 