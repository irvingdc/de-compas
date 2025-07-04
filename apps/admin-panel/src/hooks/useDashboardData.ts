import { useMemo } from 'react'
import { Users, UserCheck, Car, DollarSign } from 'lucide-react'

// MOCK DATA - TODO: Remove when connecting to Firebase
const generateMockData = () => {
  const today = new Date()
  const data = []
  
  for (let i = 0; i <= 29; i++) {
    // Calcular la fecha real (hace 29-i días)
    const date = new Date(today)
    date.setDate(date.getDate() - (29 - i))
    const dateString = date.toISOString().split('T')[0]
    
    // Viajeros Activos (acumulado) - siempre creciente
    const baseTravelers = 1800
    const growthRate = 15 // crecimiento diario promedio
    const randomVariation = Math.floor(Math.random() * 40) - 20 // variación de ±20
    const activeTravelers = baseTravelers + (i * growthRate) + randomVariation
    
    // Conductores Aprobados (acumulado) - siempre creciente
    const baseDrivers = 60
    const driverGrowthRate = 1.2 // crecimiento diario promedio
    const driverVariation = Math.floor(Math.random() * 6) - 3 // variación de ±3
    const approvedDrivers = baseDrivers + (i * driverGrowthRate) + driverVariation
    
    // Viajes Hoy (puntual) - valores variables
    const dailyTrips = 8 + Math.floor(Math.random() * 8)
    
    // Ingresos del Mes (puntual) - valores variables
    const dailyIncome = 1200 + Math.floor(Math.random() * 800)
    
    data.push({
      date: dateString,
      activeTravelers,
      approvedDrivers,
      dailyTrips,
      dailyIncome
    })
  }
  
  return data
}

export const useDashboardData = () => {
  const chartData = useMemo(() => generateMockData(), [])

  const stats = useMemo(() => [
    {
      name: 'Viajeros Activos',
      value: '2,345',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      dataKey: 'activeTravelers',
      isAccumulated: true,
    },
    {
      name: 'Conductores Aprobados',
      value: '89',
      change: '+5%',
      changeType: 'increase',
      icon: UserCheck,
      dataKey: 'approvedDrivers',
      isAccumulated: true,
    },
    {
      name: 'Viajes Hoy',
      value: '12',
      change: '+2%',
      changeType: 'increase',
      icon: Car,
      dataKey: 'dailyTrips',
      isAccumulated: false,
    },
    {
      name: 'Ingresos del Mes',
      value: '$45,231',
      change: '+18%',
      changeType: 'increase',
      icon: DollarSign,
      dataKey: 'dailyIncome',
      isAccumulated: false,
    },
  ], [])

  const recentAlerts = useMemo(() => [
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
  ], [])

  return {
    chartData,
    stats,
    recentAlerts,
  }
} 