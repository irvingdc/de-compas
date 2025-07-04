import React from 'react'
import { Box } from '@mui/material'
import { StatCard } from './StatCard'
import { ChartTooltip } from './ChartTooltip'

interface Stat {
  name: string
  value: string
  change: string
  changeType: string
  icon: React.ComponentType<any>
  dataKey: string
  isAccumulated: boolean
}

interface StatsGridProps {
  stats: Stat[]
  chartData: any[]
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, chartData }) => {
  return (
    <Box className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard 
          key={stat.name} 
          stat={stat} 
          chartData={chartData} 
          CustomTooltip={ChartTooltip}
        />
      ))}
    </Box>
  )
} 