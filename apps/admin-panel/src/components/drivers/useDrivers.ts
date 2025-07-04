import { useState, useEffect } from 'react'
import { Driver } from './DriverRow'
import { DriverFilters } from './DriverFilters'

export interface UseDriversState {
  // Estados principales
  drivers: Driver[]
  loading: boolean
  error: string | null
  selected: number[]
  
  // Paginación
  page: number
  rowsPerPage: number
  totalDrivers: number
  
  // Filtros
  filters: DriverFilters
  searchTerm: string
  showFilters: boolean
  
  // Diálogos
  viewDialogOpen: boolean
  selectedDriver: Driver | null
  
  // Notificaciones
  snackbar: {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
  }
}

export interface UseDriversActions {
  // Operaciones de datos
  loadDrivers: () => Promise<void>
  handleSearch: () => Promise<void>
  handleApproveDriver: (driverId: number) => Promise<void>
  handleRejectDriver: (driverId: number) => Promise<void>
  handleDeleteDriver: (driverId: number) => Promise<void>
  handleDeleteMultiple: () => Promise<void>
  
  // Selección
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRowClick: (id: number) => void
  
  // Paginación
  handleChangePage: (event: unknown, newPage: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
  
  // Filtros
  setFilters: (filters: DriverFilters) => void
  setSearchTerm: (term: string) => void
  setShowFilters: (show: boolean) => void
  
  // Diálogos
  setViewDialogOpen: (open: boolean) => void
  setSelectedDriver: (driver: Driver | null) => void
  
  // Notificaciones
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void
  closeSnackbar: () => void
  setError: (error: string | null) => void
}

export const useDrivers = (): UseDriversState & UseDriversActions => {
  // Estados principales
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  
  // Paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalDrivers, setTotalDrivers] = useState(0)
  
  // Filtros
  const [filters, setFilters] = useState<DriverFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Diálogos
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  
  // Notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  })

  // Datos mock para demo
  const mockDrivers: Driver[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+52 55 1234 5678',
      status: 'pending',
      documentsComplete: true,
      registeredAt: '2024-01-15',
      licenseNumber: 'ABC123456',
      vehicleType: 'Sedan',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@example.com',
      phone: '+52 33 9876 5432',
      status: 'approved',
      documentsComplete: true,
      registeredAt: '2024-01-10',
      licenseNumber: 'DEF789012',
      vehicleType: 'SUV',
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      phone: '+52 81 5555 0123',
      status: 'rejected',
      documentsComplete: false,
      registeredAt: '2024-01-12',
      licenseNumber: 'GHI345678',
      vehicleType: 'Hatchback',
      rating: 3.2,
    },
  ]

  // Cargar conductores
  useEffect(() => {
    loadDrivers()
  }, [page, rowsPerPage, filters])

  const loadDrivers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredDrivers = mockDrivers

      // Aplicar filtros
      if (filters.status && filters.status !== 'all') {
        filteredDrivers = filteredDrivers.filter(driver => driver.status === filters.status)
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        filteredDrivers = filteredDrivers.filter(driver => 
          driver.name.toLowerCase().includes(searchLower) ||
          driver.email.toLowerCase().includes(searchLower)
        )
      }

      // Aplicar paginación
      const startIndex = page * rowsPerPage
      const endIndex = startIndex + rowsPerPage
      const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex)
      
      setDrivers(paginatedDrivers)
      setTotalDrivers(filteredDrivers.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar conductores')
      showSnackbar('Error al cargar conductores', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadDrivers()
      return
    }

    try {
      setLoading(true)
      const filteredDrivers = mockDrivers.filter(driver => 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      setDrivers(filteredDrivers)
      setTotalDrivers(filteredDrivers.length)
    } catch (err) {
      showSnackbar('Error al buscar conductores', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = drivers.map((driver) => driver.id)
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

  const handleApproveDriver = async (driverId: number) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setDrivers(prev => prev.map(driver => 
        driver.id === driverId 
          ? { ...driver, status: 'approved' as const }
          : driver
      ))
      
      showSnackbar('Conductor aprobado exitosamente', 'success')
    } catch (err) {
      showSnackbar('Error al aprobar conductor', 'error')
    }
  }

  const handleRejectDriver = async (driverId: number) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setDrivers(prev => prev.map(driver => 
        driver.id === driverId 
          ? { ...driver, status: 'rejected' as const }
          : driver
      ))
      
      showSnackbar('Conductor rechazado exitosamente', 'success')
    } catch (err) {
      showSnackbar('Error al rechazar conductor', 'error')
    }
  }

  const handleDeleteDriver = async (driverId: number) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setDrivers(prev => prev.filter(driver => driver.id !== driverId))
      setSelected(prev => prev.filter(id => id !== driverId))
      
      showSnackbar('Conductor eliminado exitosamente', 'success')
    } catch (err) {
      showSnackbar('Error al eliminar conductor', 'error')
    }
  }

  const handleDeleteMultiple = async () => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setDrivers(prev => prev.filter(driver => !selected.includes(driver.id)))
      setSelected([])
      
      showSnackbar(`${selected.length} conductores eliminados exitosamente`, 'success')
    } catch (err) {
      showSnackbar('Error al eliminar conductores', 'error')
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
    viewDialogOpen,
    selectedDriver,
    snackbar,
    
    // Acciones
    loadDrivers,
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
    showSnackbar,
    closeSnackbar,
    setError,
  }
} 