# 🔐 Sistema de Roles y Permisos - De Compas

## Eliminación del Hardcoding

**✅ ANTES (Problemático):**
```typescript
// ❌ Email hardcodeado en el código
const isAdminEmail = user.email === 'admin@decompas.com'
```

**✅ DESPUÉS (Correcto):**
```typescript
// ✅ Roles dinámicos usando Firebase Custom Claims
const hasAdminClaim = idTokenResult.claims.role === 'admin'
```

## Cómo Funciona

### 1. Firebase Custom Claims
Los roles se almacenan en el **token de autenticación** del usuario como Custom Claims:
```json
{
  "role": "admin",
  "iss": "https://securetoken.google.com/de-compas-dev",
  "aud": "de-compas-dev",
  "sub": "user-id-here"
}
```

### 2. Roles Disponibles
- **`admin`**: Acceso completo al panel administrativo
- **`conductor`**: Acceso a la app de conductores
- **`viajero`**: Acceso a la app de viajeros

### 3. Verificación de Permisos
```typescript
// En el frontend
const idTokenResult = await user.getIdTokenResult()
const isAdmin = idTokenResult.claims.role === 'admin'
```

## Configuración Inicial

### 1. Desplegar Firebase Functions
```bash
# Desplegar las funciones
npm run functions:deploy

# O usar emuladores locales
npm run functions:serve
```

### 2. Inicializar Primer Admin
```bash
# Formato: npm run init-admin <email> <secret>
npm run init-admin admin@decompas.com INIT_ADMIN_SECRET_2024
```

### 3. Verificar el Cambio
1. **Cierra sesión** del panel administrativo
2. **Inicia sesión** nuevamente
3. **Verifica la consola** del navegador:
   ```
   🔍 Debug Auth Info:
   User email: admin@decompas.com
   Custom claims: {role: 'admin', ...}
   Has admin claim: true
   Final isAdmin: true
   ```

## Gestión de Roles

### Asignar Roles (Solo Admins)
```typescript
// En el panel administrativo
import { getFunctions, httpsCallable } from 'firebase/functions'

const functions = getFunctions()
const setUserRole = httpsCallable(functions, 'setUserRole')

// Asignar rol de conductor
await setUserRole({ 
  uid: 'user-id-here', 
  role: 'conductor' 
})
```

### Listar Usuarios con Roles
```typescript
const listUsers = httpsCallable(functions, 'listUsersWithRoles')
const result = await listUsers()
console.log(result.data.users)
```

## Funciones Disponibles

### 1. `initializeAdmin`
- **Propósito**: Crear el primer administrador
- **Parámetros**: `{ email, adminSecret }`
- **Seguridad**: Requiere secreto especial

### 2. `setUserRole`
- **Propósito**: Asignar roles a usuarios
- **Parámetros**: `{ uid, role }`
- **Seguridad**: Solo administradores

### 3. `getUserRole`
- **Propósito**: Obtener rol de un usuario
- **Parámetros**: `{ uid }` (opcional)
- **Seguridad**: Usuario autenticado

### 4. `listUsersWithRoles`
- **Propósito**: Listar todos los usuarios con sus roles
- **Parámetros**: Ninguno
- **Seguridad**: Solo administradores

## Seguridad

### ✅ Ventajas del Nuevo Sistema
- **🔐 Seguro**: Los roles están en el token JWT
- **⚡ Rápido**: No requiere consultas a la base de datos
- **🎯 Escalable**: Fácil agregar nuevos roles
- **🔄 Dinámico**: Sin necesidad de deployar código

### ❌ Problemas del Sistema Anterior
- **🚨 Hardcoded**: Email específico en el código
- **🐛 Frágil**: Cambios requieren deployment
- **⚠️ Inseguro**: Credenciales en el código fuente

## Troubleshooting

### Usuario No Puede Acceder
1. **Verificar Custom Claims**:
   ```typescript
   const idTokenResult = await user.getIdTokenResult()
   console.log(idTokenResult.claims)
   ```

2. **Refrescar Token**:
   ```typescript
   await user.getIdToken(true) // Force refresh
   ```

3. **Verificar Roles en Firebase**:
   ```bash
   npm run functions:logs
   ```

### Cambios No Se Reflejan
Los Custom Claims pueden tardar hasta **1 hora** en propagarse. Para forzar actualización:
```typescript
await user.getIdToken(true)
```

## Comandos Útiles

```bash
# Desarrollo
npm run functions:serve          # Emuladores locales
npm run dev:admin               # Panel administrativo

# Producción
npm run functions:deploy        # Desplegar funciones
npm run firebase:deploy         # Desplegar todo

# Gestión
npm run init-admin <email> <secret>  # Primer admin
npm run functions:logs              # Ver logs
```

## Próximos Pasos

1. **Eliminar logs de debugging** del código
2. **Implementar UI** para gestión de roles en el panel
3. **Configurar notificaciones** de cambios de rol
4. **Agregar auditoría** de cambios de permisos 