import React from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Box, 
  Typography
} from '@mui/material'
import { X, TrendingUp } from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

interface ChartDialogProps {
  open: boolean
  onClose: () => void
  stat: {
    name: string
    value: string
    change: string
    changeType: string
    icon: React.ComponentType<any>
    dataKey: string
    isAccumulated: boolean
  }
  chartData: any[]
}

export const ChartDialog: React.FC<ChartDialogProps> = ({ 
  open, 
  onClose, 
  stat, 
  chartData 
}) => {
  const Icon = stat.icon

  const formatYAxis = (tickItem: number) => {
    if (stat.name === 'Ingresos del Mes') {
      return `$${(tickItem / 1000).toFixed(0)}k`
    }
    return tickItem.toLocaleString()
  }

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem)
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Detectar tema oscuro
  const isDarkMode = document.documentElement.classList.contains('dark')
  
  // Colores dinámicos para ejes
  const axisColors = {
    tick: isDarkMode ? '#D1D5DB' : '#374151',
    line: isDarkMode ? '#6B7280' : '#9CA3AF',
    grid: isDarkMode ? '#6B7280' : '#D1D5DB'
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        className: "bg-white dark:bg-dark-bg-primary"
      }}
    >
      <DialogTitle className="flex items-center justify-between p-6">
        <Box className="flex items-center space-x-3">
          <Box className="flex-shrink-0">
            <Icon className="h-8 w-8 text-secondary-400 dark:text-dark-text-muted" />
          </Box>
          <Box>
            <Typography variant="h5" component="h2" className="text-brand-black dark:text-dark-text-primary font-semibold">
              {stat.name}
            </Typography>
            <Box className="flex items-center space-x-2 mt-1">
              <Typography variant="h4" className="text-brand-black dark:text-dark-text-primary font-bold">
                {stat.value}
              </Typography>
              <Box className="flex items-center space-x-1">
                <TrendingUp className="h-5 w-5 text-success-500 dark:text-success-400" />
                <Typography variant="body1" color="success.main" fontWeight="semibold">
                  {stat.change}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <IconButton 
          onClick={onClose}
          className="text-secondary-400 hover:text-secondary-600 dark:text-dark-text-muted dark:hover:text-dark-text-primary"
        >
          <X className="h-6 w-6" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="p-6">
        <Box className="mb-6">
          <Typography variant="h6" className="text-brand-black dark:text-dark-text-primary mb-2">
            Evolución de los últimos 30 días
          </Typography>
          <Typography variant="body2" className="text-secondary-600 dark:text-dark-text-secondary">
            {stat.isAccumulated 
              ? 'Valores acumulados que muestran el crecimiento total'
              : 'Valores diarios que muestran la actividad por día'
            }
          </Typography>
        </Box>

        <Box className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={axisColors.grid}
                strokeOpacity={isDarkMode ? 0.3 : 0.4}
              />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fill: axisColors.tick, fontSize: 12 }}
                axisLine={{ stroke: axisColors.line }}
                tickLine={{ stroke: axisColors.line }}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                tick={{ fill: axisColors.tick, fontSize: 12 }}
                axisLine={{ stroke: axisColors.line }}
                tickLine={{ stroke: axisColors.line }}
              />
              <Area
                type="monotone"
                dataKey={stat.dataKey}
                stroke="none"
                fill="url(#colorGradient)"
                fillOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey={stat.dataKey}
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
              />
              <Tooltip 
                content={<ChartTooltip statName={stat.name} />}
                cursor={{ stroke: '#F59E0B', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Box className="text-center p-4 bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg">
            <Typography variant="h6" className="text-brand-black dark:text-dark-text-primary font-semibold">
              {chartData[0]?.[stat.dataKey]?.toLocaleString() || '0'}
            </Typography>
            <Typography variant="body2" className="text-secondary-600 dark:text-dark-text-secondary">
              Hace 30 días
            </Typography>
          </Box>
          <Box className="text-center p-4 bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg">
            <Typography variant="h6" className="text-brand-black dark:text-dark-text-primary font-semibold">
              {chartData[14]?.[stat.dataKey]?.toLocaleString() || '0'}
            </Typography>
            <Typography variant="body2" className="text-secondary-600 dark:text-dark-text-secondary">
              Hace 15 días
            </Typography>
          </Box>
          <Box className="text-center p-4 bg-secondary-50 dark:bg-dark-bg-secondary rounded-lg">
            <Typography variant="h6" className="text-brand-black dark:text-dark-text-primary font-semibold">
              {chartData[29]?.[stat.dataKey]?.toLocaleString() || '0'}
            </Typography>
            <Typography variant="body2" className="text-secondary-600 dark:text-dark-text-secondary">
              Hoy
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
} 