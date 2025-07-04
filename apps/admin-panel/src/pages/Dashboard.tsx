import React from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  Button,
  Divider
} from '@mui/material'
import { 
  Users, 
  UserCheck, 
  Car, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp 
} from 'lucide-react'

export const Dashboard: React.FC = () => {
  // Mock data - replace with real data from Firebase
  const stats = [
    {
      name: 'Viajeros Activos',
      value: '2,345',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Conductores Aprobados',
      value: '89',
      change: '+5%',
      changeType: 'increase',
      icon: UserCheck,
    },
    {
      name: 'Viajes Hoy',
      value: '12',
      change: '+2%',
      changeType: 'increase',
      icon: Car,
    },
    {
      name: 'Ingresos del Mes',
      value: '$45,231',
      change: '+18%',
      changeType: 'increase',
      icon: DollarSign,
    },
  ]

  const recentAlerts = [
    {
      id: 1,
      message: 'Conductor Juan Pérez reportó un incidente en la Ruta CDMX-GDL',
      time: 'Hace 2 horas',
      type: 'incident',
    },
    {
      id: 2,
      message: 'Nuevo conductor pendiente de aprobación',
      time: 'Hace 4 horas',
      type: 'pending',
    },
    {
      id: 3,
      message: 'Viaje cancelado por condiciones climáticas',
      time: 'Hace 6 horas',
      type: 'cancelled',
    },
  ]

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
    <Box className="space-y-6">
      {/* Header */}
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" className="text-brand-black dark:text-dark-text-primary">
          Dashboard
        </Typography>
        <Typography variant="body1" className="text-secondary-600 dark:text-dark-text-secondary">
          Bienvenido al panel administrativo de De Compas
        </Typography>
      </Box>

      {/* Stats */}
      <Box className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name}>
              <CardContent>
                <Box className="flex items-center">
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
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Box>

      <Box className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Alerts */}
        <Card>
          <Box className="px-6 py-4 border-b border-divider">
            <Typography variant="h6" component="h3" className="text-brand-black dark:text-dark-text-primary">
              Alertas Recientes
            </Typography>
          </Box>
          <Box>
            {recentAlerts.map((alert, index) => (
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
                {index < recentAlerts.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Box className="px-6 py-4 border-b border-divider">
            <Typography variant="h6" component="h3" className="text-brand-black dark:text-dark-text-primary">
              Acciones Rápidas
            </Typography>
          </Box>
          <Box className="p-6 space-y-4">
            <Button 
              variant="contained" 
              fullWidth 
              className="bg-brand-yellow text-brand-black hover:bg-brand-yellow/90"
            >
              Crear Nueva Ruta
            </Button>
            <Button 
              variant="contained" 
              fullWidth 
              className="bg-secondary-800 text-white hover:bg-secondary-900"
            >
              Revisar Conductores Pendientes
            </Button>
            <Button 
              variant="outlined" 
              fullWidth 
              className="border-neutral-300 text-secondary-800 hover:bg-neutral-50 dark:border-dark-border-primary dark:text-dark-text-primary dark:hover:bg-dark-bg-hover"
            >
              Generar Reporte Mensual
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  )
} 