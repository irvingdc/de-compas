import React, { useState, useCallback, useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  TextField,
  Stack,
  Paper,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
} from '@mui/icons-material'
import { CreateRouteData } from '../../types/route'
import MapPicker from './MapPicker'

interface CreateRouteDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateRouteData) => Promise<void>
}

interface LocationData {
  name: string
  city: string
  state: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

const steps = [
  'Información Principal',
  'Origen',
  'Destino',
  'Revisar y Aprobar',
]

const initialFormData: CreateRouteData = {
  name: 'Default Route',
  origin: {
    name: '',
    city: '',
    state: '',
    coordinates: undefined,
  },
  destination: {
    name: '',
    city: '',
    state: '',
    coordinates: undefined,
  },
  price: 1,
  duration: '1h',
  distance: 1,
  active: true,
  description: '',
  vehicleType: '',
}

export const CreateRouteDialog: React.FC<CreateRouteDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  console.log('📂 CreateRouteDialog rendered, open:', open)
  
  const [activeStep, setActiveStep] = useState(0) // Fixed: should start at 0
  const [formData, setFormData] = useState<CreateRouteData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    if (loading) return
    setActiveStep(0)
    setFormData(initialFormData)
    setError(null)
    onClose()
  }, [loading, onClose])

  const handleNext = useCallback(() => {
    if (activeStep === steps.length - 1) {
      handleSubmit()
    } else {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }, [activeStep])

  const handleBack = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1)
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await onSubmit(formData)
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la ruta')
    } finally {
      setLoading(false)
    }
  }, [formData, onSubmit, handleClose])

  const isStepValid = useCallback((step: number): boolean => {
    switch (step) {
      case 0: // Main Information
        return !!(
          formData.name &&
          formData.price > 0 &&
          formData.duration &&
          formData.distance > 0
        )
      case 1: // Origin
        return !!(
          formData.origin.name &&
          formData.origin.city &&
          formData.origin.state &&
          formData.origin.coordinates
        )
      case 2: // Destination
        return !!(
          formData.destination.name &&
          formData.destination.city &&
          formData.destination.state &&
          formData.destination.coordinates
        )
      case 3: // Review
        return isStepValid(0) && isStepValid(1) && isStepValid(2)
      default:
        return false
    }
  }, [formData])

  // Stable callbacks for form updates
  const updateFormData = useCallback((updates: Partial<CreateRouteData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateOrigin = useCallback((origin: LocationData) => {
    console.log('🎯 updateOrigin called with:', origin)
    setFormData(prev => ({ ...prev, origin }))
  }, [])

  const updateDestination = useCallback((destination: LocationData) => {
    console.log('🎯 updateDestination called with:', destination)
    setFormData(prev => ({ ...prev, destination }))
  }, [])

  // Memoize step content to prevent unnecessary re-renders
  const stepContent = useMemo(() => {
    console.log('🔄 Rendering step:', activeStep, { 
      stepName: steps[activeStep], 
      formDataOrigin: formData.origin,
      formDataDestination: formData.destination 
    })
    
    switch (activeStep) {
      case 0:
        return <MainInformationStep formData={formData} updateFormData={updateFormData} />
      case 1:
        return <OriginStep origin={formData.origin} updateOrigin={updateOrigin} />
      case 2:
        return <DestinationStep destination={formData.destination} updateDestination={updateDestination} />
      case 3:
        return <ReviewStep formData={formData} />
      default:
        return null
    }
  }, [activeStep, formData, updateFormData, updateOrigin, updateDestination])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Crear Nueva Ruta</Typography>
          <Button
            onClick={handleClose}
            disabled={loading}
            color="inherit"
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ minHeight: 400 }}>
          
          {stepContent}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          startIcon={<ArrowBackIcon />}
        >
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isStepValid(activeStep) || loading}
          variant="contained"
          endIcon={loading ? <CircularProgress size={20} /> : activeStep === steps.length - 1 ? <CheckIcon /> : <ArrowForwardIcon />}
        >
          {activeStep === steps.length - 1 ? 'Crear Ruta' : 'Siguiente'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Step Components - Memoized to prevent unnecessary re-renders
interface MainInformationStepProps {
  formData: CreateRouteData
  updateFormData: (updates: Partial<CreateRouteData>) => void
}

const MainInformationStep: React.FC<MainInformationStepProps> = React.memo(({
  formData,
  updateFormData,
}) => {
  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Información Principal
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Ingresa los datos básicos de la ruta
      </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Nombre de la Ruta"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          required
          placeholder="Ej: Ciudad de México - Guadalajara"
        />

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Precio (MXN)"
            type="number"
            value={formData.price}
            onChange={(e) => updateFormData({ price: Number(e.target.value) })}
            required
            InputProps={{
              startAdornment: <Typography>$</Typography>,
            }}
          />

          <TextField
            fullWidth
            label="Duración Estimada"
            value={formData.duration}
            onChange={(e) => updateFormData({ duration: e.target.value })}
            required
            placeholder="Ej: 6 horas"
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Distancia (km)"
            type="number"
            value={formData.distance}
            onChange={(e) => updateFormData({ distance: Number(e.target.value) })}
            required
            InputProps={{
              endAdornment: <Typography>km</Typography>,
            }}
          />

          <TextField
            fullWidth
            label="Tipo de Vehículo"
            value={formData.vehicleType}
            onChange={(e) => updateFormData({ vehicleType: e.target.value })}
            placeholder="Ej: Autobús, Van, etc."
          />
        </Box>

        <TextField
          fullWidth
          label="Descripción (Opcional)"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          multiline
          rows={3}
          placeholder="Información adicional sobre la ruta..."
        />
      </Stack>
    </Paper>
  )
})

interface OriginStepProps {
  origin: LocationData
  updateOrigin: (origin: LocationData) => void
}

const OriginStep: React.FC<OriginStepProps> = React.memo(({
  origin,
  updateOrigin,
}) => {
  console.log('🎯 OriginStep rendered with:', { origin })

  const handleLocationSelected = useCallback((location: { lat: number; lng: number; address?: string }) => {
    updateOrigin({
      name: location.address || '',
      city: location.address || '',
      state: location.address || '',
      coordinates: { latitude: location.lat, longitude: location.lng }
    })
  }, [updateOrigin])
  
  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Punto de Origen
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Selecciona la ubicación de origen en el mapa
      </Typography>

      <MapPicker 
        onLocationSelected={handleLocationSelected}
      />
    </Paper>
  )
})

interface DestinationStepProps {
  destination: LocationData
  updateDestination: (destination: LocationData) => void
}

const DestinationStep: React.FC<DestinationStepProps> = React.memo(({
  destination,
  updateDestination,
}) => {
  console.log('🎯 DestinationStep rendered with:', { destination })
  
  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Punto de Destino
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Selecciona la ubicación de destino en el mapa
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Map</Typography>

    </Paper>
  )
})

interface ReviewStepProps {
  formData: CreateRouteData
}

const ReviewStep: React.FC<ReviewStepProps> = React.memo(({ formData }) => {
  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Revisar y Aprobar
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Revisa la información antes de crear la ruta
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Información General
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography><strong>Nombre:</strong> {formData.name}</Typography>
            <Typography><strong>Precio:</strong> ${formData.price} MXN</Typography>
            <Typography><strong>Duración:</strong> {formData.duration}</Typography>
            <Typography><strong>Distancia:</strong> {formData.distance} km</Typography>
            {formData.vehicleType && (
              <Typography><strong>Tipo de Vehículo:</strong> {formData.vehicleType}</Typography>
            )}
            {formData.description && (
              <Typography><strong>Descripción:</strong> {formData.description}</Typography>
            )}
          </Box>
        </Box>

        <Divider />

        <Box display="flex" gap={4}>
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              Origen
            </Typography>
            <Typography><strong>Nombre:</strong> {formData.origin.name}</Typography>
            <Typography><strong>Ciudad:</strong> {formData.origin.city}</Typography>
            <Typography><strong>Estado:</strong> {formData.origin.state}</Typography>
            {formData.origin.coordinates && (
              <Typography>
                <strong>Coordenadas:</strong> {formData.origin.coordinates.latitude.toFixed(6)}, {formData.origin.coordinates.longitude.toFixed(6)}
              </Typography>
            )}
          </Box>

          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              Destino
            </Typography>
            <Typography><strong>Nombre:</strong> {formData.destination.name}</Typography>
            <Typography><strong>Ciudad:</strong> {formData.destination.city}</Typography>
            <Typography><strong>Estado:</strong> {formData.destination.state}</Typography>
            {formData.destination.coordinates && (
              <Typography>
                <strong>Coordenadas:</strong> {formData.destination.coordinates.latitude.toFixed(6)}, {formData.destination.coordinates.longitude.toFixed(6)}
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Paper>
  )
}) 