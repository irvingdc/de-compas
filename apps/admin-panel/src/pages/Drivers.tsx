import React from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  IconButton, 
  Tooltip,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Checkbox,
} from '@mui/material'
import { 
  Visibility as VisibilityIcon, 
  Check as CheckIcon, 
  Close as CloseIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material'

interface Driver {
  id: number
  name: string
  email: string
  phone: string
  status: 'pending' | 'approved' | 'rejected'
  documentsComplete: boolean
  registeredAt: string
  licenseNumber?: string
  vehicleType?: string
  rating?: number
}

export const Drivers: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = React.useState<Driver | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [filterStatus, setFilterStatus] = React.useState('all')
  const [selected, setSelected] = React.useState<number[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const drivers: Driver[] = [
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

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver)
    setDialogOpen(true)
  }

  const handleApproveDriver = (driverId: number) => {
    console.log('Approving driver:', driverId)
    // Aquí iría la lógica para aprobar el conductor
  }

  const handleRejectDriver = (driverId: number) => {
    console.log('Rejecting driver:', driverId)
    // Aquí iría la lógica para rechazar el conductor
  }

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'approved': return 'Aprobado'
      case 'pending': return 'Pendiente'
      case 'rejected': return 'Rechazado'
      default: return status
    }
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredDrivers.map((driver) => driver.id)
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (id: number) => selected.indexOf(id) !== -1

  const filteredDrivers = filterStatus === 'all' 
    ? drivers 
    : drivers.filter(driver => driver.status === filterStatus)

  const paginatedDrivers = filteredDrivers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Box className="space-y-6">
      {/* Header - Usando Tailwind para layout */}
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" className="text-gray-900">
          Gestión de Conductores
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Revisa y aprueba conductores
        </Typography>
      </Box>

      {/* Actions Bar - Combinando Material UI con Tailwind */}
      <Card className="mb-6">
        <CardContent>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Nuevo Conductor
              </Button>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Filtrar por</InputLabel>
                <Select
                  value={filterStatus}
                  label="Filtrar por"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="pending">Pendientes</MenuItem>
                  <MenuItem value="approved">Aprobados</MenuItem>
                  <MenuItem value="rejected">Rechazados</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
            >
              Filtros Avanzados
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Data Table - Material UI con estilos mejorados */}
      <Card>
        <TableContainer component={Paper} className="shadow-none">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < filteredDrivers.length}
                    checked={filteredDrivers.length > 0 && selected.length === filteredDrivers.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Conductor</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Documentos</TableCell>
                <TableCell>Vehículo</TableCell>
                <TableCell>Calificación</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDrivers.map((driver) => {
                const isItemSelected = isSelected(driver.id)
                
                return (
                  <TableRow
                    key={driver.id}
                    hover
                    onClick={() => handleRowClick(driver.id)}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {driver.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Registrado: {driver.registeredAt}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{driver.email}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {driver.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(driver.status)}
                        color={getStatusColor(driver.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={driver.documentsComplete ? 'Completos' : 'Incompletos'}
                        color={driver.documentsComplete ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{driver.vehicleType}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box className="flex items-center">
                        <Typography variant="body2">
                          {driver.rating ? `${driver.rating}/5` : 'N/A'}
                        </Typography>
                        <span className="ml-1">⭐</span>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex space-x-1">
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDriver(driver)
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {driver.status === 'pending' && (
                          <>
                            <Tooltip title="Aprobar">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleApproveDriver(driver.id)
                                }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Rechazar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRejectDriver(driver.id)
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredDrivers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      {/* Driver Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6">
            Detalles del Conductor - {selectedDriver?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedDriver && (
            <Box className="space-y-4 mt-4">
              <Stack direction="row" spacing={4}>
                <Box className="flex-1">
                  <Typography variant="subtitle2" className="text-gray-600">
                    Información Personal
                  </Typography>
                  <Box className="mt-2 space-y-2">
                    <Typography><strong>Nombre:</strong> {selectedDriver.name}</Typography>
                    <Typography><strong>Email:</strong> {selectedDriver.email}</Typography>
                    <Typography><strong>Teléfono:</strong> {selectedDriver.phone}</Typography>
                    <Typography><strong>Licencia:</strong> {selectedDriver.licenseNumber}</Typography>
                  </Box>
                </Box>
                <Box className="flex-1">
                  <Typography variant="subtitle2" className="text-gray-600">
                    Información del Vehículo
                  </Typography>
                  <Box className="mt-2 space-y-2">
                    <Typography><strong>Tipo:</strong> {selectedDriver.vehicleType}</Typography>
                    <Typography><strong>Calificación:</strong> {selectedDriver.rating}/5 ⭐</Typography>
                    <Typography><strong>Estado:</strong> 
                      <Chip 
                        label={getStatusText(selectedDriver.status)} 
                        color={getStatusColor(selectedDriver.status)}
                        size="small"
                        className="ml-2"
                      />
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
          {selectedDriver?.status === 'pending' && (
            <>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => handleRejectDriver(selectedDriver.id)}
              >
                Rechazar
              </Button>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => handleApproveDriver(selectedDriver.id)}
              >
                Aprobar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
} 