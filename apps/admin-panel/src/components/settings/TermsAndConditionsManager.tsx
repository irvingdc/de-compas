import React, { useState, useEffect, useCallback } from 'react'
import { 
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  TextField
} from '@mui/material'
import { 
  Description as DocumentTextIcon,
  CloudUpload as CloudArrowUpIcon,
  Visibility as EyeIcon,
  Download as ArrowDownTrayIcon,
  Warning as ExclamationTriangleIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ClockIcon,
  Person as UserIcon
} from '@mui/icons-material'
import { termsService } from '../../services/termsService'
import { TermsAndConditions, TermsFilters } from '../../types/terms'
import { ReusableDialog, ActionButton } from '../common/ReusableDialog'

interface TermsAndConditionsManagerProps {
  type: 'travelers' | 'drivers'
  title: string
  description: string
}

export const TermsAndConditionsManager: React.FC<TermsAndConditionsManagerProps> = ({
  type,
  title,
  description
}) => {
  const [terms, setTerms] = useState<TermsAndConditions[]>([])
  const [activeVersion, setActiveVersion] = useState<TermsAndConditions | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [versionHistoryDialogOpen, setVersionHistoryDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileDescription, setFileDescription] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadTerms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load active version
      const active = await termsService.getActiveVersion(type)
      setActiveVersion(active)
      
      // Load all versions
      const filters: TermsFilters = { type }
      const result = await termsService.getTermsVersions(filters, 50)
      setTerms(result.terms)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar términos')
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    loadTerms()
  }, [loadTerms])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      setError(null)

      // Upload file to Firebase Storage
      const fileUrl = await termsService.uploadTermsPDF(selectedFile, type)

      // Create new version
      await termsService.createTermsVersion({
        type,
        fileName: selectedFile.name,
        fileUrl,
        fileSize: selectedFile.size,
        description: fileDescription.trim() || undefined
      })

      setSuccess('Nueva versión subida exitosamente')
      setUploadDialogOpen(false)
      setSelectedFile(null)
      setFileDescription('')
      
      // Reload terms
      await loadTerms()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir archivo')
    } finally {
      setUploading(false)
    }
  }

  const handlePreview = (url: string) => {
    setPreviewUrl(url)
    setPreviewDialogOpen(true)
  }

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const resetMessages = () => {
    setError(null)
    setSuccess(null)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ClockIcon />}
            onClick={() => setVersionHistoryDialogOpen(true)}
            disabled={terms.length <= 1}
          >
            Historial de Versiones ({terms.length})
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudArrowUpIcon />}
            onClick={() => {
              resetMessages()
              setUploadDialogOpen(true)
            }}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Subir Nueva Versión
          </Button>
        </Stack>
      </Box>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Active Version */}
      {activeVersion && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                Versión Activa v{activeVersion.version}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {activeVersion.fileName} • {termsService.formatFileSize(activeVersion.fileSize)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Subido el {formatDate(activeVersion.uploadedAt)}
              </Typography>
              {activeVersion.description && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {activeVersion.description}
                </Typography>
              )}
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EyeIcon />}
                onClick={() => handlePreview(activeVersion.fileUrl)}
              >
                Vista Previa
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ArrowDownTrayIcon />}
                onClick={() => handleDownload(activeVersion.fileUrl, activeVersion.fileName)}
              >
                Descargar
              </Button>
            </Stack>
          </Box>
        </Alert>
      )}

      {/* No Active Version */}
      {!loading && !activeVersion && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <DocumentTextIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              No hay versión activa de términos y condiciones para {type === 'travelers' ? 'viajeros' : 'conductores'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sube la primera versión para comenzar
            </Typography>
          </CardContent>
        </Card>
      )}



      {/* Upload Dialog */}
      <ReusableDialog
        open={uploadDialogOpen}
        onClose={() => {
          setUploadDialogOpen(false)
          setSelectedFile(null)
          setFileDescription('')
          resetMessages()
        }}
        title="Subir Nueva Versión"
        maxWidth="md"
        actions={
          <Stack direction="row" spacing={2}>
            <ActionButton
              variant="secondary"
              onClick={() => {
                setUploadDialogOpen(false)
                setSelectedFile(null)
                setFileDescription('')
                resetMessages()
              }}
            >
              Cancelar
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? 'Subiendo...' : 'Subir Versión'}
            </ActionButton>
          </Stack>
        }
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Sube una nueva versión de términos y condiciones para {type === 'travelers' ? 'viajeros' : 'conductores'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Seleccionar archivo PDF
            </Typography>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              style={{ width: '100%' }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Solo archivos PDF. Tamaño máximo: 10MB
            </Typography>
          </Box>

          {selectedFile && (
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Archivo seleccionado:</strong> {selectedFile.name}
              </Typography>
              <Typography variant="caption">
                Tamaño: {termsService.formatFileSize(selectedFile.size)}
              </Typography>
            </Alert>
          )}

          <Box>
            <TextField
              label="Descripción (opcional)"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              placeholder="Describe los cambios en esta versión..."
            />
          </Box>
        </Stack>
      </ReusableDialog>

      {/* Preview Dialog */}
      <ReusableDialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        title="Vista Previa del Documento"
        maxWidth="xl"
      >
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Visualización del documento PDF
          </Typography>
          <Box sx={{ 
            height: '500px', 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            overflow: 'hidden' 
          }}>
            {previewUrl && (
              <iframe
                src={previewUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Vista previa del PDF"
              />
            )}
          </Box>
        </Box>
      </ReusableDialog>

      {/* Version History Dialog */}
      <ReusableDialog
        open={versionHistoryDialogOpen}
        onClose={() => setVersionHistoryDialogOpen(false)}
        title={`Historial de Versiones - ${type === 'travelers' ? 'Viajeros' : 'Conductores'}`}
        maxWidth="lg"
      >
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Todas las versiones de términos y condiciones subidas ({terms.length} total)
          </Typography>
          
          <Stack spacing={3} sx={{ maxHeight: '600px', overflow: 'auto' }}>
            {terms.map((term) => (
              <Card key={term.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                          Versión {term.version}
                        </Typography>
                        {term.isActive && (
                          <Chip
                            label="Activa"
                            color="success"
                            size="small"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {term.fileName} • {termsService.formatFileSize(term.fileSize)}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ClockIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(term.uploadedAt)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <UserIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Subido por: {term.uploadedBy}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {term.description && (
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Descripción:</strong> {term.description}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<EyeIcon />}
                        onClick={() => {
                          handlePreview(term.fileUrl)
                          setVersionHistoryDialogOpen(false)
                        }}
                      >
                        Previsualizar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<ArrowDownTrayIcon />}
                        onClick={() => handleDownload(term.fileUrl, term.fileName)}
                      >
                        Descargar
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      </ReusableDialog>
    </Box>
  )
} 