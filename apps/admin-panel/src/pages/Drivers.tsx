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
import { ConfirmationDialog, ReusableDialog, ActionButton } from '../components/common'

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
  
  // Estados para diálogos de confirmación
  const [approveDialogOpen, setApproveDialogOpen] = React.useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false)
  const [driverToAction, setDriverToAction] = React.useState<Driver | null>(null)

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
    const driver = drivers.find(d => d.id === driverId)
    if (driver) {
      setDriverToAction(driver)
      setApproveDialogOpen(true)
    }
  }

  const handleRejectDriver = (driverId: number) => {
    const driver = drivers.find(d => d.id === driverId)
    if (driver) {
      setDriverToAction(driver)
      setRejectDialogOpen(true)
    }
  }

  const handleConfirmApprove = () => {
    if (driverToAction) {
      console.log('Approving driver:', driverToAction.id)
      // Aquí iría la lógica para aprobar el conductor
      setApproveDialogOpen(false)
      setDriverToAction(null)
    }
  }

  const handleConfirmReject = () => {
    if (driverToAction) {
      console.log('Rejecting driver:', driverToAction.id)
      // Aquí iría la lógica para rechazar el conductor
      setRejectDialogOpen(false)
      setDriverToAction(null)
    }
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

  const handleChangePage = (_event: unknown, newPage: number) => {
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
        <Typography variant="h4" component="h1" fontWeight="bold" className="text-brand-black">
          Gestión de Conductores
        </Typography>
        <Typography variant="body1" className="text-secondary-600">
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
                color="primary"
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
      <ReusableDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={`Detalles del Conductor - ${selectedDriver?.name}`}
        maxWidth="md"
        actions={
          <>
            <ActionButton variant="secondary" onClick={() => setDialogOpen(false)}>
              Cerrar
            </ActionButton>
            {selectedDriver?.status === 'pending' && (
              <>
                <ActionButton 
                  variant="danger" 
                  onClick={() => handleRejectDriver(selectedDriver.id)}
                >
                  Rechazar
                </ActionButton>
                <ActionButton 
                  variant="primary" 
                  onClick={() => handleApproveDriver(selectedDriver.id)}
                >
                  Aprobar
                </ActionButton>
              </>
            )}
          </>
        }
      >
        {selectedDriver && (
          <Box className="space-y-4">
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box>
                <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
                  Información Personal
                </Typography>
                <Box className="space-y-2">
                  <Typography><strong>Nombre:</strong> {selectedDriver.name}</Typography>
                  <Typography><strong>Email:</strong> {selectedDriver.email}</Typography>
                  <Typography><strong>Teléfono:</strong> {selectedDriver.phone}</Typography>
                  <Typography><strong>Licencia:</strong> {selectedDriver.licenseNumber || 'No especificada'}</Typography>
                  <Typography><strong>Registrado:</strong> {selectedDriver.registeredAt}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" className="font-bold text-brand-black dark:text-dark-text-primary mb-3">
                  Información del Vehículo
                </Typography>
                <Box className="space-y-2">
                  <Typography><strong>Tipo:</strong> {selectedDriver.vehicleType || 'No especificado'}</Typography>
                  <Typography><strong>Calificación:</strong> {selectedDriver.rating ? `${selectedDriver.rating}/5 ⭐` : 'N/A'}</Typography>
                  <Box className="flex items-center">
                    <Typography><strong>Estado:</strong></Typography>
                    <Chip 
                      label={getStatusText(selectedDriver.status)} 
                      color={getStatusColor(selectedDriver.status)}
                      size="small"
                      className="ml-2"
                    />
                  </Box>
                  <Box className="flex items-center">
                    <Typography><strong>Documentos:</strong></Typography>
                    <Chip 
                      label={selectedDriver.documentsComplete ? 'Completos' : 'Incompletos'}
                      color={selectedDriver.documentsComplete ? 'success' : 'error'}
                      size="small"
                      className="ml-2"
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </ReusableDialog>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={handleConfirmApprove}
        title="Confirmar Aprobación"
        message={`¿Estás seguro de aprobar al conductor ${driverToAction?.name}?`}
      />
      <ConfirmationDialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={handleConfirmReject}
        title="Confirmar Rechazo"
        message={`¿Estás seguro de rechazar al conductor ${driverToAction?.name}?`}
      />
    </Box>
  )
} 