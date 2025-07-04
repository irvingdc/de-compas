import { useState, useEffect } from 'react'
import { Trip, TripFilters } from '../../types/trip'

// Mock data - replace with real data from Firebase
const mockTrips: Trip[] = [
  {
    id: '1',
    routeId: 'route-1',
    routeName: 'CDMX - Guadalajara',
    origin: 'Ciudad de México',
    destination: 'Guadalajara',
    driverId: 'driver-1',
    driverName: 'Juan Pérez',
    driverEmail: 'juan.perez@email.com',
    driverPhone: '555-1234',
    passengers: [
      {
        id: 'passenger-1',
        name: 'Ana López',
        email: 'ana.lopez@email.com',
        phone: '555-5678',
        pickupLocation: 'Centro Histórico, CDMX',
        dropoffLocation: 'Centro, GDL',
        seatNumber: 1,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        specialRequests: 'Ventana preferida'
      },
      {
        id: 'passenger-2',
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '555-9012',
        pickupLocation: 'Polanco, CDMX',
        dropoffLocation: 'Zapopan, GDL',
        seatNumber: 2,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'cash'
      }
    ],
    maxPassengers: 3,
    estimatedDeparture: '2024-01-15T08:00:00Z',
    estimatedArrival: '2024-01-15T14:00:00Z',
    actualDeparture: '2024-01-15T08:15:00Z',
    actualArrival: '2024-01-15T14:30:00Z',
    status: 'completed',
    price: 450,
    distance: 540,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    notes: 'Viaje exitoso, pasajeros satisfechos'
  },
  {
    id: '2',
    routeId: 'route-2',
    routeName: 'Monterrey - CDMX',
    origin: 'Monterrey',
    destination: 'Ciudad de México',
    driverId: 'driver-2',
    driverName: 'María García',
    driverEmail: 'maria.garcia@email.com',
    driverPhone: '555-3456',
    passengers: [
      {
        id: 'passenger-3',
        name: 'Luis Martínez',
        email: 'luis.martinez@email.com',
        phone: '555-7890',
        pickupLocation: 'Centro, MTY',
        dropoffLocation: 'Roma Norte, CDMX',
        seatNumber: 1,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'transfer'
      }
    ],
    maxPassengers: 3,
    estimatedDeparture: '2024-01-16T06:00:00Z',
    estimatedArrival: '2024-01-16T12:00:00Z',
    status: 'in_progress',
    price: 380,
    distance: 720,
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-16T06:00:00Z'
  },
  {
    id: '3',
    routeId: 'route-3',
    routeName: 'Puebla - CDMX',
    origin: 'Puebla',
    destination: 'Ciudad de México',
    driverId: 'driver-3',
    driverName: 'Roberto Silva',
    driverEmail: 'roberto.silva@email.com',
    driverPhone: '555-1111',
    passengers: [
      {
        id: 'passenger-4',
        name: 'Sofia Torres',
        email: 'sofia.torres@email.com',
        phone: '555-2222',
        pickupLocation: 'Centro, PUE',
        dropoffLocation: 'Condesa, CDMX',
        seatNumber: 1,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'card'
      },
      {
        id: 'passenger-5',
        name: 'Diego Herrera',
        email: 'diego.herrera@email.com',
        phone: '555-3333',
        pickupLocation: 'Angelópolis, PUE',
        dropoffLocation: 'Coyoacán, CDMX',
        seatNumber: 2,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'cash'
      },
      {
        id: 'passenger-6',
        name: 'Carmen Vega',
        email: 'carmen.vega@email.com',
        phone: '555-4444',
        pickupLocation: 'Cholula, PUE',
        dropoffLocation: 'San Ángel, CDMX',
        seatNumber: 3,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'transfer'
      }
    ],
    maxPassengers: 3,
    estimatedDeparture: '2024-01-17T07:00:00Z',
    estimatedArrival: '2024-01-17T09:00:00Z',
    status: 'scheduled',
    price: 180,
    distance: 135,
    createdAt: '2024-01-14T16:00:00Z',
    updatedAt: '2024-01-14T16:00:00Z'
  },
  {
    id: '4',
    routeId: 'route-4',
    routeName: 'CDMX - Querétaro',
    origin: 'Ciudad de México',
    destination: 'Querétaro',
    driverId: 'driver-1',
    driverName: 'Juan Pérez',
    driverEmail: 'juan.perez@email.com',
    driverPhone: '555-1234',
    passengers: [],
    maxPassengers: 3,
    estimatedDeparture: '2024-01-18T09:00:00Z',
    estimatedArrival: '2024-01-18T11:00:00Z',
    status: 'cancelled',
    price: 220,
    distance: 200,
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-16T18:00:00Z',
    cancellationReason: 'Conductor no disponible'
  }
]

export interface UseTripsState {
  trips: Trip[]
  loading: boolean
  error: string | null
  selected: string[]
  
  // Paginación
  page: number
  rowsPerPage: number
  totalTrips: number
  
  // Filtros
  filters: TripFilters
  searchTerm: string
  showFilters: boolean
}

export interface UseTripsActions {
  // Datos
  loadTrips: () => Promise<void>
  handleSearch: () => Promise<void>
  handleDeleteTrip: (tripId: string) => Promise<void>
  handleDeleteMultiple: () => Promise<void>
  
  // Selección
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRowClick: (id: string) => void
  
  // Paginación
  handleChangePage: (event: unknown, newPage: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
  
  // Filtros
  setFilters: (filters: TripFilters) => void
  setSearchTerm: (term: string) => void
  setShowFilters: (show: boolean) => void
  
  // Estados
  setSelectedTrip: (trip: Trip | null) => void
  setViewDialogOpen: (open: boolean) => void
  closeSnackbar: () => void
  setError: (error: string | null) => void
}

export const useTrips = (): UseTripsState & UseTripsActions => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  
  // Paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalTrips, setTotalTrips] = useState(0)
  
  // Filtros
  const [filters, setFilters] = useState<TripFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Estados para diálogos
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  })

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  // Cargar viajes
  const loadTrips = async () => {
    try {
      setLoading(true)
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredTrips = [...mockTrips]
      
      // Aplicar filtros
      if (filters.status && filters.status !== 'all') {
        filteredTrips = filteredTrips.filter(trip => trip.status === filters.status)
      }
      
      if (filters.origin) {
        filteredTrips = filteredTrips.filter(trip => 
          trip.origin.toLowerCase().includes(filters.origin!.toLowerCase())
        )
      }
      
      if (filters.destination) {
        filteredTrips = filteredTrips.filter(trip => 
          trip.destination.toLowerCase().includes(filters.destination!.toLowerCase())
        )
      }
      
      if (filters.driverId) {
        filteredTrips = filteredTrips.filter(trip => trip.driverId === filters.driverId)
      }
      
      if (searchTerm) {
        filteredTrips = filteredTrips.filter(trip =>
          trip.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      setTrips(filteredTrips)
      setTotalTrips(filteredTrips.length)
      setError(null)
    } catch (err) {
      setError('Error al cargar los viajes')
      console.error('Error loading trips:', err)
    } finally {
      setLoading(false)
    }
  }

  // Búsqueda
  const handleSearch = async () => {
    await loadTrips()
  }

  // Eliminar viaje
  const handleDeleteTrip = async (tripId: string) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTrips(prev => prev.filter(trip => trip.id !== tripId))
      setSelected(prev => prev.filter(id => id !== tripId))
      
      showSnackbar('Viaje eliminado exitosamente', 'success')
    } catch (err) {
      showSnackbar('Error al eliminar el viaje', 'error')
      console.error('Error deleting trip:', err)
    }
  }

  // Eliminar múltiples
  const handleDeleteMultiple = async () => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTrips(prev => prev.filter(trip => !selected.includes(trip.id)))
      setSelected([])
      
      showSnackbar(`${selected.length} viajes eliminados exitosamente`, 'success')
    } catch (err) {
      showSnackbar('Error al eliminar los viajes', 'error')
      console.error('Error deleting multiple trips:', err)
    }
  }

  // Selección
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = trips.map((trip) => trip.id)
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
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }

  // Paginación
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Cargar datos iniciales
  useEffect(() => {
    loadTrips()
  }, [filters])

  return {
    // Estado
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
    
    // Acciones
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
    setSelectedTrip,
    setViewDialogOpen,
    closeSnackbar,
    setError,
  }
} 