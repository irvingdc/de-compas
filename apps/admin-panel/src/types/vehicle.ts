import { Timestamp } from 'firebase/firestore'

export enum VehicleStatus {
    ACTIVE = 'Activo',
    INACTIVE = 'Inactivo',
    MAINTENANCE = 'En mantenimiento',
    OUT_OF_SERVICE = 'Fuera de servicio'
}

export interface Vehicle {
    id: string
    brand: string
    model: string
    year: number
    seats: number
    imageUrl: string
    kmRange: number
    chargeTime: number
    active: boolean
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface CreateVehicleData {
    brand: string
    model: string
    year: number
    seats: number
    imageUrl: string
    kmRange: number
    chargeTime: number
    active?: boolean
}

export interface UpdateVehicleData {
    id: string
    brand?: string
    model?: string
    year?: number
    seats?: number
    imageUrl?: string
    kmRange?: number
    chargeTime?: number
    active?: boolean
}

export interface VehicleFilters {
    id?: string
    brand?: string
    model?: string
    minYear?: number
    maxYear?: number
    minSeats?: number
    maxSeats?: number
    active?: boolean
}

export interface VehicleSearchResult {
    vehicles: Vehicle[]
    total: number
    hasMore: boolean
}

export interface DriverVehicle {
    id: string
    status: VehicleStatus
    driverId: string
    vehicleId: string
    color: string
    plate: string
    imageUrl: string
}