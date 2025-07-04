export interface Trip {
  id: string
  routeId: string
  routeName: string
  origin: string
  destination: string
  driverId: string
  driverName: string
  driverEmail: string
  driverPhone: string
  passengers: Passenger[]
  maxPassengers: number
  estimatedDeparture: string
  estimatedArrival: string
  actualDeparture?: string
  actualArrival?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed'
  price: number
  distance: number // en kilómetros
  createdAt: string
  updatedAt: string
  notes?: string
  cancellationReason?: string
  delayReason?: string
}

export interface Passenger {
  id: string
  name: string
  email: string
  phone: string
  pickupLocation: string
  dropoffLocation: string
  seatNumber: number
  status: 'confirmed' | 'cancelled' | 'no_show'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentMethod: 'cash' | 'card' | 'transfer'
  specialRequests?: string
}

export interface TripFilters {
  status?: 'all' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed'
  origin?: string
  destination?: string
  driverId?: string
  dateFrom?: string
  dateTo?: string
  searchTerm?: string
} 