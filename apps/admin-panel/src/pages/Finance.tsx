import React, { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { 
  ProfitabilityAnalysis, 
  DynamicPricing, 
  PromotionManager, 
  DemandForecasting 
} from '../components/finance'

export const Finance: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <Box className="space-y-6">
      <Box>
        <h1 className="text-2xl font-bold text-brand-black dark:text-white">Gestión Financiera</h1>
        <p className="text-secondary-600 dark:text-gray-400">Análisis avanzado y optimización de ingresos</p>
      </Box>
      
      <Box className="bg-white dark:bg-neutral-900 shadow rounded-lg border border-neutral-200 dark:border-neutral-700">
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange} 
          className="border-b border-neutral-200 dark:border-neutral-700"
          sx={{ 
            '& .MuiTab-root': { 
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500
            }
          }}
        >
          <Tab label="Análisis de Rentabilidad" />
          <Tab label="Pricing Dinámico" />
          <Tab label="Promociones" />
          <Tab label="Predicción de Demanda" />
        </Tabs>
        
        <Box className="p-6">
          {selectedTab === 0 && <ProfitabilityAnalysis />}
          {selectedTab === 1 && <DynamicPricing />}
          {selectedTab === 2 && <PromotionManager />}
          {selectedTab === 3 && <DemandForecasting />}
        </Box>
      </Box>
    </Box>
  )
} 