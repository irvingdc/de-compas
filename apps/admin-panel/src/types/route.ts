import { Timestamp } from 'firebase/firestore'

export interface RouteStop {
  id: string
  name: string
  city: string
  state: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  estimatedTime: string // Format: "1h 30m" desde el origen
  order: number // Orden en la ruta
}

export interface Route {
  id: string
  name: string // Nombre descriptivo de la ruta
  origin: RouteStop
  destination: RouteStop
  stops: RouteStop[] // Paradas intermedias
  price: number // Precio base en pesos mexicanos
  duration: string // Duración estimada total
  distance: number // Distancia en kilómetros
  active: boolean
  description?: string
  amenities?: string[] // Servicios incluidos (WiFi, A/C, etc.)
  vehicleType?: string // Tipo de vehículo recomendado
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string // UID del usuario que creó la ruta
}

export interface CreateRouteData {
  name: string
  origin: Omit<RouteStop, 'id'>
  destination: Omit<RouteStop, 'id'>
  stops: Omit<RouteStop, 'id'>[]
  price: number
  duration: string
  distance: number
  active: boolean
  description?: string
  amenities?: string[]
  vehicleType?: string
}

export interface UpdateRouteData {
  name?: string
  origin?: Omit<RouteStop, 'id'>
  destination?: Omit<RouteStop, 'id'>
  stops?: Omit<RouteStop, 'id'>[]
  price?: number
  duration?: string
  distance?: number
  active?: boolean
  description?: string
  amenities?: string[]
  vehicleType?: string
}

export interface RouteFilters {
  origin?: string
  destination?: string
  active?: boolean
  minPrice?: number
  maxPrice?: number
  vehicleType?: string
}

export interface RouteSearchResult {
  routes: Route[]
  total: number
  hasMore: boolean
} 