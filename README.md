# De Compas - Monorepo

## Descripción
**De Compas** es una plataforma integral de viajes compartidos interestatales que conecta pasajeros con conductores de vehículos eléctricos e híbridos.

## Arquitectura del Proyecto

### Estructura del Monorepo
```
decompas/
├── apps/
│   ├── admin-panel/        # Panel administrativo web (React + TypeScript)
│   ├── viajero-app/        # App móvil para viajeros (Flutter)
│   └── conductor-app/      # App móvil para conductores (Flutter)
├── packages/
│   ├── firebase-config/    # Configuración compartida de Firebase
│   └── shared/            # Utilidades compartidas
├── functions/             # Cloud Functions (Firebase)
├── docs/                  # Documentación del proyecto
└── firebase.json          # Configuración de Firebase
```

### Tecnologías Principales
- **Frontend Web**: React + TypeScript + Vite + Tailwind CSS
- **Mobile Apps**: Flutter
- **Backend**: Firebase (Auth, Firestore, Functions, Storage, Hosting)
- **Pagos**: Stripe
- **Monorepo**: npm workspaces

## Configuración Inicial

### 1. Prerrequisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- Flutter SDK (para apps móviles)
- Firebase CLI

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase
1. Crear un proyecto en Firebase Console
2. Habilitar servicios: Auth, Firestore, Functions, Storage, Hosting
3. Crear archivo `.env` en la raíz del proyecto:
```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Configurar Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init
```

## Comandos Disponibles

### Desarrollo
```bash
# Panel administrativo
npm run dev:admin

# Apps móviles (requiere Flutter)
npm run dev:viajero
npm run dev:conductor

# Emuladores de Firebase
npm run firebase:emulators
```

### Construcción
```bash
# Construir panel administrativo
npm run build:admin

# Construir apps móviles
npm run build:viajero
npm run build:conductor
```

### Firebase
```bash
# Iniciar emuladores
firebase emulators:start

# Desplegar a producción
firebase deploy
```

## Desarrollo

### Panel Administrativo
El panel administrativo está construido con:
- React 18 + TypeScript
- Vite como bundler
- Tailwind CSS para estilos
- React Router para navegación
- Firebase SDK para backend

### Apps Móviles
Las aplicaciones móviles están construidas con:
- Flutter
- Provider para manejo de estado
- GoRouter para navegación
- Firebase SDK para backend

### Configuración de Firebase
- **Firestore**: Base de datos NoSQL con reglas de seguridad
- **Authentication**: Autenticación con email/contraseña y roles
- **Storage**: Almacenamiento de documentos y fotos
- **Functions**: Lógica de negocio serverless
- **Hosting**: Despliegue del panel administrativo

## Seguridad
- Custom Claims para roles de usuario
- Reglas de Firestore restrictivas
- Reglas de Storage seguras
- Validación en frontend y backend

## Sprint Plan
El proyecto está dividido en 6 sprints:
1. **Sprint 0**: Setup inicial y seguridad (1 semana)
2. **Sprint 1**: Panel administrativo base (2 semanas)
3. **Sprint 2**: Registro y validación de usuarios (1.5 semanas)
4. **Sprint 3**: Exploración y compra de viajes (2 semanas)
5. **Sprint 4**: Seguimiento en tiempo real (2 semanas)
6. **Sprint 5**: Pagos, finanzas y soporte (1.5 semanas)
7. **Sprint 6**: QA y despliegue (1 semana)

## Contribución
Para contribuir al proyecto:
1. Clonar el repositorio
2. Crear una rama feature
3. Realizar cambios
4. Hacer commit con mensajes descriptivos
5. Crear Pull Request

## Licencia
Este proyecto es privado y confidencial. 