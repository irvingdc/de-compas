import React, { useState } from 'react'
import { Box, Typography, Card, CardContent, IconButton } from '@mui/material'
import { TrendingUp, Maximize2 } from 'lucide-react'
import { AreaChart, Area, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartDialog } from './ChartDialog'

interface StatCardProps {
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
  CustomTooltip: React.ComponentType<any>
}

export const StatCard: React.FC<StatCardProps> = ({ stat, chartData, CustomTooltip }) => {
  const Icon = stat.icon
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  return (
    <>
      <Card>
        <CardContent>
          <Box className="flex items-center mb-4">
            <Box className="flex-shrink-0">
              <Icon className="h-6 w-6 text-secondary-400 dark:text-dark-text-muted" />
            </Box>
            <Box className="ml-5 w-0 flex-1">
              <Typography variant="body2" color="text.secondary" className="truncate">
                {stat.name}
              </Typography>
              <Box className="flex items-baseline">
                <Typography variant="h4" component="div" fontWeight="semibold" className="text-brand-black dark:text-dark-text-primary">
                  {stat.value}
                </Typography>
                <Box className="ml-2 flex items-baseline">
                  <TrendingUp className="h-4 w-4 text-success-500 dark:text-success-400" />
                  <Typography variant="body2" color="success.main" fontWeight="semibold" className="ml-1">
                    {stat.change}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              onClick={handleOpenDialog}
              size="small"
              className="text-secondary-400 hover:text-secondary-600 dark:text-dark-text-muted dark:hover:text-dark-text-primary"
              title="Ver en pantalla completa"
            >
              <Maximize2 className="h-4 w-4" />
            </IconButton>
          </Box>
          
          {/* Chart */}
          <Box className="mt-4">
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={chartData}>
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
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip 
                  content={<CustomTooltip statName={stat.name} />}
                  cursor={{ stroke: '#F59E0B', strokeWidth: 1, strokeDasharray: '3 3' }}
                  labelFormatter={(label) => label}
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
          
          {/* Chart label */}
          <Typography variant="caption" color="text.secondary" className="mt-2 block text-center">
            Últimos 30 días
          </Typography>
        </CardContent>
      </Card>

      <ChartDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        stat={stat}
        chartData={chartData}
      />
    </>
  )
} 