import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

class ImageService {
  /**
   * Subir imagen de vehículo a Firebase Storage
   */
  async uploadVehicleImage(file: File, vehicleId?: string): Promise<string> {
    try {
      // Validar el archivo
      this.validateImageFile(file)

      // Generar nombre único para la imagen
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = vehicleId 
        ? `${vehicleId}_${timestamp}_${sanitizedFileName}`
        : `temp_${timestamp}_${sanitizedFileName}`

      // Crear referencia en Storage
      const imageRef = ref(storage, `vehicles/${fileName}`)

      // Subir archivo
      console.log('Subiendo imagen de vehículo:', fileName)
      const snapshot = await uploadBytes(imageRef, file)
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref)
      console.log('Imagen subida exitosamente:', downloadURL)
      
      return downloadURL
    } catch (error) {
      console.error('Error subiendo imagen de vehículo:', error)
      throw new Error(`Error al subir imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Eliminar imagen de vehículo de Firebase Storage
   */
  async deleteVehicleImage(imageUrl: string): Promise<void> {
    try {
      // Extraer la referencia desde la URL
      const imageRef = ref(storage, imageUrl)
      await deleteObject(imageRef)
      console.log('Imagen eliminada exitosamente:', imageUrl)
    } catch (error) {
      console.error('Error eliminando imagen:', error)
      // No lanzar error si la imagen no existe
      if (error instanceof Error && !error.message.includes('object-not-found')) {
        throw new Error(`Error al eliminar imagen: ${error.message}`)
      }
    }
  }

  /**
   * Validar archivo de imagen
   */
  private validateImageFile(file: File): void {
    // Verificar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, WebP y GIF.')
    }

    // Verificar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB en bytes
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.')
    }

    // Verificar que el archivo no esté vacío
    if (file.size === 0) {
      throw new Error('El archivo está vacío.')
    }
  }

  /**
   * Obtener URL de previsualización para archivo local
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  /**
   * Limpiar URL de previsualización
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url)
  }

  /**
   * Redimensionar imagen (opcional, para optimización)
   */
  async resizeImage(file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspecto
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        // Configurar canvas
        canvas.width = width
        canvas.height = height

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height)

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(resizedFile)
            } else {
              reject(new Error('Error al redimensionar imagen'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('Error al cargar imagen'))
      img.src = URL.createObjectURL(file)
    })
  }
}

export const imageService = new ImageService()
export default imageService 