import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Alert,
  Avatar,
  IconButton,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material'
import { CreateVehicleData } from '../../types/vehicle'
import { imageService } from '../../services/imageService'

interface CreateVehicleDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (vehicleData: CreateVehicleData) => Promise<void>
}

interface FormData {
  brand: string
  model: string
  year: number | ''
  seats: number | ''
  kmRange: number | ''
  chargeTime: number | ''
}

interface FormErrors {
  brand?: string
  model?: string
  year?: string
  seats?: string
  kmRange?: string
  chargeTime?: string
  imageUrl?: string
}

export const CreateVehicleDialog: React.FC<CreateVehicleDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    brand: '',
    model: '',
    year: '',
    seats: '',
    kmRange: '',
    chargeTime: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentYear = new Date().getFullYear()

  // Limpiar formulario cuando se abre/cierra el diálogo
  useEffect(() => {
    if (open) {
      resetForm()
    } else {
      // Limpiar URL de previsualización al cerrar
      if (previewUrl) {
        imageService.revokePreviewUrl(previewUrl)
      }
    }
  }, [open])

  // Limpiar URL de previsualización al desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) {
        imageService.revokePreviewUrl(previewUrl)
      }
    }
  }, [previewUrl])

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: '',
      seats: '',
      kmRange: '',
      chargeTime: '',
    })
    setErrors({})
    setSelectedFile(null)
    if (previewUrl) {
      imageService.revokePreviewUrl(previewUrl)
      setPreviewUrl('')
    }
    setUploading(false)
    setSubmitting(false)
  }

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    
    // Para campos numéricos, convertir a número o mantener vacío
    if (['year', 'seats', 'kmRange', 'chargeTime'].includes(field)) {
      setFormData(prev => ({
        ...prev,
        [field]: value === '' ? '' : Number(value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Validar archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          imageUrl: 'Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, WebP y GIF.'
        }))
        return
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          imageUrl: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.'
        }))
        return
      }

      // Limpiar error anterior
      if (errors.imageUrl) {
        setErrors(prev => ({ ...prev, imageUrl: undefined }))
      }

      // Crear URL de previsualización
      if (previewUrl) {
        imageService.revokePreviewUrl(previewUrl)
      }
      
      const newPreviewUrl = imageService.createPreviewUrl(file)
      setSelectedFile(file)
      setPreviewUrl(newPreviewUrl)
      
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        imageUrl: error instanceof Error ? error.message : 'Error al procesar imagen'
      }))
    }
  }

  const handleRemoveImage = () => {
    if (previewUrl) {
      imageService.revokePreviewUrl(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar campos requeridos
    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es requerida'
    }

    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es requerido'
    }

    if (formData.year === '' || formData.year < 1900 || formData.year > currentYear + 1) {
      newErrors.year = `El año debe estar entre 1900 y ${currentYear + 1}`
    }

    if (formData.seats === '' || formData.seats < 1 || formData.seats > 50) {
      newErrors.seats = 'El número de asientos debe estar entre 1 y 50'
    }

    if (formData.kmRange === '' || formData.kmRange <= 0) {
      newErrors.kmRange = 'El rango de kilómetros debe ser mayor a 0'
    }

    if (formData.chargeTime === '' || formData.chargeTime <= 0) {
      newErrors.chargeTime = 'El tiempo de carga debe ser mayor a 0'
    }

    if (!selectedFile) {
      newErrors.imageUrl = 'La imagen del vehículo es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      // Subir imagen primero
      setUploading(true)
      const imageUrl = await imageService.uploadVehicleImage(selectedFile!)
      setUploading(false)

      // Preparar datos del vehículo
      const vehicleData: CreateVehicleData = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: formData.year as number,
        seats: formData.seats as number,
        kmRange: formData.kmRange as number,
        chargeTime: formData.chargeTime as number,
        imageUrl,
        active: true,
      }

      // Crear vehículo
      await onSubmit(vehicleData)
      
      // El diálogo se cierra automáticamente en onSubmit si es exitoso
    } catch (error) {
      setUploading(false)
      console.error('Error al crear vehículo:', error)
      // El error se maneja en el hook useVehicles
    } finally {
      setSubmitting(false)
    }
  }

  const isFormValid = !Object.keys(errors).length && selectedFile && 
    formData.brand && formData.model && formData.year && formData.seats && 
    formData.kmRange && formData.chargeTime

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <CarIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Nuevo Vehículo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agrega un nuevo tipo de vehículo al catálogo
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Información básica */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Información básica
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Marca"
                value={formData.brand}
                onChange={handleInputChange('brand')}
                error={!!errors.brand}
                helperText={errors.brand}
                fullWidth
                required
              />
              
              <TextField
                label="Modelo"
                value={formData.model}
                onChange={handleInputChange('model')}
                error={!!errors.model}
                helperText={errors.model}
                fullWidth
                required
              />
              
              <TextField
                label="Año"
                type="number"
                value={formData.year}
                onChange={handleInputChange('year')}
                error={!!errors.year}
                helperText={errors.year}
                inputProps={{ min: 1900, max: currentYear + 1 }}
                fullWidth
                required
              />
              
              <TextField
                label="Número de asientos"
                type="number"
                value={formData.seats}
                onChange={handleInputChange('seats')}
                error={!!errors.seats}
                helperText={errors.seats}
                inputProps={{ min: 1, max: 50 }}
                fullWidth
                required
              />
            </Box>
          </Box>

          {/* Especificaciones técnicas */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Especificaciones técnicas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Rango total (km)"
                type="number"
                value={formData.kmRange}
                onChange={handleInputChange('kmRange')}
                error={!!errors.kmRange}
                helperText={errors.kmRange}
                inputProps={{ min: 1 }}
                fullWidth
                required
              />
              
              <TextField
                label="Tiempo de carga (min)"
                type="number"
                value={formData.chargeTime}
                onChange={handleInputChange('chargeTime')}
                error={!!errors.chargeTime}
                helperText={errors.chargeTime}
                inputProps={{ min: 1 }}
                fullWidth
                required
              />
            </Box>
          </Box>

          {/* Imagen del vehículo */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Imagen del vehículo
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {/* Input de archivo oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            {!previewUrl ? (
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: errors.imageUrl ? 'error.main' : 'grey.300',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: errors.imageUrl ? 'error.main' : 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Click para seleccionar una imagen
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Formatos soportados: JPEG, PNG, WebP, GIF (máx. 5MB)
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  position: 'relative',
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                }}
              >
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' },
                  }}
                  onClick={handleRemoveImage}
                >
                  <DeleteIcon />
                </IconButton>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedFile?.name}
                </Typography>
              </Box>
            )}
            
            {errors.imageUrl && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.imageUrl}
              </Alert>
            )}
          </Box>

          {/* Estado de subida */}
          {uploading && (
            <Alert
              severity="info"
              icon={<CircularProgress size={20} />}
              sx={{ mt: 2 }}
            >
              Subiendo imagen...
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid || submitting || uploading}
          startIcon={submitting ? <CircularProgress size={20} /> : undefined}
        >
          {submitting ? 'Creando...' : 'Crear Vehículo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
} 