import React from 'react'
import { Box } from '@mui/material'
import { 
  DashboardHeader, 
  StatsGrid, 
  RecentAlerts, 
  QuickActions 
} from '../components/dashboard'
import { useDashboardData } from '../hooks/useDashboardData'

export const Dashboard: React.FC = () => {
  const { chartData, stats, recentAlerts } = useDashboardData()

  return (
    <Box className="space-y-6">
      <DashboardHeader />
      <StatsGrid stats={stats} chartData={chartData} />
      
      <Box className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RecentAlerts alerts={recentAlerts} />
        <QuickActions />
      </Box>
    </Box>
  )
} 