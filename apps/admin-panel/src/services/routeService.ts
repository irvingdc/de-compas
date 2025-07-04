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
  Route, 
  CreateRouteData, 
  UpdateRouteData, 
  RouteFilters, 
  RouteSearchResult
} from '../types/route'

const COLLECTION_NAME = 'routes'

class RouteService {
  private getCollection() {
    return collection(db, COLLECTION_NAME)
  }

  /**
   * Crear una nueva ruta
   */
  async createRoute(data: CreateRouteData): Promise<Route> {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('Usuario no autenticado')
      }

      // Validar datos
      this.validateRouteData(data)

      const now = Timestamp.now()
      const routeData = {
        ...data,
        createdAt: now,
        updatedAt: now,
        createdBy: currentUser.uid
      }

      const docRef = await addDoc(this.getCollection(), routeData)
      
      return {
        id: docRef.id,
        ...routeData
      }
    } catch (error) {
      console.error('Error creando ruta:', error)
      throw new Error(`Error al crear ruta: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Obtener una ruta por ID
   */
  async getRouteById(id: string): Promise<Route | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        return null
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Route
    } catch (error) {
      console.error('Error obteniendo ruta:', error)
      throw new Error(`Error al obtener ruta: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Obtener todas las rutas con filtros y paginación
   */
  async getRoutes(
    filters: RouteFilters = {},
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<RouteSearchResult> {
    try {
      // Verificar autenticación
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.warn('Usuario no autenticado, pero permitiendo acceso público a rutas')
      }

      // Estrategia optimizada: aplicar solo un filtro principal por consulta
      const constraints: QueryConstraint[] = []

      // Priorizar filtros: active > origin > destination > price
      if (filters.active !== undefined) {
        constraints.push(where('active', '==', filters.active))
        constraints.push(orderBy('name'))
      } else if (filters.origin) {
        constraints.push(where('origin.city', '==', filters.origin))
        constraints.push(orderBy('name'))
      } else if (filters.destination) {
        constraints.push(where('destination.city', '==', filters.destination))
        constraints.push(orderBy('name'))
      } else if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        // Para filtros de precio, usar un rango
        if (filters.minPrice !== undefined) {
          constraints.push(where('price', '>=', filters.minPrice))
        }
        if (filters.maxPrice !== undefined) {
          constraints.push(where('price', '<=', filters.maxPrice))
        }
        constraints.push(orderBy('price'))
      } else {
        // Consulta básica sin filtros
        constraints.push(orderBy('name'))
      }

      constraints.push(limit(pageSize + 1)) // +1 para saber si hay más páginas

      // Paginación
      if (lastDoc) {
        constraints.push(startAfter(lastDoc))
      }

      console.log('Ejecutando consulta de rutas con:', { filters, pageSize })
      
      const q = query(this.getCollection(), ...constraints)
      const querySnapshot = await getDocs(q)

      console.log('Consulta exitosa, documentos encontrados:', querySnapshot.size)

      let routes: Route[] = []
      const docs: DocumentSnapshot[] = []

      querySnapshot.forEach((doc) => {
        docs.push(doc)
        routes.push({
          id: doc.id,
          ...doc.data()
        } as Route)
      })

      // Aplicar filtros adicionales en el cliente para consultas compuestas
      routes = this.applyClientSideFilters(routes, filters)

      const hasMore = routes.length > pageSize
      if (hasMore) {
        routes.pop() // Remover el documento extra
      }

      return {
        routes,
        total: routes.length,
        hasMore
      }
    } catch (error: any) {
      console.error('Error obteniendo rutas:', error)
      console.error('Código del error:', error.code)
      console.error('Mensaje del error:', error.message)
      
      // Verificar tipos específicos de errores
      if (error.code === 'permission-denied') {
        throw new Error('Sin permisos para acceder a las rutas. Verifica las reglas de Firestore.')
      } else if (error.code === 'unauthenticated') {
        throw new Error('Usuario no autenticado. Inicia sesión para continuar.')
      } else if (error.code === 'failed-precondition' && error.message.includes('index')) {
        throw new Error('Los índices de búsqueda se están creando. Intenta de nuevo en unos minutos.')
      } else {
        throw new Error(`Error al obtener rutas: ${error.message || 'Error desconocido'}`)
      }
    }
  }

  /**
   * Actualizar una ruta
   */
  async updateRoute(id: string, data: UpdateRouteData): Promise<Route> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      
      // Verificar que la ruta existe
      const existingDoc = await getDoc(docRef)
      if (!existingDoc.exists()) {
        throw new Error('Ruta no encontrada')
      }

      // Preparar datos de actualización
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now()
      }

      await updateDoc(docRef, updateData)

      // Obtener la ruta actualizada
      const updatedDoc = await getDoc(docRef)
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Route
    } catch (error) {
      console.error('Error actualizando ruta:', error)
      throw new Error(`Error al actualizar ruta: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Eliminar una ruta
   */
  async deleteRoute(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      
      // Verificar que la ruta existe
      const existingDoc = await getDoc(docRef)
      if (!existingDoc.exists()) {
        throw new Error('Ruta no encontrada')
      }

      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error eliminando ruta:', error)
      throw new Error(`Error al eliminar ruta: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Eliminar múltiples rutas
   */
  async deleteMultipleRoutes(ids: string[]): Promise<void> {
    try {
      const batch = writeBatch(db)
      
      ids.forEach(id => {
        const docRef = doc(db, COLLECTION_NAME, id)
        batch.delete(docRef)
      })

      await batch.commit()
    } catch (error) {
      console.error('Error eliminando rutas:', error)
      throw new Error(`Error al eliminar rutas: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Activar/desactivar una ruta
   */
  async toggleRouteStatus(id: string, active: boolean): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      await updateDoc(docRef, {
        active,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error cambiando estado de ruta:', error)
      throw new Error(`Error al cambiar estado de ruta: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Buscar rutas por texto
   */
  async searchRoutes(searchTerm: string, pageSize: number = 20): Promise<RouteSearchResult> {
    try {
      // Firestore no tiene búsqueda de texto completo nativa
      // Implementamos búsqueda por campos específicos
      const searchTermLower = searchTerm.toLowerCase()
      
      const q = query(
        this.getCollection(),
        orderBy('name'),
        limit(pageSize)
      )

      const querySnapshot = await getDocs(q)
      const allRoutes: Route[] = []

      querySnapshot.forEach((doc) => {
        allRoutes.push({
          id: doc.id,
          ...doc.data()
        } as Route)
      })

      // Filtrar en el cliente (para demo, en producción usar Algolia o similar)
      const filteredRoutes = allRoutes.filter(route => 
        route.name.toLowerCase().includes(searchTermLower) ||
        route.origin.city.toLowerCase().includes(searchTermLower) ||
        route.destination.city.toLowerCase().includes(searchTermLower)
      )

      return {
        routes: filteredRoutes,
        total: filteredRoutes.length,
        hasMore: false
      }
    } catch (error) {
      console.error('Error buscando rutas:', error)
      throw new Error(`Error al buscar rutas: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Aplicar filtros adicionales en el cliente
   */
  private applyClientSideFilters(routes: Route[], filters: RouteFilters): Route[] {
    return routes.filter(route => {
      // Filtrar por origen si no se usó como filtro principal
      if (filters.origin && route.origin.city !== filters.origin) {
        return false
      }
      
      // Filtrar por destino si no se usó como filtro principal
      if (filters.destination && route.destination.city !== filters.destination) {
        return false
      }
      
      // Filtrar por estado si no se usó como filtro principal
      if (filters.active !== undefined && route.active !== filters.active) {
        return false
      }
      
      // Filtrar por precio si no se usó como filtro principal
      if (filters.minPrice !== undefined && route.price < filters.minPrice) {
        return false
      }
      if (filters.maxPrice !== undefined && route.price > filters.maxPrice) {
        return false
      }
      
      // Filtrar por tipo de vehículo
      if (filters.vehicleType && route.vehicleType !== filters.vehicleType) {
        return false
      }
      
      return true
    })
  }

  /**
   * Validar datos de ruta
   */
  private validateRouteData(data: CreateRouteData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('El nombre de la ruta es requerido')
    }

    if (!data.origin.name || !data.origin.city) {
      throw new Error('La información del origen es requerida')
    }

    if (!data.destination.name || !data.destination.city) {
      throw new Error('La información del destino es requerida')
    }

    if (data.price <= 0) {
      throw new Error('El precio debe ser mayor a 0')
    }

    if (data.distance <= 0) {
      throw new Error('La distancia debe ser mayor a 0')
    }

    if (!data.duration || data.duration.trim().length === 0) {
      throw new Error('La duración es requerida')
    }

    // Validar que origen y destino no sean iguales
    if (data.origin.city === data.destination.city) {
      throw new Error('El origen y destino no pueden ser la misma ciudad')
    }
  }
}

export const routeService = new RouteService()
export default routeService 