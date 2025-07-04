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

### 1. Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp functions/.env.example functions/.env

# Editar el archivo .env con valores seguros
nano functions/.env
```

**Generar secreto seguro:**
```bash
# Genera un secreto aleatorio seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Desplegar Firebase Functions
```bash
# Desplegar las funciones
npm run functions:deploy

# O usar emuladores locales
npm run functions:serve
```

### 3. Inicializar Primer Admin
```bash
# Formato: npm run init-admin <email> <secret>
npm run init-admin admin@decompas.com 270d50276a518bbcb6e49dec9e7078dfd9c06b1788913dc8fc5d119fb7caf5c2
```

**Nota:** El secreto debe coincidir con `INIT_ADMIN_SECRET` en `functions/.env`

### 4. Verificar el Cambio
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
- **🔒 Variables de Entorno**: Secretos seguros fuera del código
- **🎲 Secretos Aleatorios**: Secretos criptográficamente seguros

### ❌ Problemas del Sistema Anterior
- **🚨 Hardcoded**: Email específico en el código
- **🐛 Frágil**: Cambios requieren deployment
- **⚠️ Inseguro**: Credenciales en el código fuente
- **🔓 Secretos Predecibles**: Secretos fáciles de adivinar

### 🔐 Mejoras de Seguridad Implementadas

**Variables de Entorno:**
```bash
# functions/.env (NO se sube a Git)
INIT_ADMIN_SECRET=270d50276a518bbcb6e49dec9e7078dfd9c06b1788913dc8fc5d119fb7caf5c2
```

**Secretos Aleatorios:**
- ✅ 256 bits de entropía
- ✅ Generados criptográficamente
- ✅ Únicos por proyecto
- ✅ Fáciles de rotar

**Protección en Git:**
```bash
# .gitignore
functions/.env     # ✅ Secretos no se suben
functions/.env.example  # ✅ Template sin secretos
```

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
npm run init-admin <email> <secure-secret>  # Primer admin
npm run functions:logs                       # Ver logs

# Seguridad
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # Generar secreto
```

## Próximos Pasos

1. **Eliminar logs de debugging** del código
2. **Implementar UI** para gestión de roles en el panel
3. **Configurar notificaciones** de cambios de rol
4. **Agregar auditoría** de cambios de permisos 