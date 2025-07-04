export interface Traveler {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'suspended'
  registeredAt: string // ISO date string
  lastTrip?: string
  totalTrips?: number
  rating?: number
  avatar?: string
  location?: string
  preferences?: string[]
}

export interface CreateTravelerData {
  name: string
  email: string
  phone: string
  avatar?: string
  location?: string
}

export interface UpdateTravelerData {
  name?: string
  email?: string
  phone?: string
  status?: 'active' | 'inactive' | 'suspended'
  avatar?: string
  location?: string
  preferences?: string[]
  rating?: number
  lastTrip?: string
  totalTrips?: number
}

export interface TravelerFilters {
  status?: 'all' | 'active' | 'inactive' | 'suspended'
  searchTerm?: string
} 