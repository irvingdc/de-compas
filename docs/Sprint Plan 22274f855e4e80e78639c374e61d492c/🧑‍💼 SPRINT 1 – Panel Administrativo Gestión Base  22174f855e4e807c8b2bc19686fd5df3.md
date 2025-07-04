# 🧑‍💼 SPRINT 1 – Panel Administrativo: Gestión Base (2 semanas)

---

## 🎯 **Objetivo del Sprint:**

Tener una app web funcional para que los administradores puedan:

- Crear y administrar rutas.
- Revisar y aprobar conductores.
- Consultar información de usuarios pasajeros.

---

## 🔐 1. **Autenticación y control de sesión admin**

### Tareas técnicas

- [ ]  Crear login con correo/contraseña usando Firebase Auth.
- [ ]  Validar que el usuario logueado tenga `role: 'admin'` (desde `users/` en Firestore).
- [ ]  Proteger rutas con `PrivateRoute` o `useEffect` y redirigir si no es admin.

### Estructura recomendada

```tsx

// /src/auth/AuthProvider.tsx
// /src/pages/Login.tsx
// /src/pages/Dashboard.tsx
// /src/pages/NotAuthorized.tsx

```

---

## 🗺️ 2. **Gestión de Rutas Interurbanas**

### Firestore

- Colección: `routes`

```tsx

{
  origin: 'CDMX',
  destination: 'Guadalajara',
  stops: ['Querétaro'],
  price: 420,
  estimatedDuration: '5h 30m',
  frequency: ['lunes', 'miércoles', 'viernes'],
  active: true,
  createdAt: Timestamp
}

```

### UI / Funciones

- [ ]  Crear formulario para agregar/editar rutas.
- [ ]  Listar rutas existentes.
- [ ]  Botón para activar/desactivar rutas.
- [ ]  Validación de ciudades, horarios, frecuencia y precios.

### Firebase SDK

```tsx

import { collection, addDoc } from 'firebase/firestore';
await addDoc(collection(db, 'routes'), routeData);

```

---

## 👷 3. **Gestión de Conductores**

### Firestore

- Colección: `drivers` (ID = UID de usuario)

```tsx

{
  uid: 'abcd123',
  name: 'Juan Pérez',
  documents: {
    ine: 'documents/uid/ine.pdf',
    license: 'documents/uid/license.pdf'
  },
  status: 'pending' | 'approved' | 'rejected',
  vehicleIds: ['veh1', 'veh2']
}

```

### UI / Funciones

- [ ]  Listar conductores registrados (con `status === 'pending'`).
- [ ]  Vista detallada de documentos subidos (usar URLs de Storage).
- [ ]  Aprobar o rechazar cuenta con un botón.
- [ ]  Mostrar estado actual de cada conductor (`pending`, `approved`, `rejected`).
- [ ]  Filtrar conductores por estado.

### Firebase SDK

```tsx

await updateDoc(doc(db, 'drivers', uid), {
  status: 'approved'
});

```

---

## 🚘 4. **Gestión de Vehículos (asociados a conductores)**

### Firestore

- Colección: `vehicles`

```tsx

{
  driverId: 'abcd123',
  brand: 'Tesla',
  model: 'Model 3',
  type: 'eléctrico',
  seats: 4,
  licensePlate: 'ABC123',
  photoUrl: 'vehicles/veh123.jpg',
  status: 'active'
}

```

### UI / Funciones

- [ ]  Listar vehículos por conductor.
- [ ]  Vista de detalles básicos + foto.
- [ ]  Validar que cada vehículo tenga campos completos.
- [ ]  (opcional) Aprobar o inhabilitar vehículos.

---

## 🙋 5. **Gestión de Pasajeros (Usuarios viajeros)**

### Firestore

- Colección: `users` con campo `role: 'viajero'`

```tsx

{
  name: 'Ana López',
  email: 'ana@gmail.com',
  phone: '+5215555555555',
  status: 'active' | 'blocked',
  verified: true
}

```

### UI / Funciones

- [ ]  Listar usuarios con rol `viajero`.
- [ ]  Botón para bloquear/desbloquear usuarios.
- [ ]  Vista de historial de viajes (referencia cruzada con `tickets` o `trips`).
- [ ]  Mostrar incidencias reportadas (de `alerts/` si las hay).

---

## 🧪 6. **Validaciones y UX básicas**

- [ ]  Mostrar loading spinners al cargar datos.
- [ ]  Manejo de errores en llamadas a Firestore.
- [ ]  Notificación de éxito/error (ej. con Toast).
- [ ]  Uso de diseño responsive con Tailwind.

---

## 📦 7. **Organización del código**

### Sugerida

```bash

/src
  /auth
  /components
  /pages
    /routes
    /drivers
    /passengers
  /services
    firebase.ts
    firestore.ts
  /types

```

---

## 📝 8. Check de cumplimiento del sprint

✅ ¿Puedes autenticarte como admin y ver el dashboard?

✅ ¿Puedes crear, editar y activar rutas?

✅ ¿Puedes revisar y aprobar conductores?

✅ ¿Puedes ver y gestionar usuarios viajeros?