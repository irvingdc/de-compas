import { Timestamp } from 'firebase/firestore'

export interface Route {
  id: string
  name: string // Nombre descriptivo de la ruta
  origin: {
    name: string
    city: string
    state: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  destination: {
    name: string
    city: string
    state: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  price: number // Precio base en pesos mexicanos
  duration: string // Duración estimada total
  distance: number // Distancia en kilómetros
  active: boolean
  description?: string
  vehicleType?: string // Tipo de vehículo recomendado
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string // UID del usuario que creó la ruta
}

export interface CreateRouteData {
  name: string
  origin: {
    name: string
    city: string
    state: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  destination: {
    name: string
    city: string
    state: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  price: number
  duration: string
  distance: number
  active: boolean
  description?: string
  vehicleType?: string
}

export interface UpdateRouteData {
  name?: string
  origin?: {
    name: string
    city: string
    state: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  destination?: {
    name: string
    city: string
    state: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  price?: number
  duration?: string
  distance?: number
  active?: boolean
  description?: string
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