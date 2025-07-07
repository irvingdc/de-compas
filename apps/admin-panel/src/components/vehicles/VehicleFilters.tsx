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
  CheckCircle as ActivateIcon,
  Cancel as DeactivateIcon,
} from '@mui/icons-material'
import { VehicleFilters as VehicleFiltersType } from '../../types/vehicle'

interface VehicleFiltersProps {
  filters: VehicleFiltersType
  searchTerm: string
  showFilters: boolean
  selectedCount: number
  onFiltersChange: (filters: VehicleFiltersType) => void
  onSearchTermChange: (term: string) => void
  onSearch: () => void
  onToggleFilters: () => void
  onDeleteSelected: () => void
  onActivateSelected: () => void
  onDeactivateSelected: () => void
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  searchTerm,
  showFilters,
  selectedCount,
  onFiltersChange,
  onSearchTermChange,
  onSearch,
  onToggleFilters,
  onDeleteSelected,
  onActivateSelected,
  onDeactivateSelected,
}) => {
  const handleFilterChange = (key: keyof VehicleFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const currentYear = new Date().getFullYear()

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          {/* Barra de búsqueda principal */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Buscar por marca, modelo o año..."
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
                label="Marca"
                size="small"
                value={filters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                fullWidth
              />
              <TextField
                label="Modelo"
                size="small"
                value={filters.model || ''}
                onChange={(e) => handleFilterChange('model', e.target.value)}
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
                  <MenuItem value="true">Activos</MenuItem>
                  <MenuItem value="false">Inactivos</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Año mín"
                  type="number"
                  size="small"
                  value={filters.minYear || ''}
                  onChange={(e) => handleFilterChange('minYear', Number(e.target.value) || undefined)}
                  inputProps={{ min: 1900, max: currentYear }}
                />
                <TextField
                  label="Año máx"
                  type="number"
                  size="small"
                  value={filters.maxYear || ''}
                  onChange={(e) => handleFilterChange('maxYear', Number(e.target.value) || undefined)}
                  inputProps={{ min: 1900, max: currentYear }}
                />
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Asientos mín"
                  type="number"
                  size="small"
                  value={filters.minSeats || ''}
                  onChange={(e) => handleFilterChange('minSeats', Number(e.target.value) || undefined)}
                  inputProps={{ min: 1, max: 50 }}
                />
                <TextField
                  label="Asientos máx"
                  type="number"
                  size="small"
                  value={filters.maxSeats || ''}
                  onChange={(e) => handleFilterChange('maxSeats', Number(e.target.value) || undefined)}
                  inputProps={{ min: 1, max: 50 }}
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
                {selectedCount} vehículos seleccionados
              </Typography>
              <Button
                size="small"
                color="success"
                onClick={onActivateSelected}
                startIcon={<ActivateIcon />}
              >
                Activar seleccionados
              </Button>
              <Button
                size="small"
                color="warning"
                onClick={onDeactivateSelected}
                startIcon={<DeactivateIcon />}
              >
                Desactivar seleccionados
              </Button>
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