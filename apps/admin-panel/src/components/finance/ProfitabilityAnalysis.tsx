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
  LinearProgress
} from '@mui/material'
import { TrendingUp, DollarSign, TrendingDown, BarChart3, Route, Users } from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Demo data
const routeProfitabilityData = [
  { route: 'CDMX - Guadalajara', revenue: 45000, costs: 28000, profit: 17000, margin: 37.8, trips: 28 },
  { route: 'CDMX - Monterrey', revenue: 38000, costs: 22000, profit: 16000, margin: 42.1, trips: 22 },
  { route: 'Guadalajara - Monterrey', revenue: 32000, costs: 24000, profit: 8000, margin: 25.0, trips: 18 },
  { route: 'CDMX - Puebla', revenue: 28000, costs: 18000, profit: 10000, margin: 35.7, trips: 35 },
  { route: 'Guadalajara - León', revenue: 22000, costs: 16000, profit: 6000, margin: 27.3, trips: 16 },
  { route: 'Monterrey - Saltillo', revenue: 18000, costs: 14000, profit: 4000, margin: 22.2, trips: 24 }
]

const monthlyTrendData = [
  { month: 'Ene', revenue: 180000, costs: 120000, profit: 60000 },
  { month: 'Feb', revenue: 195000, costs: 125000, profit: 70000 },
  { month: 'Mar', revenue: 210000, costs: 135000, profit: 75000 },
  { month: 'Abr', revenue: 225000, costs: 140000, profit: 85000 },
  { month: 'May', revenue: 240000, costs: 150000, profit: 90000 },
  { month: 'Jun', revenue: 255000, costs: 155000, profit: 100000 }
]

const profitMarginData = [
  { name: 'Rentables (>30%)', value: 65, color: '#10B981' },
  { name: 'Moderadas (20-30%)', value: 25, color: '#F59E0B' },
  { name: 'Problemáticas (<20%)', value: 10, color: '#EF4444' }
]

const costBreakdownData = [
  { category: 'Combustible', amount: 45000, percentage: 35 },
  { category: 'Mantenimiento', amount: 28000, percentage: 22 },
  { category: 'Seguros', amount: 20000, percentage: 16 },
  { category: 'Conductores', amount: 25000, percentage: 19 },
  { category: 'Otros', amount: 10000, percentage: 8 }
]

export const ProfitabilityAnalysis: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m')
  const [selectedRoute, setSelectedRoute] = useState('all')

  const totalRevenue = routeProfitabilityData.reduce((sum, route) => sum + route.revenue, 0)
  const totalCosts = routeProfitabilityData.reduce((sum, route) => sum + route.costs, 0)
  const totalProfit = totalRevenue - totalCosts
  const overallMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h5" fontWeight="bold" className="text-brand-black dark:text-white">
            Análisis de Rentabilidad
          </Typography>
          <Typography variant="body2" className="text-secondary-600 dark:text-gray-400">
            Análisis detallado de ingresos, costos y márgenes por ruta
          </Typography>
        </Box>
        <Box className="flex gap-4">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Período</InputLabel>
            <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
              <MenuItem value="1m">1 Mes</MenuItem>
              <MenuItem value="3m">3 Meses</MenuItem>
              <MenuItem value="6m">6 Meses</MenuItem>
              <MenuItem value="1y">1 Año</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Ruta</InputLabel>
            <Select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}>
              <MenuItem value="all">Todas las rutas</MenuItem>
              {routeProfitabilityData.map((route) => (
                <MenuItem key={route.route} value={route.route}>
                  {route.route}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  ${totalRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresos Totales
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  ${totalCosts.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Costos Totales
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <TrendingUp className="h-8 w-8 text-brand-yellow" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  ${totalProfit.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ganancia Neta
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  {overallMargin}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Margen Promedio
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="semibold" className="mb-4">
                Tendencia Mensual
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="costs" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Profit Margin Distribution */}
        <div>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="semibold" className="mb-4">
                Distribución de Márgenes
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={profitMarginData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {profitMarginData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <Box className="mt-4 space-y-2">
                {profitMarginData.map((item, index) => (
                  <Box key={index} className="flex items-center justify-between">
                    <Box className="flex items-center">
                      <Box 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <Typography variant="body2">{item.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="semibold">
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Route Profitability Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="semibold" className="mb-4">
            Rentabilidad por Ruta
          </Typography>
          <Box className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Ruta</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Ingresos</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Costos</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Ganancia</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Margen</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Viajes</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Estado</th>
                </tr>
              </thead>
              <tbody>
                {routeProfitabilityData.map((route, index) => (
                  <tr key={index} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                    <td className="py-3 px-4">
                      <Box className="flex items-center">
                        <Route className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                        <Typography variant="body2" fontWeight="medium">
                          {route.route}
                        </Typography>
                      </Box>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Typography variant="body2" className="text-green-600">
                        ${route.revenue.toLocaleString()}
                      </Typography>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Typography variant="body2" className="text-red-600">
                        ${route.costs.toLocaleString()}
                      </Typography>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Typography variant="body2" fontWeight="semibold">
                        ${route.profit.toLocaleString()}
                      </Typography>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Typography variant="body2" fontWeight="semibold">
                        {route.margin.toFixed(1)}%
                      </Typography>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Box className="flex items-center justify-end">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <Typography variant="body2">
                          {route.trips}
                        </Typography>
                      </Box>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Chip 
                        label={
                          route.margin > 30 ? 'Rentable' : 
                          route.margin > 20 ? 'Moderada' : 'Problemática'
                        }
                        size="small"
                        color={
                          route.margin > 30 ? 'success' : 
                          route.margin > 20 ? 'warning' : 'error'
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="semibold" className="mb-4">
            Desglose de Costos
          </Typography>
          <Box className="space-y-4">
            {costBreakdownData.map((cost, index) => (
              <Box key={index}>
                <Box className="flex justify-between items-center mb-2">
                  <Typography variant="body2" fontWeight="medium">
                    {cost.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${cost.amount.toLocaleString()} ({cost.percentage}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={cost.percentage} 
                  className="h-2 rounded-full"
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
} 