import React from 'react'
import {
  Box,
  Typography,
  Alert,
  Stack,
  TextField
} from '@mui/material'
import { termsService } from '../../services/termsService'
import { ReusableDialog, ActionButton } from '../common/ReusableDialog'

interface UploadTermsDialogProps {
  open: boolean
  onClose: () => void
  type: 'travelers' | 'drivers'
  selectedFile: File | null
  fileDescription: string
  uploading: boolean
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange: (value: string) => void
  onUpload: () => void
}

export const UploadTermsDialog: React.FC<UploadTermsDialogProps> = ({
  open,
  onClose,
  type,
  selectedFile,
  fileDescription,
  uploading,
  onFileSelect,
  onDescriptionChange,
  onUpload
}) => {
  return (
    <ReusableDialog
      open={open}
      onClose={onClose}
      title="Subir Nueva Versión"
      maxWidth="md"
      actions={
        <Stack direction="row" spacing={2}>
          <ActionButton
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={onUpload}
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
            onChange={onFileSelect}
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
            onChange={(e) => onDescriptionChange(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Describe los cambios en esta versión..."
          />
        </Box>
      </Stack>
    </ReusableDialog>
  )
} 