import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Chip, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Alert
} from '@mui/material'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  DollarSign,
  Target,
  Gift,
  Copy
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Demo data
const promotionsData = [
  {
    id: 1,
    name: 'Descuento Fin de Semana',
    type: 'percentage',
    value: 15,
    code: 'WEEKEND15',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-29',
    usageCount: 245,
    usageLimit: 500,
    minPurchase: 300,
    routes: ['CDMX - Guadalajara', 'CDMX - Monterrey'],
    revenue: 18750,
    description: 'Descuento especial para viajes de fin de semana'
  },
  {
    id: 2,
    name: 'Primera Compra',
    type: 'fixed',
    value: 50,
    code: 'PRIMERACOMPRA',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    usageCount: 189,
    usageLimit: 1000,
    minPurchase: 200,
    routes: ['Todas'],
    revenue: 9450,
    description: 'Descuento para usuarios nuevos'
  },
  {
    id: 3,
    name: 'Estudiantes',
    type: 'percentage',
    value: 20,
    code: 'ESTUDIANTE20',
    status: 'paused',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    usageCount: 67,
    usageLimit: 200,
    minPurchase: 150,
    routes: ['Guadalajara - León', 'CDMX - Puebla'],
    revenue: 2680,
    description: 'Descuento especial para estudiantes'
  },
  {
    id: 4,
    name: 'Lealtad VIP',
    type: 'percentage',
    value: 25,
    code: 'VIP25',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    usageCount: 156,
    usageLimit: 300,
    minPurchase: 500,
    routes: ['Todas'],
    revenue: 19500,
    description: 'Descuento para usuarios VIP con +10 viajes'
  }
]

const promotionPerformanceData = [
  { month: 'Ene', coupons: 89, revenue: 12500 },
  { month: 'Feb', coupons: 124, revenue: 18750 },
  { month: 'Mar', coupons: 156, revenue: 23400 },
  { month: 'Abr', coupons: 203, revenue: 30450 },
  { month: 'May', coupons: 178, revenue: 26700 },
  { month: 'Jun', coupons: 245, revenue: 36750 }
]

const segmentationOptions = [
  { value: 'new-users', label: 'Usuarios Nuevos' },
  { value: 'returning-users', label: 'Usuarios Recurrentes' },
  { value: 'vip-users', label: 'Usuarios VIP' },
  { value: 'inactive-users', label: 'Usuarios Inactivos' },
  { value: 'students', label: 'Estudiantes' },
  { value: 'seniors', label: 'Adultos Mayores' }
]

export const PromotionManager: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [promotionDialog, setPromotionDialog] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null)
  const [promotionForm, setPromotionForm] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    code: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    minPurchase: '',
    routes: [] as string[],
    segments: [] as string[],
    description: ''
  })

  const handleCreatePromotion = () => {
    setSelectedPromotion(null)
    setPromotionForm({
      name: '',
      type: 'percentage' as 'percentage' | 'fixed',
      value: '',
      code: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      minPurchase: '',
      routes: [] as string[],
      segments: [] as string[],
      description: ''
    })
    setPromotionDialog(true)
  }

  const handleEditPromotion = (promotion: any) => {
    setSelectedPromotion(promotion)
    setPromotionForm({
      name: promotion.name,
      type: promotion.type as 'percentage' | 'fixed',
      value: promotion.value.toString(),
      code: promotion.code,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      usageLimit: promotion.usageLimit.toString(),
      minPurchase: promotion.minPurchase.toString(),
      routes: promotion.routes as string[],
      segments: [] as string[],
      description: promotion.description
    })
    setPromotionDialog(true)
  }

  const handleSavePromotion = () => {
    // Aquí iría la lógica para guardar la promoción
    setPromotionDialog(false)
  }

  const generateCouponCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setPromotionForm({ ...promotionForm, code: randomCode })
  }

  const totalRevenue = promotionsData.reduce((sum, promo) => sum + promo.revenue, 0)
  const totalUsage = promotionsData.reduce((sum, promo) => sum + promo.usageCount, 0)
  const activePromotions = promotionsData.filter(p => p.status === 'active').length

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h5" fontWeight="bold" className="text-brand-black dark:text-white">
            Gestión de Promociones
          </Typography>
          <Typography variant="body2" className="text-secondary-600 dark:text-gray-400">
            Crea y gestiona campañas promocionales inteligentes
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={handleCreatePromotion}
          className="bg-brand-yellow hover:bg-brand-yellow/90"
        >
          Nueva Promoción
        </Button>
      </Box>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <Gift className="h-8 w-8 text-purple-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  {activePromotions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Promociones Activas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  {totalUsage.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cupones Utilizados
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  ${totalRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresos Generados
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box className="flex items-center">
              <Target className="h-8 w-8 text-orange-500" />
              <Box className="ml-4">
                <Typography variant="h4" fontWeight="bold" className="text-brand-black">
                  {((totalUsage / promotionsData.reduce((sum, p) => sum + p.usageLimit, 0)) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tasa de Conversión
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent>
          <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
            <Tab label="Promociones Activas" />
            <Tab label="Rendimiento" />
            <Tab label="Segmentación" />
          </Tabs>

          {/* Tab Content */}
          <Box className="mt-6">
            {selectedTab === 0 && (
              <Box className="space-y-4">
                {promotionsData.map((promotion) => (
                  <Card key={promotion.id} variant="outlined">
                    <CardContent>
                      <Box className="flex justify-between items-start">
                        <Box className="flex-1">
                          <Box className="flex items-center gap-3 mb-2">
                            <Typography variant="h6" fontWeight="semibold">
                              {promotion.name}
                            </Typography>
                            <Chip 
                              label={promotion.status === 'active' ? 'Activa' : 'Pausada'}
                              size="small"
                              color={promotion.status === 'active' ? 'success' : 'default'}
                            />
                            <Chip 
                              label={`${promotion.type === 'percentage' ? `${promotion.value}%` : `$${promotion.value}`} OFF`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" className="mb-3">
                            {promotion.description}
                          </Typography>
                          <Box className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Código
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {promotion.code}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Usos
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {promotion.usageCount} / {promotion.usageLimit}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Ingresos
                              </Typography>
                              <Typography variant="body2" fontWeight="medium" className="text-green-600">
                                ${promotion.revenue.toLocaleString()}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Válido hasta
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {new Date(promotion.endDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box className="flex gap-2">
                          <IconButton size="small" onClick={() => handleEditPromotion(promotion)}>
                            <Edit className="h-4 w-4" />
                          </IconButton>
                          <IconButton size="small">
                            <Copy className="h-4 w-4" />
                          </IconButton>
                          <IconButton size="small">
                            <Eye className="h-4 w-4" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {selectedTab === 1 && (
              <Box className="space-y-6">
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="semibold" className="mb-4">
                      Rendimiento de Promociones
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={promotionPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="coupons" fill="#3B82F6" name="Cupones Usados" />
                        <Bar dataKey="revenue" fill="#10B981" name="Ingresos ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="semibold" className="mb-4">
                        Top Promociones por Uso
                      </Typography>
                      <Box className="space-y-3">
                        {promotionsData
                          .sort((a, b) => b.usageCount - a.usageCount)
                          .slice(0, 3)
                          .map((promo, index) => (
                            <Box key={promo.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                              <Box className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center">
                                  <Typography variant="caption" fontWeight="bold">
                                    {index + 1}
                                  </Typography>
                                </div>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {promo.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {promo.code}
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" fontWeight="semibold">
                                {promo.usageCount} usos
                              </Typography>
                            </Box>
                          ))}
                      </Box>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="semibold" className="mb-4">
                        Top Promociones por Ingresos
                      </Typography>
                      <Box className="space-y-3">
                        {promotionsData
                          .sort((a, b) => b.revenue - a.revenue)
                          .slice(0, 3)
                          .map((promo, index) => (
                            <Box key={promo.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                              <Box className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <Typography variant="caption" fontWeight="bold" className="text-white">
                                    {index + 1}
                                  </Typography>
                                </div>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {promo.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {promo.code}
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" fontWeight="semibold" className="text-green-600">
                                ${promo.revenue.toLocaleString()}
                              </Typography>
                            </Box>
                          ))}
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              </Box>
            )}

            {selectedTab === 2 && (
              <Box className="space-y-6">
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Segmentación Inteligente:</strong> Crea promociones dirigidas a segmentos específicos 
                    de usuarios para maximizar la conversión.
                  </Typography>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {segmentationOptions.map((segment) => (
                    <Card key={segment.value}>
                      <CardContent>
                        <Box className="flex justify-between items-start">
                          <Box>
                            <Typography variant="h6" fontWeight="semibold" className="mb-2">
                              {segment.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className="mb-3">
                              {segment.value === 'new-users' && 'Usuarios registrados en los últimos 30 días'}
                              {segment.value === 'returning-users' && 'Usuarios con 3+ viajes realizados'}
                              {segment.value === 'vip-users' && 'Usuarios con 10+ viajes o gastos >$5000'}
                              {segment.value === 'inactive-users' && 'Usuarios sin actividad en 60+ días'}
                              {segment.value === 'students' && 'Usuarios con email educativo verificado'}
                              {segment.value === 'seniors' && 'Usuarios de 60+ años'}
                            </Typography>
                            <Box className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <Typography variant="body2" color="text.secondary">
                                {Math.floor(Math.random() * 1000) + 100} usuarios
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Target />}
                            onClick={() => {
                              setPromotionForm({ ...promotionForm, segments: [segment.value] as string[] })
                              handleCreatePromotion()
                            }}
                          >
                            Crear Promoción
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Promotion Dialog */}
      <Dialog open={promotionDialog} onClose={() => setPromotionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPromotion ? 'Editar Promoción' : 'Nueva Promoción'}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-4">
            <TextField
              label="Nombre de la Promoción"
              fullWidth
              value={promotionForm.name}
              onChange={(e) => setPromotionForm({ ...promotionForm, name: e.target.value })}
            />
            
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={2}
              value={promotionForm.description}
              onChange={(e) => setPromotionForm({ ...promotionForm, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Tipo de Descuento</InputLabel>
                <Select
                  value={promotionForm.type}
                  onChange={(e) => setPromotionForm({ ...promotionForm, type: e.target.value as 'percentage' | 'fixed' })}
                >
                  <MenuItem value="percentage">Porcentaje</MenuItem>
                  <MenuItem value="fixed">Cantidad Fija</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label={promotionForm.type === 'percentage' ? 'Porcentaje (%)' : 'Cantidad ($)'}
                type="number"
                fullWidth
                value={promotionForm.value}
                onChange={(e) => setPromotionForm({ ...promotionForm, value: e.target.value })}
              />
            </div>

            <Box className="flex gap-2">
              <TextField
                label="Código de Cupón"
                fullWidth
                value={promotionForm.code}
                onChange={(e) => setPromotionForm({ ...promotionForm, code: e.target.value })}
              />
              <Button
                variant="outlined"
                onClick={generateCouponCode}
                className="whitespace-nowrap"
              >
                Generar
              </Button>
            </Box>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Fecha de Inicio"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={promotionForm.startDate}
                onChange={(e) => setPromotionForm({ ...promotionForm, startDate: e.target.value })}
              />
              
              <TextField
                label="Fecha de Fin"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={promotionForm.endDate}
                onChange={(e) => setPromotionForm({ ...promotionForm, endDate: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Límite de Usos"
                type="number"
                fullWidth
                value={promotionForm.usageLimit}
                onChange={(e) => setPromotionForm({ ...promotionForm, usageLimit: e.target.value })}
              />
              
              <TextField
                label="Compra Mínima ($)"
                type="number"
                fullWidth
                value={promotionForm.minPurchase}
                onChange={(e) => setPromotionForm({ ...promotionForm, minPurchase: e.target.value })}
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPromotionDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSavePromotion} 
            variant="contained"
            className="bg-brand-yellow hover:bg-brand-yellow/90"
          >
            Guardar Promoción
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
} 