import React from 'react'
import {
  Card,
  CardContent,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { TripFilters as TripFiltersType } from '../../types/trip'

interface TripFiltersProps {
  filters: TripFiltersType
  searchTerm: string
  showFilters: boolean
  selectedCount: number
  onFiltersChange: (filters: TripFiltersType) => void
  onSearchTermChange: (term: string) => void
  onSearch: () => void
  onToggleFilters: () => void
  onDeleteSelected: () => void
}

export const TripFilters: React.FC<TripFiltersProps> = ({
  filters,
  searchTerm,
  showFilters,
  selectedCount,
  onFiltersChange,
  onSearchTermChange,
  onSearch,
  onToggleFilters,
  onDeleteSelected,
}) => {
  const handleFilterChange = (key: keyof TripFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          {/* Barra principal de acciones */}
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                className="bg-brand-yellow text-brand-black hover:bg-brand-yellow/90"
              >
                Nuevo Viaje
              </Button>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Filtrar por</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  label="Filtrar por"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="scheduled">Programados</MenuItem>
                  <MenuItem value="in_progress">En Progreso</MenuItem>
                  <MenuItem value="completed">Completados</MenuItem>
                  <MenuItem value="cancelled">Cancelados</MenuItem>
                  <MenuItem value="delayed">Retrasados</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={onToggleFilters}
              >
                {showFilters ? 'Ocultar Filtros' : 'Filtros Avanzados'}
              </Button>
            </Stack>
          </Stack>

          {/* Búsqueda */}
          <Box className="flex gap-2">
            <TextField
              placeholder="Buscar viajes por ruta, conductor, origen o destino..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              size="small"
              className="flex-1"
            />
            <Button
              variant="contained"
              onClick={onSearch}
              className="bg-brand-yellow text-brand-black hover:bg-brand-yellow/90"
            >
              Buscar
            </Button>
          </Box>

          {/* Filtros avanzados */}
          {showFilters && (
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TextField
                label="Origen"
                size="small"
                value={filters.origin || ''}
                onChange={(e) => handleFilterChange('origin', e.target.value)}
                fullWidth
              />
              <TextField
                label="Destino"
                size="small"
                value={filters.destination || ''}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                fullWidth
              />
              <TextField
                label="Fecha desde"
                type="date"
                size="small"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Fecha hasta"
                type="date"
                size="small"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}

          {/* Acciones en lote */}
          {selectedCount > 0 && (
            <Box
              className="flex items-center space-x-2 p-2 rounded"
              sx={{
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'primary.50',
                color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'inherit',
                border: (theme) => theme.palette.mode === 'dark' ? '1px solid ' + theme.palette.divider : undefined
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ color: 'inherit' }}>
                {selectedCount} viajes seleccionados
              </Typography>
              <Button
                size="small"
                color="error"
                onClick={onDeleteSelected}
                startIcon={<DeleteIcon />}
              >
                Eliminar seleccionados
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
} 