import { useState, useEffect } from 'react'
import { Route, RouteFilters } from '../../types/route'
import { routeService } from '../../services/routeService'

export interface UseRoutesState {
  // Estados principales
  routes: Route[]
  loading: boolean
  error: string | null
  selected: string[]
  
  // Paginación
  page: number
  rowsPerPage: number
  totalRoutes: number
  hasMore: boolean
  
  // Filtros
  filters: RouteFilters
  searchTerm: string
  showFilters: boolean
  
  // Diálogos
  createDialogOpen: boolean
  editDialogOpen: boolean
  deleteDialogOpen: boolean
  viewDialogOpen: boolean
  selectedRoute: Route | null
  
  // Notificaciones
  snackbar: {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
  }
}

export interface UseRoutesActions {
  // Operaciones de datos
  loadRoutes: () => Promise<void>
  handleSearch: () => Promise<void>
  handleToggleStatus: (routeId: string, currentStatus: boolean) => Promise<void>
  handleDeleteRoute: (routeId: string) => Promise<void>
  handleDeleteMultiple: () => Promise<void>
  
  // Selección
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRowClick: (id: string) => void
  
  // Paginación
  handleChangePage: (event: unknown, newPage: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
  
  // Filtros
  setFilters: (filters: RouteFilters) => void
  setSearchTerm: (term: string) => void
  setShowFilters: (show: boolean) => void
  
  // Diálogos
  setCreateDialogOpen: (open: boolean) => void
  setEditDialogOpen: (open: boolean) => void
  setDeleteDialogOpen: (open: boolean) => void
  setViewDialogOpen: (open: boolean) => void
  setSelectedRoute: (route: Route | null) => void
  
  // Notificaciones
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void
  closeSnackbar: () => void
  setError: (error: string | null) => void
}

export const useRoutes = (): UseRoutesState & UseRoutesActions => {
  // Estados principales
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  
  // Paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRoutes, setTotalRoutes] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  
  // Filtros
  const [filters, setFilters] = useState<RouteFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  
  // Notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  })

  // Cargar rutas
  useEffect(() => {
    loadRoutes()
  }, [page, rowsPerPage, filters])

  const loadRoutes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await routeService.getRoutes(filters, rowsPerPage)
      
      setRoutes(result.routes)
      setTotalRoutes(result.total)
      setHasMore(result.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar rutas')
      showSnackbar('Error al cargar rutas', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadRoutes()
      return
    }

    try {
      setLoading(true)
      const result = await routeService.searchRoutes(searchTerm, rowsPerPage)
      setRoutes(result.routes)
      setTotalRoutes(result.total)
      setHasMore(result.hasMore)
    } catch (err) {
      showSnackbar('Error al buscar rutas', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = routes.map((route) => route.id)
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

  const handleToggleStatus = async (routeId: string, currentStatus: boolean) => {
    try {
      await routeService.toggleRouteStatus(routeId, !currentStatus)
      loadRoutes()
      showSnackbar(
        `Ruta ${!currentStatus ? 'activada' : 'desactivada'} exitosamente`,
        'success'
      )
    } catch (err) {
      showSnackbar('Error al cambiar estado de la ruta', 'error')
    }
  }

  const handleDeleteRoute = async (routeId: string) => {
    try {
      await routeService.deleteRoute(routeId)
      loadRoutes()
      showSnackbar('Ruta eliminada exitosamente', 'success')
      setDeleteDialogOpen(false)
    } catch (err) {
      showSnackbar('Error al eliminar ruta', 'error')
    }
  }

  const handleDeleteMultiple = async () => {
    try {
      await routeService.deleteMultipleRoutes(selected)
      loadRoutes()
      setSelected([])
      showSnackbar(`${selected.length} rutas eliminadas exitosamente`, 'success')
      setDeleteDialogOpen(false)
    } catch (err) {
      showSnackbar('Error al eliminar rutas', 'error')
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
    routes,
    loading,
    error,
    selected,
    page,
    rowsPerPage,
    totalRoutes,
    hasMore,
    filters,
    searchTerm,
    showFilters,
    createDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    viewDialogOpen,
    selectedRoute,
    snackbar,
    
    // Acciones
    loadRoutes,
    handleSearch,
    handleToggleStatus,
    handleDeleteRoute,
    handleDeleteMultiple,
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
    setSelectedRoute,
    showSnackbar,
    closeSnackbar,
    setError,
  }
} 