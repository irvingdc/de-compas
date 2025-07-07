import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp,
  QueryConstraint,
  DocumentSnapshot,
  writeBatch
} from 'firebase/firestore'
import { db } from './firebase'
import { auth } from './firebase'
import { 
  Vehicle, 
  CreateVehicleData, 
  UpdateVehicleData, 
  VehicleFilters, 
  VehicleSearchResult
} from '../types/vehicle'

const COLLECTION_NAME = 'vehicles'

class VehicleService {
  private getCollection() {
    return collection(db, COLLECTION_NAME)
  }

  /**
   * Crear un nuevo tipo de vehículo
   */
  async createVehicle(data: CreateVehicleData): Promise<Vehicle> {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('Usuario no autenticado')
      }

      // Validar datos
      this.validateVehicleData(data)

      const now = Timestamp.now()
      const vehicleData = {
        ...data,
        active: data.active ?? true,
        createdAt: now,
        updatedAt: now,
        createdBy: currentUser.uid
      }

      const docRef = await addDoc(this.getCollection(), vehicleData)
      
      return {
        id: docRef.id,
        ...vehicleData
      }
    } catch (error) {
      console.error('Error creando vehículo:', error)
      throw new Error(`Error al crear vehículo: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Obtener un vehículo por ID
   */
  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        return null
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Vehicle
    } catch (error) {
      console.error('Error obteniendo vehículo:', error)
      throw new Error(`Error al obtener vehículo: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Obtener todos los vehículos con filtros y paginación
   */
  async getVehicles(
    filters: VehicleFilters = {},
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<VehicleSearchResult> {
    try {
      // Verificar autenticación
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.warn('Usuario no autenticado, pero permitiendo acceso público a vehículos')
      }

      // Estrategia optimizada: aplicar solo un filtro principal por consulta
      const constraints: QueryConstraint[] = []

      // Priorizar filtros: active > brand > model > year > seats
      if (filters.active !== undefined) {
        constraints.push(where('active', '==', filters.active))
        constraints.push(orderBy('brand'))
      } else if (filters.brand) {
        constraints.push(where('brand', '==', filters.brand))
        constraints.push(orderBy('model'))
      } else if (filters.model) {
        constraints.push(where('model', '==', filters.model))
        constraints.push(orderBy('year', 'desc'))
      } else if (filters.minYear !== undefined || filters.maxYear !== undefined) {
        // Para filtros de año, usar un rango
        if (filters.minYear !== undefined) {
          constraints.push(where('year', '>=', filters.minYear))
        }
        if (filters.maxYear !== undefined) {
          constraints.push(where('year', '<=', filters.maxYear))
        }
        constraints.push(orderBy('year', 'desc'))
      } else if (filters.minSeats !== undefined || filters.maxSeats !== undefined) {
        // Para filtros de asientos, usar un rango
        if (filters.minSeats !== undefined) {
          constraints.push(where('seats', '>=', filters.minSeats))
        }
        if (filters.maxSeats !== undefined) {
          constraints.push(where('seats', '<=', filters.maxSeats))
        }
        constraints.push(orderBy('seats'))
      } else {
        // Consulta básica sin filtros
        constraints.push(orderBy('brand'))
      }

      constraints.push(limit(pageSize + 1)) // +1 para saber si hay más páginas

      // Paginación
      if (lastDoc) {
        constraints.push(startAfter(lastDoc))
      }

      console.log('Ejecutando consulta de vehículos con:', { filters, pageSize })
      
      const q = query(this.getCollection(), ...constraints)
      const querySnapshot = await getDocs(q)

      console.log('Consulta exitosa, documentos encontrados:', querySnapshot.size)

      let vehicles: Vehicle[] = []
      const docs: DocumentSnapshot[] = []

      querySnapshot.forEach((doc) => {
        docs.push(doc)
        vehicles.push({
          id: doc.id,
          ...doc.data()
        } as Vehicle)
      })

      // Aplicar filtros adicionales en el cliente para consultas compuestas
      vehicles = this.applyClientSideFilters(vehicles, filters)

      const hasMore = vehicles.length > pageSize
      if (hasMore) {
        vehicles.pop() // Remover el documento extra
      }

      return {
        vehicles,
        total: vehicles.length,
        hasMore
      }
    } catch (error: any) {
      console.error('Error obteniendo vehículos:', error)
      console.error('Código del error:', error.code)
      console.error('Mensaje del error:', error.message)
      
      // Verificar tipos específicos de errores
      if (error.code === 'permission-denied') {
        throw new Error('Sin permisos para acceder a los vehículos. Verifica las reglas de Firestore.')
      } else if (error.code === 'unauthenticated') {
        throw new Error('Usuario no autenticado. Inicia sesión para continuar.')
      } else if (error.code === 'failed-precondition' && error.message.includes('index')) {
        throw new Error('Los índices de búsqueda se están creando. Intenta de nuevo en unos minutos.')
      } else {
        throw new Error(`Error al obtener vehículos: ${error.message || 'Error desconocido'}`)
      }
    }
  }

  /**
   * Actualizar un vehículo
   */
  async updateVehicle(id: string, data: UpdateVehicleData): Promise<Vehicle> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      
      // Verificar que el vehículo existe
      const existingDoc = await getDoc(docRef)
      if (!existingDoc.exists()) {
        throw new Error('Vehículo no encontrado')
      }

      // Preparar datos de actualización
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now()
      }

      await updateDoc(docRef, updateData)

      // Obtener el vehículo actualizado
      const updatedDoc = await getDoc(docRef)
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Vehicle
    } catch (error) {
      console.error('Error actualizando vehículo:', error)
      throw new Error(`Error al actualizar vehículo: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Eliminar un vehículo
   */
  async deleteVehicle(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      
      // Verificar que el vehículo existe
      const existingDoc = await getDoc(docRef)
      if (!existingDoc.exists()) {
        throw new Error('Vehículo no encontrado')
      }

      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error eliminando vehículo:', error)
      throw new Error(`Error al eliminar vehículo: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Eliminar múltiples vehículos
   */
  async deleteMultipleVehicles(ids: string[]): Promise<void> {
    try {
      const batch = writeBatch(db)
      
      ids.forEach(id => {
        const docRef = doc(db, COLLECTION_NAME, id)
        batch.delete(docRef)
      })

      await batch.commit()
    } catch (error) {
      console.error('Error eliminando vehículos:', error)
      throw new Error(`Error al eliminar vehículos: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Activar/desactivar un vehículo
   */
  async toggleVehicleStatus(id: string, active: boolean): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      await updateDoc(docRef, {
        active,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error cambiando estado de vehículo:', error)
      throw new Error(`Error al cambiar estado de vehículo: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Activar múltiples vehículos
   */
  async activateMultipleVehicles(ids: string[]): Promise<void> {
    try {
      const batch = writeBatch(db)
      
      ids.forEach(id => {
        const docRef = doc(db, COLLECTION_NAME, id)
        batch.update(docRef, {
          active: true,
          updatedAt: Timestamp.now()
        })
      })

      await batch.commit()
    } catch (error) {
      console.error('Error activando vehículos:', error)
      throw new Error(`Error al activar vehículos: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Desactivar múltiples vehículos
   */
  async deactivateMultipleVehicles(ids: string[]): Promise<void> {
    try {
      const batch = writeBatch(db)
      
      ids.forEach(id => {
        const docRef = doc(db, COLLECTION_NAME, id)
        batch.update(docRef, {
          active: false,
          updatedAt: Timestamp.now()
        })
      })

      await batch.commit()
    } catch (error) {
      console.error('Error desactivando vehículos:', error)
      throw new Error(`Error al desactivar vehículos: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Buscar vehículos por texto
   */
  async searchVehicles(searchTerm: string, pageSize: number = 20): Promise<VehicleSearchResult> {
    try {
      // Firestore no tiene búsqueda de texto completo nativa
      // Implementamos búsqueda por campos específicos
      const searchTermLower = searchTerm.toLowerCase()
      
      const q = query(
        this.getCollection(),
        orderBy('brand'),
        limit(pageSize)
      )

      const querySnapshot = await getDocs(q)
      const allVehicles: Vehicle[] = []

      querySnapshot.forEach((doc) => {
        allVehicles.push({
          id: doc.id,
          ...doc.data()
        } as Vehicle)
      })

      // Filtrar en el cliente (para demo, en producción usar Algolia o similar)
      const filteredVehicles = allVehicles.filter(vehicle => 
        vehicle.brand.toLowerCase().includes(searchTermLower) ||
        vehicle.model.toLowerCase().includes(searchTermLower) ||
        vehicle.year.toString().includes(searchTermLower)
      )

      return {
        vehicles: filteredVehicles,
        total: filteredVehicles.length,
        hasMore: false
      }
    } catch (error) {
      console.error('Error buscando vehículos:', error)
      throw new Error(`Error al buscar vehículos: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Aplicar filtros adicionales en el cliente
   */
  private applyClientSideFilters(vehicles: Vehicle[], filters: VehicleFilters): Vehicle[] {
    return vehicles.filter(vehicle => {
      // Filtrar por marca si no se usó como filtro principal
      if (filters.brand && vehicle.brand !== filters.brand) {
        return false
      }
      
      // Filtrar por modelo si no se usó como filtro principal
      if (filters.model && vehicle.model !== filters.model) {
        return false
      }
      
      // Filtrar por estado si no se usó como filtro principal
      if (filters.active !== undefined && vehicle.active !== filters.active) {
        return false
      }
      
      // Filtrar por año si no se usó como filtro principal
      if (filters.minYear !== undefined && vehicle.year < filters.minYear) {
        return false
      }
      if (filters.maxYear !== undefined && vehicle.year > filters.maxYear) {
        return false
      }
      
      // Filtrar por asientos si no se usó como filtro principal
      if (filters.minSeats !== undefined && vehicle.seats < filters.minSeats) {
        return false
      }
      if (filters.maxSeats !== undefined && vehicle.seats > filters.maxSeats) {
        return false
      }
      
      return true
    })
  }

  /**
   * Validar datos de vehículo
   */
  private validateVehicleData(data: CreateVehicleData): void {
    if (!data.brand || data.brand.trim().length === 0) {
      throw new Error('La marca del vehículo es requerida')
    }

    if (!data.model || data.model.trim().length === 0) {
      throw new Error('El modelo del vehículo es requerido')
    }

    if (data.year < 1900 || data.year > new Date().getFullYear() + 1) {
      throw new Error('El año del vehículo debe estar entre 1900 y el año actual')
    }

    if (data.seats <= 0 || data.seats > 50) {
      throw new Error('El número de asientos debe estar entre 1 y 50')
    }

    if (data.kmRange <= 0) {
      throw new Error('El rango de kilómetros debe ser mayor a 0')
    }



    if (data.chargeTime <= 0) {
      throw new Error('El tiempo de carga debe ser mayor a 0')
    }

    if (!data.imageUrl || data.imageUrl.trim().length === 0) {
      throw new Error('La URL de la imagen es requerida')
    }
  }
}

export const vehicleService = new VehicleService()
export default vehicleService 