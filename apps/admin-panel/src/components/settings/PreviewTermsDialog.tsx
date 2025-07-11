import React from 'react'
import {
  Box,
  Typography
} from '@mui/material'
import { ReusableDialog } from '../common/ReusableDialog'

interface PreviewTermsDialogProps {
  open: boolean
  onClose: () => void
  previewUrl: string
}

export const PreviewTermsDialog: React.FC<PreviewTermsDialogProps> = ({
  open,
  onClose,
  previewUrl
}) => {
  return (
    <ReusableDialog
      open={open}
      onClose={onClose}
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
  )
} 