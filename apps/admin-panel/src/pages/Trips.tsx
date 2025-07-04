import React, { useState } from 'react'
import { Box, Typography, Alert } from '@mui/material'
import { TripFilters, TripTable, TripDialog, useTrips } from '../components/trips'
import { Trip } from '../types/trip'

export const Trips: React.FC = () => {
  const {
    trips,
    loading,
    error,
    page,
    rowsPerPage,
    totalTrips,
    filters,
    searchTerm,
    showFilters,
    handleSearch,
    handleChangePage,
    handleChangeRowsPerPage,
    setFilters,
    setSearchTerm,
    setShowFilters,
    setError,
  } = useTrips()

  // Estados para diálogos
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)

  // Manejadores de acciones
  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip)
  }

  const handleCloseViewDialog = () => {
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
        onFiltersChange={setFilters}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Tabla */}
      <TripTable
        trips={trips}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalTrips={totalTrips}
        onView={handleViewTrip}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

      {/* Diálogo de detalles */}
      <TripDialog
        trip={selectedTrip}
        onClose={handleCloseViewDialog}
      />

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