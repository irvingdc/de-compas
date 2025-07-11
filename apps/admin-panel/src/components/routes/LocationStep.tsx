import React, { useCallback } from 'react'
import {
  Box,
  Typography,
  TextField,
  Stack,
  Paper,
} from '@mui/material'
import MapPicker from './MapPicker'

interface LocationData {
  name: string
  city: string
  state: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

interface LocationStepProps {
  title: string
  description: string
  location: LocationData
  updateLocation: (location: LocationData) => void
  placeholders: {
    name: string
    city: string
    state: string
  }
}

const LocationStep: React.FC<LocationStepProps> = React.memo(({
  title,
  description,
  location,
  updateLocation,
  placeholders,
}) => {
  console.log(`🎯 ${title} rendered with:`, { location })

  const handleLocationSelected = useCallback((mapLocation: { lat: number; lng: number; address?: string }) => {
    const addressParts = mapLocation.address?.split(',') || []
    const city = addressParts.length > 1 ? addressParts[addressParts.length - 3]?.trim() : ''
    const state = addressParts.length > 2 ? addressParts[addressParts.length - 2]?.trim() : ''
    
    updateLocation({
      name: mapLocation.address || '',
      city: city || '',
      state: state || '',
      coordinates: { latitude: mapLocation.lat, longitude: mapLocation.lng }
    })
  }, [updateLocation])

  const handleFieldChange = useCallback((field: keyof LocationData, value: string) => {
    updateLocation({
      ...location,
      [field]: value
    })
  }, [location, updateLocation])
  
  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={title === 'Punto de Origen' ? 'Nombre del Punto de Origen' : 'Nombre del Punto de Destino'}
          value={location.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          required
          placeholder={placeholders.name}
        />

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Ciudad"
            value={location.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            required
            placeholder={placeholders.city}
          />
          <TextField
            fullWidth
            label="Estado"
            value={location.state}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            required
            placeholder={placeholders.state}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecciona la ubicación exacta en el mapa:
          </Typography>
          <MapPicker 
            onLocationSelected={handleLocationSelected}
            defaultLocation={location.coordinates ? {
              lat: location.coordinates.latitude,
              lng: location.coordinates.longitude,
              address: location.name
            } : null}
          />
        </Box>
      </Stack>
    </Paper>
  )
})

LocationStep.displayName = 'LocationStep'

export default LocationStep
export type { LocationStepProps, LocationData } 