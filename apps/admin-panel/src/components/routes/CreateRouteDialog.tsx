import React, { useState, useCallback, useMemo, useEffect } from 'react'
import {
  Dialog,
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
  Card,
  CardContent,
  IconButton,
} from '@mui/material'
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
} from '@mui/icons-material'
import { CreateRouteData } from '../../types/route'
import LocationStep, { LocationData } from './LocationStep'
import { ActionButton } from '../common/ReusableDialog'
import RoutePreviewMap from './RoutePreviewMap'

interface CreateRouteDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateRouteData) => Promise<void>
}

const steps = [
  'Origen',
  'Destino',
  'Información de la Ruta',
  'Revisar y Aprobar',
]

const initialFormData: CreateRouteData = {
  name: '',
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
  price: 0,
  duration: '',
  distance: 0,
  active: true,
  description: '',
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
      case 0: // Origin
        return !!(
          formData.origin.name &&
          formData.origin.city &&
          formData.origin.state &&
          formData.origin.coordinates
        )
      case 1: // Destination
        return !!(
          formData.destination.name &&
          formData.destination.city &&
          formData.destination.state &&
          formData.destination.coordinates
        )
      case 2: // Main Information
        return !!(
          formData.name &&
          formData.price > 0 &&
          formData.duration &&
          formData.distance > 0
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

  // Calculate route distance and duration when both coordinates are available
  const calculateRouteInfo = useCallback(async (origin: LocationData, destination: LocationData) => {
    if (!origin.coordinates || !destination.coordinates) return

    try {
      const directionsService = new google.maps.DirectionsService()
      
      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route(
          {
            origin: new google.maps.LatLng(origin.coordinates!.latitude, origin.coordinates!.longitude),
            destination: new google.maps.LatLng(destination.coordinates!.latitude, destination.coordinates!.longitude),
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true,
            avoidHighways: false,
            avoidTolls: false,
          },
          (result, status) => {
            if (status === 'OK' && result) {
              resolve(result)
            } else {
              reject(new Error(`Error calculating route: ${status}`))
            }
          }
        )
      })

      const route = result.routes[0]
      const leg = route?.legs[0]
      
      if (leg) {
        const distanceText = leg.distance?.text || ''
        const durationText = leg.duration?.text || ''
        
        // Extract numeric distance (convert km to number)
        const distanceMatch = distanceText.match(/(\d+(?:\.\d+)?)/);
        const distance = distanceMatch ? parseFloat(distanceMatch[1]) : 0
        
        // Keep duration as text for user readability
        const duration = durationText || '0 min'
        
        console.log('📍 Route calculated:', { distance, duration, distanceText, durationText })
        
        // Update form data with calculated values
        setFormData(prev => ({
          ...prev,
          distance: distance,
          duration: duration
        }))
      }
    } catch (error) {
      console.error('Error calculating route:', error)
      // Don't show error to user, just log it
    }
  }, [])

  // Auto-calculate route when destination is set and origin exists
  useEffect(() => {
    if (formData.origin.coordinates && formData.destination.coordinates) {
      calculateRouteInfo(formData.origin, formData.destination)
    }
  }, [formData.origin.coordinates, formData.destination.coordinates, calculateRouteInfo])

  // Memoize step content to prevent unnecessary re-renders
  const stepContent = useMemo(() => {
    console.log('🔄 Rendering step:', activeStep, {
      stepName: steps[activeStep],
      formDataOrigin: formData.origin,
      formDataDestination: formData.destination
    })

    switch (activeStep) {
      case 0:
        return (
          <LocationStep
            key="origin-step"
            title="Punto de Origen"
            description="Completa los datos del origen y selecciona la ubicación en el mapa"
            location={formData.origin}
            updateLocation={updateOrigin}
            placeholders={{
              name: 'Ej: Terminal de Autobuses de Ciudad de México',
              city: 'Ej: Ciudad de México',
              state: 'Ej: Ciudad de México'
            }}
          />
        )
      case 1:
        return (
          <LocationStep
            key="destination-step"
            title="Punto de Destino"
            description="Completa los datos del destino y selecciona la ubicación en el mapa"
            location={formData.destination}
            updateLocation={updateDestination}
            placeholders={{
              name: 'Ej: Terminal de Autobuses de Guadalajara',
              city: 'Ej: Guadalajara',
              state: 'Ej: Jalisco'
            }}
          />
        )
      case 2:
        return <MainInformationStep formData={formData} updateFormData={updateFormData} />
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
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 200,
        }
      }}
    >
      {/* Header */}
      <Box className="px-6 py-4 bg-neutral-100 dark:bg-dark-bg-hover">
        <Box className="flex items-center justify-between">
          <Typography 
            variant="h5" 
            component="h2"
            className="font-bold text-brand-black dark:text-dark-text-primary"
          >
            Crear Nueva Ruta
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            size="small"
            className="text-neutral-500 hover:text-neutral-700 dark:text-dark-text-secondary dark:hover:text-dark-text-primary"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent className="px-6 py-4">
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

      {/* Footer */}
      <Box className="px-6 py-2 bg-neutral-100 dark:bg-dark-bg-hover">
        <DialogActions className="p-0" sx={{ justifyContent: 'space-between' }}>
          <ActionButton variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </ActionButton>
          
          <Box display="flex" gap={1}>
            <ActionButton
              variant="secondary"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              startIcon={<ArrowBackIcon />}
            >
              Anterior
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={handleNext}
              disabled={!isStepValid(activeStep) || loading}
              endIcon={loading ? <CircularProgress size={20} /> : activeStep === steps.length - 1 ? <CheckIcon /> : <ArrowForwardIcon />}
            >
              {activeStep === steps.length - 1 ? 'Crear Ruta' : 'Siguiente'}
            </ActionButton>
          </Box>
        </DialogActions>
      </Box>
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
        Información de la Ruta
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



interface ReviewStepProps {
  formData: CreateRouteData
}

const ReviewStep: React.FC<ReviewStepProps> = React.memo(({ formData }) => {
  // Check if both origin and destination coordinates exist
  const hasOriginCoords = formData.origin.coordinates
  const hasDestinationCoords = formData.destination.coordinates

  return (
    <Paper elevation={0} sx={{ p: 2 }}>

      <Box display="flex" gap={3} sx={{ minHeight: 500 }}>
        {/* Left Half - Information Cards */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* General Information Card */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Información General
              </Typography>
              <Stack spacing={1}>
                <Typography><strong>Nombre:</strong> {formData.name}</Typography>
                <Typography><strong>Precio:</strong> ${formData.price} MXN</Typography>
                <Typography><strong>Duración:</strong> {formData.duration}</Typography>
                <Typography><strong>Distancia:</strong> {formData.distance} km</Typography>
                {formData.description && (
                  <Typography><strong>Descripción:</strong> {formData.description}</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Origin Card */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Punto de Origen
              </Typography>
              <Stack spacing={1}>
                <Typography><strong>Nombre:</strong> {formData.origin.name}</Typography>
                <Typography><strong>Ciudad:</strong> {formData.origin.city}</Typography>
                <Typography><strong>Estado:</strong> {formData.origin.state}</Typography>
                {formData.origin.coordinates && (
                  <Typography>
                    <strong>Coordenadas:</strong> {formData.origin.coordinates.latitude.toFixed(6)}, {formData.origin.coordinates.longitude.toFixed(6)}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Destination Card */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Punto de Destino
              </Typography>
              <Stack spacing={1}>
                <Typography><strong>Nombre:</strong> {formData.destination.name}</Typography>
                <Typography><strong>Ciudad:</strong> {formData.destination.city}</Typography>
                <Typography><strong>Estado:</strong> {formData.destination.state}</Typography>
                {formData.destination.coordinates && (
                  <Typography>
                    <strong>Coordenadas:</strong> {formData.destination.coordinates.latitude.toFixed(6)}, {formData.destination.coordinates.longitude.toFixed(6)}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Right Half - Map */}
        <Box sx={{ flex: 1 }}>
          {!hasOriginCoords || !hasDestinationCoords ? (
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '2px dashed #ccc',
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Vista Previa de la Ruta
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Para mostrar el mapa, completa las coordenadas del origen y destino en los pasos anteriores.
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Vista Previa de la Ruta
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mapa con la trayectoria desde el origen hasta el destino
                </Typography>
              </Box>
              
              <RoutePreviewMap
                startLocation={formData.origin.coordinates!}
                endLocation={formData.destination.coordinates!}
                mapHeight="400px"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  )
}) 