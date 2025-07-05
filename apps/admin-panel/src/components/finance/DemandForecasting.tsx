import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Chip, 
  Alert,
  Button,
  IconButton,
  Tooltip
} from '@mui/material'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  Users, 
  AlertTriangle,
  Target,
  Brain,
  Activity,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Legend,
  ReferenceLine
} from 'recharts'

// Demo data
const demandForecastData = [
  // Datos históricos
  { date: '2024-01-01', historical: 85, predicted: null, actual: 85, confidence: 95 },
  { date: '2024-01-02', historical: 92, predicted: null, actual: 92, confidence: 95 },
  { date: '2024-01-03', historical: 78, predicted: null, actual: 78, confidence: 95 },
  { date: '2024-01-04', historical: 105, predicted: null, actual: 105, confidence: 95 },
  { date: '2024-01-05', historical: 118, predicted: null, actual: 118, confidence: 95 },
  { date: '2024-01-06', historical: 95, predicted: null, actual: 95, confidence: 95 },
  { date: '2024-01-07', historical: 88, predicted: null, actual: 88, confidence: 95 },
  
  // Predicciones
  { date: '2024-01-08', historical: null, predicted: 125, actual: null, confidence: 87 },
  { date: '2024-01-09', historical: null, predicted: 132, actual: null, confidence: 85 },
  { date: '2024-01-10', historical: null, predicted: 145, actual: null, confidence: 82 },
  { date: '2024-01-11', historical: null, predicted: 138, actual: null, confidence: 79 },
  { date: '2024-01-12', historical: null, predicted: 156, actual: null, confidence: 76 },
  { date: '2024-01-13', historical: null, predicted: 142, actual: null, confidence: 73 },
  { date: '2024-01-14', historical: null, predicted: 128, actual: null, confidence: 70 }
]

const routeAnalysisData = [
  {
    route: 'CDMX - Guadalajara',
    currentDemand: 85,
    predictedDemand: 125,
    trend: 'increasing',
    trendPercent: 47,
    confidence: 87,
    recommendation: 'Incrementar frecuencia',
    factors: ['Fin de semana largo', 'Temporada alta', 'Eventos culturales']
  },
  {
    route: 'CDMX - Monterrey',
    currentDemand: 72,
    predictedDemand: 95,
    trend: 'increasing',
    trendPercent: 32,
    confidence: 82,
    recommendation: 'Mantener capacidad',
    factors: ['Viajes de negocios', 'Clima favorable']
  },
  {
    route: 'Guadalajara - León',
    currentDemand: 45,
    predictedDemand: 38,
    trend: 'decreasing',
    trendPercent: -15,
    confidence: 91,
    recommendation: 'Reducir frecuencia',
    factors: ['Temporada baja', 'Competencia local']
  },
  {
    route: 'CDMX - Puebla',
    currentDemand: 65,
    predictedDemand: 85,
    trend: 'increasing',
    trendPercent: 31,
    confidence: 78,
    recommendation: 'Considerar nueva ruta',
    factors: ['Crecimiento turístico', 'Nuevos desarrollos']
  }
]

const seasonalityData = [
  { month: 'Ene', demand: 78, capacity: 100, utilization: 78 },
  { month: 'Feb', demand: 85, capacity: 100, utilization: 85 },
  { month: 'Mar', demand: 92, capacity: 100, utilization: 92 },
  { month: 'Apr', demand: 105, capacity: 120, utilization: 88 },
  { month: 'May', demand: 118, capacity: 120, utilization: 98 },
  { month: 'Jun', demand: 142, capacity: 150, utilization: 95 },
  { month: 'Jul', demand: 165, capacity: 180, utilization: 92 },
  { month: 'Aug', demand: 158, capacity: 180, utilization: 88 },
  { month: 'Sep', demand: 125, capacity: 150, utilization: 83 },
  { month: 'Oct', demand: 108, capacity: 120, utilization: 90 },
  { month: 'Nov', demand: 95, capacity: 100, utilization: 95 },
  { month: 'Dec', demand: 135, capacity: 150, utilization: 90 }
]

const alertsData = [
  {
    type: 'high-demand',
    route: 'CDMX - Guadalajara',
    message: 'Demanda proyectada 47% mayor para el fin de semana',
    urgency: 'high',
    action: 'Incrementar capacidad'
  },
  {
    type: 'capacity-shortage',
    route: 'CDMX - Monterrey',
    message: 'Capacidad insuficiente para los próximos 3 días',
    urgency: 'medium',
    action: 'Reasignar vehículos'
  },
  {
    type: 'low-demand',
    route: 'Guadalajara - León',
    message: 'Demanda por debajo del 50% de capacidad',
    urgency: 'low',
    action: 'Considerar reducir frecuencia'
  }
]

export const DemandForecasting: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState('CDMX - Guadalajara')
  const [forecastPeriod, setForecastPeriod] = useState('7d')
  const [viewType, setViewType] = useState('demand')

  const handleRefreshData = () => {
    // Aquí iría la lógica para actualizar los datos
    console.log('Actualizando datos de predicción...')
  }

  const handleExportData = () => {
    // Aquí iría la lógica para exportar los datos
    console.log('Exportando datos de predicción...')
  }

  const averageConfidence = routeAnalysisData.reduce((sum, route) => sum + route.confidence, 0) / routeAnalysisData.length
  const totalPredictedDemand = routeAnalysisData.reduce((sum, route) => sum + route.predictedDemand, 0)
  const averageGrowth = routeAnalysisData.reduce((sum, route) => sum + route.trendPercent, 0) / routeAnalysisData.length

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h5" fontWeight="bold" className="text-brand-black dark:text-white">
            Predicción de Demanda
          </Typography>
          <Typography variant="body2" className="text-secondary-600 dark:text-gray-400">
            Análisis predictivo inteligente para optimización de rutas
          </Typography>
        </Box>
        <Box className="flex items-center gap-3">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Ruta</InputLabel>
            <Select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}>
              {routeAnalysisData.map((route) => (
                <MenuItem key={route.route} value={route.route}>
                  {route.route}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Período</InputLabel>
            <Select value={forecastPeriod} onChange={(e) => setForecastPeriod(e.target.value)}>
              <MenuItem value="7d">7 días</MenuItem>
              <MenuItem value="14d">14 días</MenuItem>
              <MenuItem value="30d">30 días</MenuItem>
              <MenuItem value="90d">90 días</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Actualizar datos">
            <IconButton onClick={handleRefreshData}>
              <RefreshCw className="h-5 w-5" />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportData}
            size="small"
          >
            Exportar
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <Brain className="h-8 w-8 text-purple-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  {averageConfidence.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Confianza Promedio
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  {totalPredictedDemand}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Demanda Proyectada
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
                  +{averageGrowth.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crecimiento Esperado
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  {alertsData.filter(a => a.urgency === 'high').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alertas Críticas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="semibold" className="mb-4">
            Alertas de Demanda
          </Typography>
          <Box className="space-y-3">
            {alertsData.map((alert, index) => (
              <Alert 
                key={index} 
                severity={alert.urgency === 'high' ? 'error' : alert.urgency === 'medium' ? 'warning' : 'info'}
                className="flex items-center"
              >
                <Box className="flex-1">
                  <Box className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4" />
                    <Typography variant="body2" fontWeight="medium">
                      {alert.route}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {alert.message}
                  </Typography>
                </Box>
                <Box className="ml-4">
                  <Chip 
                    label={alert.action} 
                    size="small" 
                    color={alert.urgency === 'high' ? 'error' : alert.urgency === 'medium' ? 'warning' : 'info'}
                  />
                </Box>
              </Alert>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Forecast Chart */}
        <Card>
          <CardContent>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6" fontWeight="semibold">
                Predicción de Demanda - {selectedRoute}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Vista</InputLabel>
                <Select value={viewType} onChange={(e) => setViewType(e.target.value)}>
                  <MenuItem value="demand">Demanda</MenuItem>
                  <MenuItem value="confidence">Confianza</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={demandForecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} />
                <YAxis />
                <RechartsTooltip 
                  formatter={(value, name) => [
                    value,
                    name === 'historical' ? 'Histórico' : 
                    name === 'predicted' ? 'Predicción' : 
                    name === 'confidence' ? 'Confianza (%)' : name
                  ]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="historical" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="historical"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="predicted"
                  connectNulls={false}
                />
                {viewType === 'confidence' && (
                  <Area 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                    name="confidence"
                  />
                )}
                <ReferenceLine x="2024-01-07" stroke="#666" strokeDasharray="2 2" />
              </ComposedChart>
            </ResponsiveContainer>
            <Box className="mt-4 flex items-center justify-center gap-6">
              <Box className="flex items-center">
                <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
                <Typography variant="body2" color="text.secondary">
                  Datos Históricos
                </Typography>
              </Box>
              <Box className="flex items-center">
                <div className="w-4 h-0.5 bg-yellow-500 mr-2 border-dashed border-t-2"></div>
                <Typography variant="body2" color="text.secondary">
                  Predicción
                </Typography>
              </Box>
              <Box className="flex items-center">
                <div className="w-4 h-0.5 bg-gray-400 mr-2"></div>
                <Typography variant="body2" color="text.secondary">
                  Hoy
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Seasonality Chart */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="semibold" className="mb-4">
              Análisis de Estacionalidad
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={seasonalityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="capacity" fill="#E5E7EB" name="Capacidad" />
                <Line 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  name="Demanda"
                />
                <Line 
                  type="monotone" 
                  dataKey="utilization" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Utilización (%)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Route Analysis Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="semibold" className="mb-4">
            Análisis por Ruta
          </Typography>
          <Box className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Ruta</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Demanda Actual</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Demanda Predicha</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Tendencia</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Confianza</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Recomendación</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Factores</th>
                </tr>
              </thead>
              <tbody>
                {routeAnalysisData.map((route, index) => (
                  <tr key={index} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                    <td className="py-3 px-4">
                      <Box className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                        <Typography variant="body2" fontWeight="medium">
                          {route.route}
                        </Typography>
                      </Box>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Typography variant="body2">
                        {route.currentDemand}
                      </Typography>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Typography variant="body2" fontWeight="semibold">
                        {route.predictedDemand}
                      </Typography>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Box className="flex items-center justify-end">
                        {route.trend === 'increasing' ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <Typography 
                          variant="body2" 
                          className={route.trend === 'increasing' ? 'text-green-600' : 'text-red-600'}
                        >
                          {route.trendPercent > 0 ? '+' : ''}{route.trendPercent}%
                        </Typography>
                      </Box>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Box className="flex items-center justify-end gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${route.confidence}%` }}
                          ></div>
                        </div>
                        <Typography variant="body2">
                          {route.confidence}%
                        </Typography>
                      </Box>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Chip 
                        label={route.recommendation}
                        size="small"
                        color={
                          route.recommendation.includes('Incrementar') ? 'success' :
                          route.recommendation.includes('Reducir') ? 'warning' :
                          'info'
                        }
                      />
                    </td>
                    <td className="text-right py-3 px-4">
                      <Box className="flex flex-wrap gap-1 justify-end">
                        {route.factors.slice(0, 2).map((factor, idx) => (
                          <Chip 
                            key={idx}
                            label={factor}
                            size="small"
                            variant="outlined"
                            className="text-xs"
                          />
                        ))}
                        {route.factors.length > 2 && (
                          <Tooltip title={route.factors.slice(2).join(', ')}>
                            <Chip 
                              label={`+${route.factors.length - 2}`}
                              size="small"
                              variant="outlined"
                              className="text-xs"
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardContent>
          <Box className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-purple-500" />
            <Typography variant="h6" fontWeight="semibold">
              Insights de IA
            </Typography>
          </Box>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Oportunidad:</strong> La ruta CDMX-Guadalajara muestra un patrón de crecimiento 
                del 47% para el fin de semana. Se recomienda incrementar la capacidad.
              </Typography>
            </Alert>
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Atención:</strong> La ruta Guadalajara-León presenta baja demanda. 
                Considere estrategias de promoción o reducción de frecuencia.
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
} 