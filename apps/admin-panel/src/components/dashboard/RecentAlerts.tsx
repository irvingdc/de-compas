import React from 'react'
import { Box, Typography, Card, Chip, Divider } from '@mui/material'
import { AlertTriangle } from 'lucide-react'

interface Alert {
  id: number
  message: string
  time: string
  type: string
}

interface RecentAlertsProps {
  alerts: Alert[]
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts }) => {
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'incident':
        return 'error'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'default'
      default:
        return 'default'
    }
  }

  const getAlertText = (type: string) => {
    switch (type) {
      case 'incident':
        return 'Incidente'
      case 'pending':
        return 'Pendiente'
      case 'cancelled':
        return 'Cancelado'
      default:
        return type
    }
  }

  return (
    <Card>
      <Box className="px-6 py-4 border-b border-divider">
        <Typography variant="h6" component="h3" className="text-brand-black dark:text-dark-text-primary">
          Alertas Recientes
        </Typography>
      </Box>
      <Box>
        {alerts.map((alert, index) => (
          <Box key={alert.id}>
            <Box className="px-6 py-4 flex items-center space-x-3">
              <Box className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </Box>
              <Box className="flex-1 min-w-0">
                <Typography variant="body2" className="text-brand-black dark:text-dark-text-primary">
                  {alert.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {alert.time}
                </Typography>
              </Box>
              <Box className="flex-shrink-0">
                <Chip 
                  label={getAlertText(alert.type)}
                  color={getAlertColor(alert.type) as any}
                  size="small"
                />
              </Box>
            </Box>
            {index < alerts.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    </Card>
  )
} 