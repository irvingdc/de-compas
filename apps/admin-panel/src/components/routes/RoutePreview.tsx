import React from 'react'
import {
  Paper,
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
} from '@mui/material'
import { Route, CreateRouteData } from '../../types/route'
import RoutePreviewMap from './RoutePreviewMap'

interface RoutePreviewProps {
  route: Route | CreateRouteData
  showMapTitle?: boolean
  mapHeight?: string
}

export const RoutePreview: React.FC<RoutePreviewProps> = React.memo(({ 
  route, 
  showMapTitle = true,
  mapHeight = "400px"
}) => {
  // Check if both origin and destination coordinates exist
  const hasOriginCoords = route.origin.coordinates
  const hasDestinationCoords = route.destination.coordinates

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
                <Typography><strong>Nombre:</strong> {route.name}</Typography>
                <Typography><strong>Precio:</strong> ${route.price} MXN</Typography>
                <Typography><strong>Duración:</strong> {route.duration}</Typography>
                <Typography><strong>Distancia:</strong> {route.distance} km</Typography>
                {route.description && (
                  <Typography><strong>Descripción:</strong> {route.description}</Typography>
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
                <Typography><strong>Nombre:</strong> {route.origin.name}</Typography>
                <Typography><strong>Ciudad:</strong> {route.origin.city}</Typography>
                <Typography><strong>Estado:</strong> {route.origin.state}</Typography>
                {route.origin.coordinates && (
                  <Typography>
                    <strong>Coordenadas:</strong> {route.origin.coordinates.latitude.toFixed(6)}, {route.origin.coordinates.longitude.toFixed(6)}
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
                <Typography><strong>Nombre:</strong> {route.destination.name}</Typography>
                <Typography><strong>Ciudad:</strong> {route.destination.city}</Typography>
                <Typography><strong>Estado:</strong> {route.destination.state}</Typography>
                {route.destination.coordinates && (
                  <Typography>
                    <strong>Coordenadas:</strong> {route.destination.coordinates.latitude.toFixed(6)}, {route.destination.coordinates.longitude.toFixed(6)}
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
                  Para mostrar el mapa, se necesitan las coordenadas del origen y destino.
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              {showMapTitle && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Vista Previa de la Ruta
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mapa con la trayectoria desde el origen hasta el destino
                  </Typography>
                </Box>
              )}
              
              <RoutePreviewMap
                startLocation={route.origin.coordinates!}
                endLocation={route.destination.coordinates!}
                mapHeight={mapHeight}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  )
})

RoutePreview.displayName = 'RoutePreview' 