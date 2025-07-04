# 🚍 SPRINT 3 – Exploración y Compra de Viajes (2 semanas)

## 🎯 Objetivo del Sprint

- El viajero puede buscar rutas, ver horarios, elegir asiento, pagar y recibir un boleto.
- El conductor puede ver sus viajes asignados y los pasajeros correspondientes.

---

## 📍 1. **Exploración de rutas (App Viajero)**

### Firestore: `routes/`

```tsx

{
  origin: 'CDMX',
  destination: 'Puebla',
  price: 220,
  frequency: ['lunes', 'viernes'],
  departureTime: '08:00',
  duration: '2h',
  vehicleId: 'veh123',
  active: true
}

```

### Tareas

- [ ]  Pantalla de búsqueda con filtros:
    - Origen, destino, fecha.
    - Filtro por tipo de vehículo, precio, hora.
- [ ]  Llamada a Firestore:

```dart

FirebaseFirestore.instance.collection('routes')
  .where('origin', isEqualTo: origen)
  .where('destination', isEqualTo: destino)
  .where('active', isEqualTo: true)

```

- [ ]  Mostrar resultado con:
    - Mapa del recorrido (opcional).
    - Hora de salida y llegada estimada.
    - Precio base y disponibilidad.

---

## 🎟️ 2. **Selección de asiento y compra (App Viajero)**

### Firestore: `trips/`

```tsx

{
  routeId: 'route123',
  driverId: 'uidX',
  vehicleId: 'veh123',
  date: '2025-07-03',
  passengers: [
    { uid: 'uidX', seat: 2 },
    ...
  ],
  status: 'scheduled'
}

```

### Firestore: `tickets/`

```tsx

{
  uid: 'uidX',
  tripId: 'trip123',
  seat: 2,
  price: 240,
  status: 'paid',
  qrUrl: 'storage/qr/uid-trip123.png',
  createdAt: Timestamp
}

```

### Tareas

- [ ]  Crear pantalla de selección de asiento.
- [ ]  Validar disponibilidad en `trips/` para esa ruta y fecha.
- [ ]  Integrar Stripe (`flutter_stripe`):
    - Crear `PaymentIntent` desde Cloud Function.
    - Confirmar pago desde Flutter.
- [ ]  Al pagar:
    - Crear documento en `tickets/`.
    - Actualizar ocupación en `trips/`.
    - Generar QR (opcional) y subirlo a Storage.

---

## 💳 3. **Pago con Stripe (Viajero)**

### Tareas técnicas

- [ ]  Configurar Cloud Function:

```tsx

// /functions/src/createPaymentIntent.ts
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  const amount = data.amount; // en centavos
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'mxn',
    metadata: { uid: context.auth.uid }
  });
  return { clientSecret: paymentIntent.client_secret };
});

```

- [ ]  En Flutter:
    - Llamar a la función.
    - Iniciar flujo de Stripe:

```dart

await Stripe.instance.initPaymentSheet(...);
await Stripe.instance.presentPaymentSheet();

```

---

## 🧾 4. **Confirmación y ticket digital (App Viajero)**

### Tareas

- [ ]  Mostrar ticket digital en la app:
    - Fecha, origen, destino, asiento, nombre del conductor.
    - Código QR (opcional).
- [ ]  Botón para reenviar boleto por correo.
- [ ]  Historial de viajes anteriores (`tickets.where('uid' == uid)`).

---

## 🚘 5. **Viajes asignados (App Conductor)**

### Tareas

- [ ]  Mostrar lista de viajes programados.
- [ ]  Ver detalles del viaje:
    - Ruta, hora de salida.
    - Lista de pasajeros confirmados (`tickets.where('tripId' == trip.id)`).
- [ ]  Mostrar asientos asignados y pasajeros.
- [ ]  (Opcional) Confirmar participación del conductor.

---

## 🔄 6. Relaciones entre colecciones

**Consejo técnico:** Mantén coherencia entre las siguientes colecciones:

- `routes/` → base de la ruta.
- `trips/` → instancia específica con fecha y conductor.
- `tickets/` → compra confirmada con asiento.
- `vehicles/` → asientos disponibles.

Si no hay `trip` para esa ruta y fecha, puedes:

- [ ]  Crearla automáticamente al momento de compra.
- [ ]  O tener viajes preprogramados cargados por admin.

---

## 🧪 7. Validaciones clave

- [ ]  No permitir duplicidad de asientos.
- [ ]  Validar disponibilidad antes de crear boleto.
- [ ]  Mostrar errores de pago claros.
- [ ]  Enviar confirmación post-pago.
- [ ]  Proteger funciones con `context.auth.uid`.

---

## 📦 8. Estructura sugerida Flutter

```bash

/lib
  /routes
    search_routes.dart
    select_seat.dart
    payment.dart
    ticket.dart
  /driver
    my_trips.dart
  /services
    firestore_service.dart
    stripe_service.dart

```

---

## ✅ Checklist de fin de sprint

- [ ]  ¿Puedes buscar rutas, filtrar y seleccionarlas?
- [ ]  ¿Puedes seleccionar un asiento y pagar?
- [ ]  ¿Se genera el boleto y se guarda en Firestore?
- [ ]  ¿Puedes ver el viaje desde la app del conductor?