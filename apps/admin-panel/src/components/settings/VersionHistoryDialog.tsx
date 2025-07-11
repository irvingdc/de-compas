import React from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip
} from '@mui/material'
import {
  Visibility as EyeIcon,
  Download as ArrowDownTrayIcon,
  Schedule as ClockIcon,
  Person as UserIcon
} from '@mui/icons-material'
import { termsService } from '../../services/termsService'
import { TermsAndConditions } from '../../types/terms'
import { ReusableDialog } from '../common/ReusableDialog'

interface VersionHistoryDialogProps {
  open: boolean
  onClose: () => void
  type: 'travelers' | 'drivers'
  terms: TermsAndConditions[]
  onPreview: (url: string) => void
  onDownload: (url: string, fileName: string) => void
  formatDate: (timestamp: any) => string
}

export const VersionHistoryDialog: React.FC<VersionHistoryDialogProps> = ({
  open,
  onClose,
  type,
  terms,
  onPreview,
  onDownload,
  formatDate
}) => {
  const handlePreviewAndClose = (url: string) => {
    onPreview(url)
    onClose()
  }

  return (
    <ReusableDialog
      open={open}
      onClose={onClose}
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
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <strong>Descripción:</strong> {term.description}
                      </Typography>
                    )}
                  </Box>
                  
                  <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EyeIcon />}
                      onClick={() => handlePreviewAndClose(term.fileUrl)}
                    >
                      Previsualizar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowDownTrayIcon />}
                      onClick={() => onDownload(term.fileUrl, term.fileName)}
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
  )
} 