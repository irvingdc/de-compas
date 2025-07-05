import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Switch, 
  FormControlLabel,
  Slider,
  Button,
  Chip,
  Alert,
  Divider
} from '@mui/material'
import { 
  TrendingUp, 
  Zap, 
  Calendar, 
  Users, 
  MapPin,
  Clock,
  Brain,
  Target,
  Save
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

// Demo data
const priceHistoryData = [
  { time: '00:00', basePrice: 350, dynamicPrice: 350, demand: 20 },
  { time: '06:00', basePrice: 350, dynamicPrice: 385, demand: 45 },
  { time: '08:00', basePrice: 350, dynamicPrice: 420, demand: 75 },
  { time: '10:00', basePrice: 350, dynamicPrice: 395, demand: 55 },
  { time: '12:00', basePrice: 350, dynamicPrice: 410, demand: 65 },
  { time: '14:00', basePrice: 350, dynamicPrice: 375, demand: 40 },
  { time: '16:00', basePrice: 350, dynamicPrice: 390, demand: 50 },
  { time: '18:00', basePrice: 350, dynamicPrice: 435, demand: 85 },
  { time: '20:00', basePrice: 350, dynamicPrice: 415, demand: 70 },
  { time: '22:00', basePrice: 350, dynamicPrice: 365, demand: 35 }
]

const routeConfigs = [
  { 
    route: 'CDMX - Guadalajara', 
    basePrice: 450, 
    currentPrice: 495, 
    demand: 78, 
    status: 'active',
    lastAdjustment: '2h ago'
  },
  { 
    route: 'CDMX - Monterrey', 
    basePrice: 380, 
    currentPrice: 420, 
    demand: 65, 
    status: 'active',
    lastAdjustment: '45min ago'
  },
  { 
    route: 'Guadalajara - León', 
    basePrice: 220, 
    currentPrice: 200, 
    demand: 25, 
    status: 'paused',
    lastAdjustment: '1d ago'
  }
]

const pricingFactors = [
  { factor: 'Demanda en tiempo real', weight: 35, description: 'Ajuste basado en reservas actuales' },
  { factor: 'Hora del día', weight: 25, description: 'Picos de demanda matutinos y vespertinos' },
  { factor: 'Día de la semana', weight: 15, description: 'Viernes y domingos con mayor demanda' },
  { factor: 'Eventos especiales', weight: 10, description: 'Conciertos, festivales, feriados' },
  { factor: 'Competencia', weight: 10, description: 'Precios de otras plataformas' },
  { factor: 'Clima', weight: 5, description: 'Condiciones meteorológicas adversas' }
]

export const DynamicPricing: React.FC = () => {
  const [dynamicPricingEnabled, setDynamicPricingEnabled] = useState(true)
  const [maxIncrease, setMaxIncrease] = useState(50)
  const [maxDecrease, setMaxDecrease] = useState(25)
  const [demandThreshold, setDemandThreshold] = useState(70)
  const [selectedRoute] = useState('CDMX - Guadalajara')

  const handleSaveSettings = () => {
    // Aquí iría la lógica para guardar configuraciones
    console.log('Configuraciones guardadas')
  }

  const potentialIncrease = routeConfigs.reduce((sum, route) => sum + (route.currentPrice - route.basePrice), 0)
  const averageDemand = routeConfigs.reduce((sum, route) => sum + route.demand, 0) / routeConfigs.length

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h5" fontWeight="bold" className="text-brand-black dark:text-white">
            Pricing Dinámico Inteligente
          </Typography>
          <Typography variant="body2" className="text-secondary-600 dark:text-gray-400">
            Optimización automática de precios basada en demanda y factores externos
          </Typography>
        </Box>
        <Box className="flex items-center gap-4">
          <FormControlLabel
            control={
              <Switch
                checked={dynamicPricingEnabled}
                onChange={(e) => setDynamicPricingEnabled(e.target.checked)}
              />
            }
            label="Pricing Dinámico"
          />
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveSettings}
            className="bg-brand-yellow hover:bg-brand-yellow/90"
          >
            Guardar Configuración
          </Button>
        </Box>
      </Box>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <Brain className="h-8 w-8 text-purple-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  {dynamicPricingEnabled ? 'Activo' : 'Pausado'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estado del Sistema
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  +${potentialIncrease.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresos Adicionales
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <Target className="h-8 w-8 text-blue-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  {averageDemand.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Demanda Promedio
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <Zap className="h-8 w-8 text-orange-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  {routeConfigs.filter(r => r.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rutas Activas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price History Chart */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="semibold" className="mb-4">
              Evolución de Precios - {selectedRoute}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${value}`, 
                    name === 'basePrice' ? 'Precio Base' : 'Precio Dinámico'
                  ]}
                />
                <ReferenceLine y={350} stroke="#ccc" strokeDasharray="5 5" />
                <Line 
                  type="monotone" 
                  dataKey="basePrice" 
                  stroke="#94A3B8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="basePrice"
                />
                <Line 
                  type="monotone" 
                  dataKey="dynamicPrice" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  name="dynamicPrice"
                />
              </LineChart>
            </ResponsiveContainer>
            <Box className="mt-4 flex items-center justify-center gap-6">
              <Box className="flex items-center">
                <div className="w-4 h-0.5 bg-gray-400 mr-2"></div>
                <Typography variant="body2" color="text.secondary">
                  Precio Base
                </Typography>
              </Box>
              <Box className="flex items-center">
                <div className="w-4 h-0.5 bg-brand-yellow mr-2"></div>
                <Typography variant="body2" color="text.secondary">
                  Precio Dinámico
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Configuration Panel */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="semibold" className="mb-4">
              Configuración de Algoritmo
            </Typography>
            <Box className="space-y-6">
              <Box>
                <Typography variant="body2" fontWeight="medium" className="mb-2">
                  Incremento Máximo: {maxIncrease}%
                </Typography>
                <Slider
                  value={maxIncrease}
                  onChange={(_, value) => setMaxIncrease(value as number)}
                  min={10}
                  max={100}
                  step={5}
                  marks={[
                    { value: 10, label: '10%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" fontWeight="medium" className="mb-2">
                  Descuento Máximo: {maxDecrease}%
                </Typography>
                <Slider
                  value={maxDecrease}
                  onChange={(_, value) => setMaxDecrease(value as number)}
                  min={5}
                  max={50}
                  step={5}
                  marks={[
                    { value: 5, label: '5%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' }
                  ]}
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="medium" className="mb-2">
                  Umbral de Demanda: {demandThreshold}%
                </Typography>
                <Slider
                  value={demandThreshold}
                  onChange={(_, value) => setDemandThreshold(value as number)}
                  min={30}
                  max={95}
                  step={5}
                  marks={[
                    { value: 30, label: '30%' },
                    { value: 70, label: '70%' },
                    { value: 95, label: '95%' }
                  ]}
                />
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" fontWeight="medium" className="mb-3">
                  Factores de Ajuste Rápido
                </Typography>
                <Box className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outlined"
                    startIcon={<Calendar />}
                    size="small"
                    onClick={() => {/* Lógica para fin de semana */}}
                  >
                    Fin de Semana
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Clock />}
                    size="small"
                    onClick={() => {/* Lógica para hora pico */}}
                  >
                    Hora Pico
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Users />}
                    size="small"
                    onClick={() => {/* Lógica para alta demanda */}}
                  >
                    Alta Demanda
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<MapPin />}
                    size="small"
                    onClick={() => {/* Lógica para evento especial */}}
                  >
                    Evento Especial
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Factors */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="semibold" className="mb-4">
            Factores de Precio y Ponderación
          </Typography>
          <Box className="space-y-4">
            {pricingFactors.map((factor, index) => (
              <Box key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                <Box className="flex-1">
                  <Typography variant="body2" fontWeight="medium">
                    {factor.factor}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {factor.description}
                  </Typography>
                </Box>
                <Box className="flex items-center gap-3">
                  <Box className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-brand-yellow h-2 rounded-full transition-all duration-300"
                      style={{ width: `${factor.weight}%` }}
                    ></div>
                  </Box>
                  <Typography variant="body2" fontWeight="semibold" className="w-12 text-right">
                    {factor.weight}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Route Status Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="semibold" className="mb-4">
            Estado de Rutas
          </Typography>
          <Box className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Ruta</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Precio Base</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Precio Actual</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Demanda</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Estado</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Último Ajuste</th>
                </tr>
              </thead>
              <tbody>
                {routeConfigs.map((route, index) => (
                  <tr key={index} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                    <td className="py-3 px-4">
                      <Typography variant="body2" fontWeight="medium">
                        {route.route}
                      </Typography>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Typography variant="body2" color="text.secondary">
                        ${route.basePrice}
                      </Typography>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Typography 
                        variant="body2" 
                        fontWeight="semibold"
                        className={route.currentPrice > route.basePrice ? 'text-green-600' : 'text-red-600'}
                      >
                        ${route.currentPrice}
                      </Typography>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Box className="flex items-center justify-end gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${route.demand}%` }}
                          ></div>
                        </div>
                        <Typography variant="body2">
                          {route.demand}%
                        </Typography>
                      </Box>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Chip 
                        label={route.status === 'active' ? 'Activo' : 'Pausado'}
                        size="small"
                        color={route.status === 'active' ? 'success' : 'default'}
                      />
                    </td>
                    <td className="text-right py-3 px-4">
                      <Typography variant="body2" color="text.secondary">
                        {route.lastAdjustment}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>

      {/* Alert */}
      {dynamicPricingEnabled && (
        <Alert severity="info" className="mt-4">
          <Typography variant="body2">
            <strong>Sistema Activo:</strong> Los precios se ajustan automáticamente cada 15 minutos 
            basándose en la demanda actual y los factores configurados.
          </Typography>
        </Alert>
      )}
    </Box>
  )
} 