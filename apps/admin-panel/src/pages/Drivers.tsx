import React from 'react'
import { Check, X, Eye } from 'lucide-react'

export const Drivers: React.FC = () => {
  const drivers = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+52 55 1234 5678',
      status: 'pending',
      documentsComplete: true,
      registeredAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@example.com',
      phone: '+52 33 9876 5432',
      status: 'approved',
      documentsComplete: true,
      registeredAt: '2024-01-10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Conductores</h1>
        <p className="text-gray-600">Revisa y aprueba conductores</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Conductores Registrados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Conductor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Documentos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                    <div className="text-sm text-gray-500">Registrado: {driver.registeredAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.email}</div>
                    <div className="text-sm text-gray-500">{driver.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      driver.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : driver.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.status === 'approved' ? 'Aprobado' : 
                       driver.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      driver.documentsComplete 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.documentsComplete ? 'Completos' : 'Incompletos'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      {driver.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 