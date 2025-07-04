import { useState, useEffect } from 'react'
import { Traveler } from './TravelerRow'
import { TravelerFilters } from './TravelerFilters'

export interface UseTravelersState {
  // Estados principales
  travelers: Traveler[]
  loading: boolean
  error: string | null
  selected: number[]
  
  // Paginación
  page: number
  rowsPerPage: number
  totalTravelers: number
  
  // Filtros
  filters: TravelerFilters
  searchTerm: string
  showFilters: boolean
  
  // Diálogos
  viewDialogOpen: boolean
  selectedTraveler: Traveler | null
  
  // Notificaciones
  snackbar: {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
  }
}

export interface UseTravelersActions {
  // Operaciones de datos
  loadTravelers: () => Promise<void>
  handleSearch: () => Promise<void>
  handleToggleStatus: (travelerId: number) => Promise<void>
  handleDeleteTraveler: (travelerId: number) => Promise<void>
  handleDeleteMultiple: () => Promise<void>
  
  // Selección
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRowClick: (id: number) => void
  
  // Paginación
  handleChangePage: (event: unknown, newPage: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
  
  // Filtros
  setFilters: (filters: TravelerFilters) => void
  setSearchTerm: (term: string) => void
  setShowFilters: (show: boolean) => void
  
  // Diálogos
  setViewDialogOpen: (open: boolean) => void
  setSelectedTraveler: (traveler: Traveler | null) => void
  
  // Notificaciones
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void
  closeSnackbar: () => void
  setError: (error: string | null) => void
}

export const useTravelers = (): UseTravelersState & UseTravelersActions => {
  // Estados principales
  const [travelers, setTravelers] = useState<Traveler[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  
  // Paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalTravelers, setTotalTravelers] = useState(0)
  
  // Filtros
  const [filters, setFilters] = useState<TravelerFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Diálogos
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedTraveler, setSelectedTraveler] = useState<Traveler | null>(null)
  
  // Notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  })

  // Datos mock para demo
  const mockTravelers: Traveler[] = [
    {
      id: 1,
      name: 'Ana Martínez',
      email: 'ana@example.com',
      phone: '+52 55 1111 2222',
      status: 'active',
      registeredAt: '2024-01-10',
      lastTrip: '2024-01-20',
      totalTrips: 15,
      rating: 4.8,
      location: 'Ciudad de México',
      preferences: ['Música', 'Aire acondicionado', 'Conductor amigable'],
    },
    {
      id: 2,
      name: 'Luis González',
      email: 'luis@example.com',
      phone: '+52 33 3333 4444',
      status: 'active',
      registeredAt: '2023-12-15',
      lastTrip: '2024-01-22',
      totalTrips: 28,
      rating: 4.9,
      location: 'Guadalajara',
      preferences: ['WiFi', 'Asientos cómodos', 'Conductor puntual'],
    },
    {
      id: 3,
      name: 'Carmen Rodríguez',
      email: 'carmen@example.com',
      phone: '+52 81 5555 6666',
      status: 'inactive',
      registeredAt: '2024-01-05',
      lastTrip: '2024-01-15',
      totalTrips: 3,
      rating: 4.2,
      location: 'Monterrey',
      preferences: ['Precio económico'],
    },
    {
      id: 4,
      name: 'Roberto Silva',
      email: 'roberto@example.com',
      phone: '+52 55 7777 8888',
      status: 'suspended',
      registeredAt: '2023-11-20',
      lastTrip: '2024-01-10',
      totalTrips: 8,
      rating: 3.5,
      location: 'Ciudad de México',
      preferences: [],
    },
    {
      id: 5,
      name: 'Patricia López',
      email: 'patricia@example.com',
      phone: '+52 33 9999 0000',
      status: 'active',
      registeredAt: '2024-01-12',
      lastTrip: '2024-01-21',
      totalTrips: 12,
      rating: 4.7,
      location: 'Guadalajara',
      preferences: ['Música clásica', 'Conductor profesional'],
    },
    {
      id: 6,
      name: 'Miguel Torres',
      email: 'miguel@example.com',
      phone: '+52 81 1111 3333',
      status: 'active',
      registeredAt: '2023-10-05',
      lastTrip: '2024-01-23',
      totalTrips: 35,
      rating: 5.0,
      location: 'Monterrey',
      preferences: ['Servicio premium', 'Conductor certificado', 'Vehículo de lujo'],
    },
  ]

  // Cargar viajeros
  useEffect(() => {
    loadTravelers()
  }, [page, rowsPerPage, filters])

  const loadTravelers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredTravelers = mockTravelers

      // Aplicar filtros
      if (filters.status && filters.status !== 'all') {
        filteredTravelers = filteredTravelers.filter(traveler => traveler.status === filters.status)
      }



      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        filteredTravelers = filteredTravelers.filter(traveler => 
          traveler.name.toLowerCase().includes(searchLower) ||
          traveler.email.toLowerCase().includes(searchLower) ||
          traveler.location?.toLowerCase().includes(searchLower)
        )
      }

      // Aplicar paginación
      const startIndex = page * rowsPerPage
      const endIndex = startIndex + rowsPerPage
      const paginatedTravelers = filteredTravelers.slice(startIndex, endIndex)
      
      setTravelers(paginatedTravelers)
      setTotalTravelers(filteredTravelers.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar viajeros')
      showSnackbar('Error al cargar viajeros', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadTravelers()
      return
    }

    try {
      setLoading(true)
      const filteredTravelers = mockTravelers.filter(traveler => 
        traveler.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        traveler.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        traveler.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      setTravelers(filteredTravelers)
      setTotalTravelers(filteredTravelers.length)
    } catch (err) {
      showSnackbar('Error al buscar viajeros', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = travelers.map((traveler) => traveler.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleRowClick = (id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: number[] = []

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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleToggleStatus = async (travelerId: number) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTravelers(prev => prev.map(traveler => {
        if (traveler.id === travelerId) {
          const newStatus = traveler.status === 'active' ? 'suspended' : 'active'
          return { ...traveler, status: newStatus }
        }
        return traveler
      }))
      
      const traveler = travelers.find(t => t.id === travelerId)
      const newStatus = traveler?.status === 'active' ? 'suspendido' : 'activado'
      showSnackbar(`Viajero ${newStatus} exitosamente`, 'success')
    } catch (err) {
      showSnackbar('Error al cambiar estado del viajero', 'error')
    }
  }

  const handleDeleteTraveler = async (travelerId: number) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTravelers(prev => prev.filter(traveler => traveler.id !== travelerId))
      setSelected(prev => prev.filter(id => id !== travelerId))
      
      showSnackbar('Viajero eliminado exitosamente', 'success')
    } catch (err) {
      showSnackbar('Error al eliminar viajero', 'error')
    }
  }

  const handleDeleteMultiple = async () => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTravelers(prev => prev.filter(traveler => !selected.includes(traveler.id)))
      setSelected([])
      
      showSnackbar(`${selected.length} viajeros eliminados exitosamente`, 'success')
    } catch (err) {
      showSnackbar('Error al eliminar viajeros', 'error')
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity })
  }

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return {
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
    loadTravelers,
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
    showSnackbar,
    closeSnackbar,
    setError,
  }
} 