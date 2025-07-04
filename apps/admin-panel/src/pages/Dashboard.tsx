import React from 'react'
import { Users, UserCheck, Car, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Dashboard</h1>
        <p className="text-secondary-600">Bienvenido al panel administrativo de De Compas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white dark:bg-dark-bg-card overflow-hidden shadow rounded-lg border border-neutral-200 dark:border-dark-border-secondary">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-secondary-400 dark:text-dark-text-muted" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-secondary-500 dark:text-dark-text-secondary truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-brand-black dark:text-dark-text-primary">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-success-600 dark:text-success-400">
                          <TrendingUp className="h-4 w-4 text-success-500 dark:text-success-400" />
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Alerts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Alertas Recientes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="px-6 py-4 flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    alert.type === 'incident' 
                      ? 'bg-red-100 text-red-800'
                      : alert.type === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {alert.type === 'incident' ? 'Incidente' : 
                     alert.type === 'pending' ? 'Pendiente' : 'Cancelado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="text-lg font-medium text-brand-black">Acciones Rápidas</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full bg-primary-500 text-brand-black py-2 px-4 rounded-md hover:bg-primary-600 transition-colors font-medium">
              Crear Nueva Ruta
            </button>
            <button className="w-full bg-secondary-800 text-white py-2 px-4 rounded-md hover:bg-secondary-900 transition-colors font-medium">
              Revisar Conductores Pendientes
            </button>
            <button className="w-full border border-neutral-300 text-secondary-800 py-2 px-4 rounded-md hover:bg-neutral-50 transition-colors font-medium">
              Generar Reporte Mensual
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 