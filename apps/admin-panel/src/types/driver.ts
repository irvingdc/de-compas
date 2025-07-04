export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  status: 'pending' | 'approved' | 'rejected'
  documentsComplete: boolean
  registeredAt: string // ISO date string
  licenseNumber?: string
  vehicleType?: string
  rating?: number
}

export interface CreateDriverData {
  name: string
  email: string
  phone: string
  licenseNumber?: string
  vehicleType?: string
}

export interface UpdateDriverData {
  name?: string
  email?: string
  phone?: string
  status?: 'pending' | 'approved' | 'rejected'
  documentsComplete?: boolean
  licenseNumber?: string
  vehicleType?: string
  rating?: number
}

export interface DriverFilters {
  status?: 'all' | 'pending' | 'approved' | 'rejected'
  searchTerm?: string
} 