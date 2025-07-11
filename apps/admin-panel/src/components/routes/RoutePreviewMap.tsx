import React, { useState, useCallback, useEffect } from 'react'
import { GoogleMap, useLoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api'
import { Box, Typography, Alert, CircularProgress, SxProps, Theme } from '@mui/material'

interface Coordinates {
  latitude: number
  longitude: number
}

interface RoutePreviewMapProps {
  startLocation: Coordinates
  endLocation: Coordinates
  sx?: SxProps<Theme>
  mapHeight?: string | number
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
}

const RoutePreviewMap: React.FC<RoutePreviewMapProps> = React.memo(({
  startLocation,
  endLocation,
  sx,
  mapHeight = '500px',
}) => {
  const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  })

  const calculateRoute = useCallback(async () => {
    if (!startLocation || !endLocation) return

    setIsLoading(true)
    setError(null)

    try {
      const directionsService = new google.maps.DirectionsService()
      
      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route(
          {
            origin: new google.maps.LatLng(startLocation.latitude, startLocation.longitude),
            destination: new google.maps.LatLng(endLocation.latitude, endLocation.longitude),
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

      setDirectionsResult(result)
    } catch (err) {
      console.error('Error calculating route:', err)
      setError(err instanceof Error ? err.message : 'Error al calcular la ruta')
    } finally {
      setIsLoading(false)
    }
  }, [startLocation, endLocation])

  useEffect(() => {
    if (map && startLocation && endLocation) {
      calculateRoute()
    }
  }, [map, startLocation, endLocation, calculateRoute])

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
  }, [])

  // Calculate center point between start and end locations
  const center = {
    lat: (startLocation.latitude + endLocation.latitude) / 2,
    lng: (startLocation.longitude + endLocation.longitude) / 2
  }

  // Calculate appropriate zoom level based on distance
  const getZoomLevel = () => {
    const latDiff = Math.abs(startLocation.latitude - endLocation.latitude)
    const lngDiff = Math.abs(startLocation.longitude - endLocation.longitude)
    const maxDiff = Math.max(latDiff, lngDiff)
    
    if (maxDiff > 5) return 6
    if (maxDiff > 2) return 8
    if (maxDiff > 1) return 9
    if (maxDiff > 0.5) return 10
    if (maxDiff > 0.1) return 12
    return 14
  }

  // Dynamic map container style
  const mapContainerStyle = {
    width: '100%',
    height: mapHeight,
    borderRadius: '8px'
  }

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={getZoomLevel()}
          options={mapOptions}
          onLoad={handleMapLoad}
        >
          {/* Show markers if no route is calculated yet */}
          {!directionsResult && !isLoading && (
            <>
              <Marker
                position={{
                  lat: startLocation.latitude,
                  lng: startLocation.longitude
                }}
                title="Punto de Origen"
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                }}
              />
              <Marker
                position={{
                  lat: endLocation.latitude,
                  lng: endLocation.longitude
                }}
                title="Punto de Destino"
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }}
              />
            </>
          )}

          {/* Show the calculated route */}
          {directionsResult && (
            <DirectionsRenderer
              directions={directionsResult}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#2563eb',
                  strokeWeight: 5,
                  strokeOpacity: 0.8,
                }
              }}
            />
          )}
        </GoogleMap>

        {/* Loading overlay */}
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Calculando ruta...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Route information */}
      {directionsResult && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom>
            Información de la Ruta:
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Typography variant="body2">
              <strong>Distancia:</strong> {directionsResult.routes[0]?.legs[0]?.distance?.text || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Tiempo estimado:</strong> {directionsResult.routes[0]?.legs[0]?.duration?.text || 'N/A'}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
})

RoutePreviewMap.displayName = 'RoutePreviewMap'

export default RoutePreviewMap 