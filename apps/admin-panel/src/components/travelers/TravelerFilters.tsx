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

export interface TravelerFilters {
  status?: 'all' | 'active' | 'inactive' | 'suspended'
  searchTerm?: string
}

interface TravelerFiltersProps {
  filters: TravelerFilters
  searchTerm: string
  showFilters: boolean
  selectedCount: number
  onFiltersChange: (filters: TravelerFilters) => void
  onSearchTermChange: (term: string) => void
  onSearch: () => void
  onToggleFilters: () => void
  onDeleteSelected: () => void
}

export const TravelerFilters: React.FC<TravelerFiltersProps> = ({
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
  const handleFilterChange = (key: keyof TravelerFilters, value: any) => {
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
                color="primary"
              >
                Nuevo Viajero
              </Button>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Filtrar por</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  label="Filtrar por"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="active">Activos</MenuItem>
                  <MenuItem value="inactive">Inactivos</MenuItem>
                  <MenuItem value="suspended">Suspendidos</MenuItem>
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
              placeholder="Buscar viajeros..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              size="small"
              className="flex-1"
            />
            <Button
              variant="contained"
              onClick={onSearch}
              disabled={!searchTerm.trim()}
            >
              Buscar
            </Button>
          </Box>

          {/* Filtros avanzados */}
          {showFilters && (
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TextField
                label="Nombre"
                size="small"
                value={filters.searchTerm || ''}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                fullWidth
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  label="Estado"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="active">Activos</MenuItem>
                  <MenuItem value="inactive">Inactivos</MenuItem>
                  <MenuItem value="suspended">Suspendidos</MenuItem>
                </Select>
              </FormControl>

            </Box>
          )}

          {/* Acciones en lote */}
          {selectedCount > 0 && (
            <Box className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
              <Typography variant="body2" color="text.secondary">
                {selectedCount} viajeros seleccionados
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