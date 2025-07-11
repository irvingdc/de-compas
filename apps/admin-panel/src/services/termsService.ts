import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  QueryConstraint,
  updateDoc,
  writeBatch
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'
import { auth } from './firebase'
import { 
  TermsAndConditions, 
  CreateTermsData, 
  TermsSearchResult, 
  TermsFilters
} from '../types/terms'

const COLLECTION_NAME = 'terms_and_conditions'

class TermsService {
  private getCollection() {
    return collection(db, COLLECTION_NAME)
  }

  /**
   * Upload PDF file to Firebase Storage
   */
  async uploadTermsPDF(file: File, type: 'travelers' | 'drivers'): Promise<string> {
    try {
      // Validate PDF file
      this.validatePDFFile(file)

      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${type}_${timestamp}_${sanitizedFileName}`

      // Create Storage reference
      const fileRef = ref(storage, `terms-and-conditions/${fileName}`)

      // Upload file
      const snapshot = await uploadBytes(fileRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      return downloadURL
    } catch (error) {
      console.error('Error uploading Terms PDF:', error)
      throw new Error(`Error al subir PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Create new Terms and Conditions version
   */
  async createTermsVersion(data: CreateTermsData): Promise<TermsAndConditions> {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('Usuario no autenticado')
      }

      // Get current version number
      const currentVersion = await this.getLatestVersion(data.type)
      const newVersion = currentVersion + 1

      // Deactivate previous active version
      await this.deactivatePreviousVersion(data.type)

      const now = Timestamp.now()
      
      // Build termsData object, excluding undefined fields
      const termsData: any = {
        type: data.type,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        version: newVersion,
        uploadedAt: now,
        uploadedBy: currentUser.uid,
        isActive: true
      }

      // Only include description if it's not undefined
      if (data.description !== undefined) {
        termsData.description = data.description
      }

      const docRef = await addDoc(this.getCollection(), termsData)
      
      return {
        id: docRef.id,
        ...termsData
      }
    } catch (error) {
      console.error('Error creating terms version:', error)
      throw new Error(`Error al crear versión de términos: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Get all terms versions with filters
   */
  async getTermsVersions(
    filters: TermsFilters = {},
    pageSize: number = 20
  ): Promise<TermsSearchResult> {
    try {
      const constraints: QueryConstraint[] = []

      // Apply filters
      if (filters.type) {
        constraints.push(where('type', '==', filters.type))
      }

      if (filters.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive))
      }

      // Order by version descending (newest first)
      constraints.push(orderBy('version', 'desc'))
      constraints.push(limit(pageSize))

      const q = query(this.getCollection(), ...constraints)
      const querySnapshot = await getDocs(q)

      const terms: TermsAndConditions[] = []
      querySnapshot.forEach((doc) => {
        terms.push({
          id: doc.id,
          ...doc.data()
        } as TermsAndConditions)
      })

      return {
        terms,
        total: terms.length,
        hasMore: false
      }
    } catch (error) {
      console.error('Error getting terms versions:', error)
      throw new Error(`Error al obtener versiones de términos: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Get latest active version for a type
   */
  async getActiveVersion(type: 'travelers' | 'drivers'): Promise<TermsAndConditions | null> {
    try {
      const q = query(
        this.getCollection(),
        where('type', '==', type),
        where('isActive', '==', true),
        orderBy('version', 'desc'),
        limit(1)
      )

      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return null
      }

      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data()
      } as TermsAndConditions
    } catch (error) {
      console.error('Error getting active version:', error)
      throw new Error(`Error al obtener versión activa: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Get latest version number for a type
   */
  private async getLatestVersion(type: 'travelers' | 'drivers'): Promise<number> {
    try {
      const q = query(
        this.getCollection(),
        where('type', '==', type),
        orderBy('version', 'desc'),
        limit(1)
      )

      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return 0
      }

      const doc = querySnapshot.docs[0]
      const data = doc.data() as TermsAndConditions
      return data.version
    } catch (error) {
      console.error('Error getting latest version:', error)
      return 0
    }
  }

  /**
   * Deactivate previous active version
   */
  private async deactivatePreviousVersion(type: 'travelers' | 'drivers'): Promise<void> {
    try {
      const q = query(
        this.getCollection(),
        where('type', '==', type),
        where('isActive', '==', true)
      )

      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const batch = writeBatch(db)
        
        querySnapshot.forEach((doc) => {
          batch.update(doc.ref, { isActive: false })
        })

        await batch.commit()
      }
    } catch (error) {
      console.error('Error deactivating previous version:', error)
      throw new Error(`Error al desactivar versión anterior: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Validate PDF file
   */
  private validatePDFFile(file: File): void {
    // Check file type
    if (file.type !== 'application/pdf') {
      throw new Error('Solo se permiten archivos PDF.')
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. El tamaño máximo permitido es 10MB.')
    }

    // Check file is not empty
    if (file.size === 0) {
      throw new Error('El archivo está vacío.')
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Get file name from URL
   */
  getFileNameFromUrl(url: string): string {
    try {
      const urlParts = url.split('/')
      const lastPart = urlParts[urlParts.length - 1]
      const fileName = lastPart.split('?')[0]
      return decodeURIComponent(fileName)
    } catch (error) {
      return 'documento.pdf'
    }
  }
}

export const termsService = new TermsService()
export default termsService 