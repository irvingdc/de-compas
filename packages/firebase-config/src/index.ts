import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

// Firebase configuration from environment variables
// Note: For server-side (Node.js), use process.env instead of import.meta.env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || ''
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Export the app instance
export default app

// Types for Firestore collections
export interface User {
  uid: string
  email: string
  name: string
  phone?: string
  role: 'admin' | 'conductor' | 'viajero'
  status: 'pending' | 'active' | 'blocked'
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Driver {
  uid: string
  name: string
  email: string
  phone: string
  rfc?: string
  documents: {
    ine?: string
    license?: string
    circulation?: string
    insurance?: string
    proofOfAddress?: string
  }
  status: 'pending' | 'approved' | 'rejected'
  vehicleIds: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Vehicle {
  id: string
  driverId: string
  brand: string
  model: string
  year: number
  type: 'eléctrico' | 'híbrido'
  seats: number
  licensePlate: string
  photoUrl?: string
  status: 'active' | 'inactive' | 'maintenance'
  createdAt: Date
  updatedAt: Date
}

export interface Route {
  id: string
  origin: string
  destination: string
  price: number
  estimatedDuration: string
  frequency: string[]
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Trip {
  id: string
  routeId: string
  driverId: string
  vehicleId: string
  date: Date
  departureTime: string
  arrivalTime: string
  availableSeats: number
  occupiedSeats: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  passengers: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Ticket {
  id: string
  tripId: string
  userId: string
  seatNumber: number
  price: number
  status: 'paid' | 'cancelled' | 'used'
  qrCode: string
  paymentId: string
  createdAt: Date
  updatedAt: Date
}

export interface Alert {
  id: string
  userId: string
  tripId?: string
  type: 'panic' | 'incident' | 'help'
  message: string
  location: {
    lat: number
    lng: number
  }
  status: 'open' | 'in_progress' | 'resolved'
  createdAt: Date
  resolvedAt?: Date
} 