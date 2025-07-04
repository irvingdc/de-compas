# 🔧 SPRINT 0 - Setup Inicial + Seguridad Robusta (1 semana)

> Este sprint sienta las bases técnicas y de seguridad para todo el proyecto. Incluye la creación del proyecto Firebase, la configuración de roles mediante Custom Claims, reglas de Firestore y Storage endurecidas, y la infraestructura mínima de CI/CD.
> 

---

## 0. Pre-requisitos locales

- Node ≥ 18, npm ≥ 10
- Flutter SDK estable
- Firebase CLI:
    
    ```bash
    
    npm i -g firebase-tools
    firebase login
    
    ```
    

---

## 1. Crear proyecto Firebase y registrar apps

| Paso | Detalle |
| --- | --- |
| 1.1 | Crear proyecto en **Firebase Console** → “De Compas”. |
| 1.2 | Agregar **3 apps**▪ Web (admin)▪ Android (viajero)▪ Android (conductor)*(iOS se registra más adelante)* |
| 1.3 | Habilitar servicios: Auth · Firestore · Realtime DB · Functions · Storage · Hosting · FCM |

---

## 2. Configurar **Authentication**

- Métodos activos: **Email/Password**, **Teléfono**, **Google**.
- En Git **.env** (o `firebaseConfig.ts`) guarda las claves públicas.
- **NO** uses proveedores sociales para conductores hasta validar KYC.

---

## 3. Estructura inicial de Firestore

> Nunca confíes en datos que el cliente pueda editar para tomar decisiones de seguridad.
> 

| Colección | Propósito (lectura) | Escritura |
| --- | --- | --- |
| `users/` | Perfil básico público | Solo user 🔒 (sin `role`, `status`) |
| `drivers/` | Docs & estado conductor | Solo Admin |
| `vehicles/` | Vehículos por conductor | Solo Admin |
| `routes/` | Rutas e itinerarios | Solo Admin |
| `trips/` | Instancias de viaje | Admin / CF |
| `tickets/` | Boletos pagados | CF |
| `alerts/` | Botón de pánico / incidentes | Cualq. user crea |

---

## 4. **Cloud Functions** esenciales

| Nombre | Tipo | Rol |
| --- | --- | --- |
| `onUserCreate` | Auth trigger | Crea doc en `users/` con `role:'viajero', status:'pending'`. |
| `setUserRole` | Callable | **Solo admins**: asigna **Custom Claim `role`** (`admin / conductor / viajero`) y actualiza `users/{uid}.role` como *solo-lectura*. |
| `createPaymentIntent` | Callable | Genera `PaymentIntent` (Stripe). |
| `generateTicket` | Callable/HTTP | Tras pago → crea `tickets/`, sube QR, actualiza `trips/`. |
| `sendAlert` | HTTP | Crea doc en `alerts/` y dispara notificación FCM. |

> Inicializa Functions:
> 
> 
> ```bash
> 
> firebase init functions
> # Selecciona TypeScript, ESLint, Emulators
> 
> ```
> 

---

## 5. **Roles vía Custom Claims**

```tsx

// functions/src/auth-claims.ts
export const setUserRole = functions.https.onCall(async (data, ctx) => {
  if (ctx.auth?.token.role !== 'admin') throw new functions.https.HttpsError('permission-denied','Solo admins');
  await admin.auth().setCustomUserClaims(data.uid, { role: data.role });
  return { ok: true };
});

```

- El panel admin invoca `setUserRole` al aprobar conductores o crear otro admin.
- Los clientes leen el rol Seguro desde `request.auth.token.role`.

---

## 6. Reglas **Firestore** (resumen)

```jsx
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    function isAdmin()  { return request.auth.token.role == 'admin'; }
    function isDriver() { return request.auth.token.role == 'conductor'; }
    function isTraveler() { return request.auth.token.role == 'viajero'; }
    function isSelf(id) { return request.auth != null && request.auth.uid == id; }

    /* USERS -------------------------------------------------------- */
    match /users/{uid} {
      // Lectura: su propio perfil o admin
      allow read: if isSelf(uid) || isAdmin();

      // Actualización: el propio usuario, sin modificar role ni status
      allow update: if isSelf(uid) &&
        !("role" in request.resource.data.diff(resource.data)) &&
        !("status" in request.resource.data.diff(resource.data));

      // Creación / eliminación: solo admin (se usa setUserRole para claims)
      allow create, delete: if isAdmin();
    }

    /* DRIVERS ------------------------------------------------------ */
    match /drivers/{driverId} {
      allow read: if isSelf(driverId) || isAdmin();
      allow write: if isAdmin();
    }

    /* VEHICLES ----------------------------------------------------- */
    match /vehicles/{vehicleId} {
      allow read: true;                 // público (solo datos del vehículo)
      allow write: if isAdmin();
    }

    /* ROUTES ------------------------------------------------------- */
    match /routes/{routeId} {
      allow read: true;
      allow write: if isAdmin();
    }

    /* TRIPS -------------------------------------------------------- */
    match /trips/{tripId} {
      allow read: true;
      allow write: if isAdmin();        // o Cloud Functions de backend
    }

    /* TICKETS ------------------------------------------------------ */
    match /tickets/{ticketId} {
      allow read: if isSelf(resource.data.uid) || isAdmin();
      // Los tickets se generan y actualizan únicamente desde Cloud Functions
      allow write: if isAdmin();
    }

    /* ALERTS (Botón de pánico) ------------------------------------ */
    match /alerts/{alertId} {
      allow create: if request.auth != null;    // cualquier usuario autenticado puede crear
      allow read, update: if isAdmin();         // admin hace seguimiento
    }
  }
}
```

---

## 7. Reglas **Storage** (extracto)

```jsx
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    /* Documentos de identidad y verificación */
    match /documents/{uid}/{file} {
      allow write: if request.auth.uid == uid;                 // dueño sube
      allow read : if request.auth.token.role == 'admin';      // sólo admin revisa
    }

    /* Fotografías de vehículos */
    match /vehicles/{file} {
      allow read: true;                                        // visibles a cualquiera
      allow write: if request.auth.token.role == 'admin';
    }

    /* Códigos QR de boletos */
    match /qr/{file} {
      allow read: if request.auth != null;                     // usuarios con sesión pueden leer
      allow write: if request.auth.token.role == 'admin';      // generados vía Function
    }

    /* Otros recursos estáticos (por defecto, bloquear) */
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 8. **firebase.json** mínimo

```json
{
  "$schema": "https://firebase.dev/schema/v1",
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  },
  "hosting": {
    "site": "de-compas-admin",               // ID de Hosting creado en Firebase Console
    "public": "web/dist",                    // carpeta generada por tu build de React
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [                               // cache estático para recursos de la app web
      {
        "source": "/assets/**",
        "headers": [
          { "key": "Cache-Control", "value": "public,max-age=31536000,immutable" }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "functions": {
      "port": 5001
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "port": 4000
    }
  }
}
```

---

## 8.1. **firestore.indexes.json**

```json
{
  "indexes": [
    {
      "collectionGroup": "tickets",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "driverId",   "order": "ASCENDING" },
        { "fieldPath": "createdAt",  "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "tickets",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid",        "order": "ASCENDING" },
        { "fieldPath": "createdAt",  "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "routes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "origin",      "order": "ASCENDING" },
        { "fieldPath": "destination", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 9. **CI/CD – GitHub Actions** (esqueleto)

```yaml

name: Firebase Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: npm i -g firebase-tools
      - run: npm ci
      - run: npm run build --workspaces
      - run: firebase deploy --token ${{ secrets.FIREBASE_TOKEN }}

```

---

## 10. Verificaciones de fin de sprint

- [ ]  Usuario nuevo se registra → `onUserCreate` crea doc en `users/`.
- [ ]  Admin invoca `setUserRole` → claim se asigna y reglas lo reconocen.
- [ ]  Intento de cambiar `role` desde cliente = **Permiso denegado**.
- [ ]  Empaquetado de reglas y hosting se despliega vía `firebase deploy`.
- [ ]  Apps locales se conectan al **Emulator Suite** sin errores:
    
    ```bash
    firebase emulators:start
    ```
    

---