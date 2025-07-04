import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { RouteFilters as RouteFiltersType } from '../../types/route'

interface RouteFiltersProps {
  filters: RouteFiltersType
  searchTerm: string
  showFilters: boolean
  selectedCount: number
  onFiltersChange: (filters: RouteFiltersType) => void
  onSearchTermChange: (term: string) => void
  onSearch: () => void
  onToggleFilters: () => void
  onDeleteSelected: () => void
}

export const RouteFilters: React.FC<RouteFiltersProps> = ({
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
  const handleFilterChange = (key: keyof RouteFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          {/* Barra de búsqueda principal */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Buscar por nombre, origen o destino..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              size="small"
              className="flex-1"
              InputProps={{
                startAdornment: <SearchIcon className="mr-2 text-gray-400 dark:text-dark-text-muted" />,
              }}
            />
            <Button
              variant="contained"
              onClick={onSearch}
              startIcon={<SearchIcon />}
              className="bg-brand-yellow text-brand-black hover:bg-brand-yellow/90"
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              onClick={onToggleFilters}
              startIcon={<FilterListIcon />}
            >
              Filtros
            </Button>
          </Stack>

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
              <FormControl size="small" fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.active !== undefined ? filters.active.toString() : ''}
                  label="Estado"
                  onChange={(e) => {
                    const value = e.target.value
                    handleFilterChange('active', value === '' ? undefined : value === 'true')
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Activas</MenuItem>
                  <MenuItem value="false">Inactivas</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Precio mín"
                  type="number"
                  size="small"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', Number(e.target.value) || undefined)}
                />
                <TextField
                  label="Precio máx"
                  type="number"
                  size="small"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value) || undefined)}
                />
              </Stack>
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
                {selectedCount} rutas seleccionadas
              </Typography>
              <Button
                size="small"
                color="error"
                onClick={onDeleteSelected}
                startIcon={<DeleteIcon />}
              >
                Eliminar seleccionadas
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
} 