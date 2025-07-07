import { useState, useEffect } from 'react'
import { Vehicle, VehicleFilters, CreateVehicleData } from '../../types/vehicle'
import { vehicleService } from '../../services/vehicleService'

export interface UseVehiclesState {
  // Estados principales
  vehicles: Vehicle[]
  loading: boolean
  error: string | null
  selected: string[]
  
  // Paginación
  page: number
  rowsPerPage: number
  totalVehicles: number
  hasMore: boolean
  
  // Filtros
  filters: VehicleFilters
  searchTerm: string
  showFilters: boolean
  
  // Diálogos
  createDialogOpen: boolean
  editDialogOpen: boolean
  deleteDialogOpen: boolean
  viewDialogOpen: boolean
  statusDialogOpen: boolean
  selectedVehicle: Vehicle | null
  statusAction: 'activate' | 'deactivate'
  
  // Notificaciones
  snackbar: {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
  }
}

export interface UseVehiclesActions {
  // Operaciones de datos
  loadVehicles: () => Promise<void>
  handleSearch: () => Promise<void>
  handleToggleStatus: (vehicleId: string, currentStatus: boolean) => Promise<void>
  handleDeleteVehicle: (vehicleId: string) => Promise<void>
  handleDeleteMultiple: () => Promise<void>
  handleActivateMultiple: () => Promise<void>
  handleDeactivateMultiple: () => Promise<void>
  handleCreateVehicle: (vehicleData: CreateVehicleData) => Promise<void>
  
  // Selección
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRowClick: (id: string) => void
  
  // Paginación
  handleChangePage: (event: unknown, newPage: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
  
  // Filtros
  setFilters: (filters: VehicleFilters) => void
  setSearchTerm: (term: string) => void
  setShowFilters: (show: boolean) => void
  
  // Diálogos
  setCreateDialogOpen: (open: boolean) => void
  setEditDialogOpen: (open: boolean) => void
  setDeleteDialogOpen: (open: boolean) => void
  setViewDialogOpen: (open: boolean) => void
  setStatusDialogOpen: (open: boolean) => void
  setSelectedVehicle: (vehicle: Vehicle | null) => void
  setStatusAction: (action: 'activate' | 'deactivate') => void
  
  // Notificaciones
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void
  closeSnackbar: () => void
  setError: (error: string | null) => void
}

export const useVehicles = (): UseVehiclesState & UseVehiclesActions => {
  // Estados principales
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  
  // Paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalVehicles, setTotalVehicles] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  
  // Filtros
  const [filters, setFilters] = useState<VehicleFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [statusAction, setStatusAction] = useState<'activate' | 'deactivate'>('activate')
  
  // Notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  })

  // Cargar vehículos
  useEffect(() => {
    loadVehicles()
  }, [page, rowsPerPage, filters])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await vehicleService.getVehicles(filters, rowsPerPage)
      
      setVehicles(result.vehicles)
      setTotalVehicles(result.total)
      setHasMore(result.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar vehículos')
      showSnackbar('Error al cargar vehículos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadVehicles()
      return
    }

    try {
      setLoading(true)
      const result = await vehicleService.searchVehicles(searchTerm, rowsPerPage)
      setVehicles(result.vehicles)
      setTotalVehicles(result.total)
      setHasMore(result.hasMore)
    } catch (err) {
      showSnackbar('Error al buscar vehículos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = vehicles.map((vehicle) => vehicle.id)
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

  const handleToggleStatus = async (vehicleId: string, currentStatus: boolean) => {
    try {
      await vehicleService.toggleVehicleStatus(vehicleId, !currentStatus)
      loadVehicles()
      showSnackbar(
        `Vehículo ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`,
        'success'
      )
    } catch (err) {
      showSnackbar('Error al cambiar estado del vehículo', 'error')
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      await vehicleService.deleteVehicle(vehicleId)
      loadVehicles()
      showSnackbar('Vehículo eliminado exitosamente', 'success')
      setDeleteDialogOpen(false)
    } catch (err) {
      showSnackbar('Error al eliminar vehículo', 'error')
    }
  }

  const handleDeleteMultiple = async () => {
    try {
      await vehicleService.deleteMultipleVehicles(selected)
      loadVehicles()
      setSelected([])
      showSnackbar(`${selected.length} vehículos eliminados exitosamente`, 'success')
      setDeleteDialogOpen(false)
    } catch (err) {
      showSnackbar('Error al eliminar vehículos', 'error')
    }
  }

  const handleActivateMultiple = async () => {
    try {
      await vehicleService.activateMultipleVehicles(selected)
      loadVehicles()
      setSelected([])
      showSnackbar(`${selected.length} vehículos activados exitosamente`, 'success')
      setStatusDialogOpen(false)
    } catch (err) {
      showSnackbar('Error al activar vehículos', 'error')
    }
  }

  const handleDeactivateMultiple = async () => {
    try {
      await vehicleService.deactivateMultipleVehicles(selected)
      loadVehicles()
      setSelected([])
      showSnackbar(`${selected.length} vehículos desactivados exitosamente`, 'success')
      setStatusDialogOpen(false)
    } catch (err) {
      showSnackbar('Error al desactivar vehículos', 'error')
    }
  }

  const handleCreateVehicle = async (vehicleData: CreateVehicleData) => {
    try {
      await vehicleService.createVehicle(vehicleData)
      loadVehicles()
      showSnackbar('Vehículo creado exitosamente', 'success')
      setCreateDialogOpen(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear vehículo'
      showSnackbar(errorMessage, 'error')
      throw err // Re-throw para que el diálogo pueda manejar el error
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
    vehicles,
    loading,
    error,
    selected,
    page,
    rowsPerPage,
    totalVehicles,
    hasMore,
    filters,
    searchTerm,
    showFilters,
    createDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    viewDialogOpen,
    statusDialogOpen,
    selectedVehicle,
    statusAction,
    snackbar,
    
    // Acciones
    loadVehicles,
    handleSearch,
    handleToggleStatus,
    handleDeleteVehicle,
    handleDeleteMultiple,
    handleActivateMultiple,
    handleDeactivateMultiple,
    handleCreateVehicle,
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
    setSelectedVehicle,
    setStatusAction,
    showSnackbar,
    closeSnackbar,
    setError,
  }
} 