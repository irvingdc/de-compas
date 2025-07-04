# 🛰️ SPRINT 4 – Seguimiento de Viaje en Tiempo Real (2 semanas)

---

## 🎯 Objetivo del Sprint

- El conductor puede iniciar y finalizar un viaje, escanear boletos, compartir su ubicación.
- El viajero puede ver el estado del viaje, su ubicación en el mapa, y recibir notificaciones.
- El sistema puede recibir alertas de emergencia (botón de pánico).

---

## 🧑‍✈️ 1. **Inicio y finalización de viaje (Conductor)**

### Firestore: `trips/{tripId}`

```tsx

{
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
  startTime: Timestamp,
  endTime: Timestamp,
  location: GeoPoint,
  locationHistory: [GeoPoint]
}

```

### Tareas

- [ ]  Mostrar botón “Iniciar viaje” si `status == 'scheduled'`.
- [ ]  Al iniciar:
    - Cambiar `status: 'in_progress'`.
    - Guardar `startTime`.
    - Comenzar a subir ubicación (ver punto 3).
- [ ]  Mostrar botón “Finalizar viaje” cuando esté en curso.
- [ ]  Al finalizar:
    - Cambiar `status: 'completed'`.
    - Guardar `endTime`.

---

## 📍 2. **Ubicación en tiempo real**

### Librerías necesarias

```yaml

dependencies:
  geolocator: ^latest
  google_maps_flutter: ^latest
  firebase_database: ^latest # Realtime DB

```

### Firebase Realtime DB estructura

```json

/tripLocations/{tripId} {
  driverId: "...",
  lat: 19.4333,
  lng: -99.1333,
  timestamp: ...
}

```

### Tareas (Conductor)

- [ ]  Al iniciar el viaje, pedir permiso de ubicación en background.
- [ ]  Subir posición actual cada 5–10 segundos:

```dart

FirebaseDatabase.instance.ref('tripLocations/$tripId').set({
  'lat': lat,
  'lng': lng,
  'timestamp': ServerValue.timestamp
});

```

---

## 🗺️ 3. **Mapa en vivo (Viajero)**

### Tareas

- [ ]  En pantalla de ticket activo:
    - Mostrar Google Map embebido.
    - Escuchar cambios en `tripLocations/{tripId}` en tiempo real.
    - Actualizar posición del conductor.
- [ ]  Mostrar estado del viaje:
    - “Próximo a iniciar”, “En ruta”, “Finalizado”.

---

## 🔍 4. **Escaneo de boletos QR (Conductor)**

### Tareas

- [ ]  Mostrar botón “Escanear boleto” antes de iniciar el viaje.
- [ ]  Usar `qr_code_scanner` o `mobile_scanner`.
- [ ]  Validar ticket escaneado:
    - UID del pasajero coincide.
    - Trip ID y asiento están reservados.
- [ ]  Confirmar abordaje (opcional: marcar como “abordado”).

### Ejemplo: validar en `tickets/`

```dart

FirebaseFirestore.instance
  .collection('tickets')
  .where('tripId', isEqualTo: currentTripId)
  .where('uid', isEqualTo: scannedUid)

```

---

## 🚨 5. **Botón de pánico (ambos)**

### Firestore: `alerts/`

```tsx

{
  uid: 'userId',
  tripId: 'tripId',
  type: 'panic',
  location: GeoPoint,
  timestamp: Timestamp,
  resolved: false
}

```

### Tareas (Viajero y Conductor)

- [ ]  Mostrar botón de emergencia visible en pantalla del viaje.
- [ ]  Al presionar:
    - Capturar ubicación actual.
    - Crear documento en `alerts/`.
    - Notificar a soporte (opcional: Cloud Function).

---

## 💬 6. **Contacto y ayuda**

### Tareas

- [ ]  Agregar botón “Contactar soporte” que abra:
    - Correo directo (mailto).
    - WhatsApp.
    - Chat embebido (si se implementa).
- [ ]  (Opcional) Guardar consultas en `support_requests/`.

---

## 🧪 7. Validaciones y seguridad

- [ ]  Solo el conductor asignado puede iniciar/finalizar el viaje.
- [ ]  Solo se puede escanear QR una vez.
- [ ]  La ubicación se detiene al finalizar el viaje o cerrar la app.
- [ ]  Botón de pánico debe registrar localización incluso sin internet (almacenar y reenviar).

---

## 📦 8. Sugerencia de estructura de archivos

```bash

/lib
  /trip
    trip_dashboard.dart
    live_map.dart
    scan_qr.dart
    panic_button.dart
  /services
    location_service.dart
    firebase_service.dart
    trip_service.dart

```

---

## ✅ Checklist fin de sprint

- [ ]  ¿El conductor puede iniciar y terminar un viaje?
- [ ]  ¿El pasajero puede ver la ubicación en tiempo real?
- [ ]  ¿El escaneo de QR valida correctamente?
- [ ]  ¿El botón de pánico guarda la alerta?