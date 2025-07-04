# 💰 SPRINT 5 – Pagos, Finanzas y Soporte (1.5 semanas)

---

## 🎯 Objetivo del Sprint

- El admin puede revisar ingresos, comisiones, reembolsos.
- El conductor puede ver cuánto ha ganado y lo que se le ha pagado.
- El viajero puede consultar su historial de pagos y facturas.
- Soporte básico disponible para todos.

---

## 🧾 1. **Estructura de Firestore para Finanzas**

### Colección: `tickets/` (ya existe)

Cada compra representa un pago hecho por un viajero.

```tsx

{
  uid: 'viajero123',
  tripId: 'tripABC',
  driverId: 'conductorXYZ',
  price: 280,
  commission: 0.1, // 10%
  netToDriver: 252,
  status: 'paid' | 'refunded',
  createdAt: Timestamp,
  paymentIntentId: 'pi_1234'
}

```

---

## 👨‍💼 2. **Panel financiero (Admin Web)**

### Vistas necesarias

- [ ]  Total de ingresos por rango de fechas.
- [ ]  Filtro por:
    - Ruta.
    - Ciudad.
    - Conductor.
- [ ]  Ver total recaudado vs comisión vs pagos netos.
- [ ]  Exportar a CSV.

### Firebase Query (ejemplo)

```tsx

const q = query(
  collection(db, 'tickets'),
  where('createdAt', '>=', startDate),
  where('createdAt', '<=', endDate)
);

```

### Funcionalidades

- [ ]  Generar y mostrar KPIs:
    - Total vendido
    - Total comisión
    - Total a pagar a conductores
- [ ]  Exportar datos con `json2csv` o similar:

```tsx

import { Parser } from 'json2csv';
const parser = new Parser();
const csv = parser.parse(ticketsArray);

```

---

## 🚚 3. **Panel de ingresos (Conductor App)**

### Pantalla en Flutter:

- [ ]  Lista de tickets por viaje (de conductor).
- [ ]  Total ganado por día, semana, mes.
- [ ]  Monto retenido por la plataforma (comisión).
- [ ]  Próxima fecha de liquidación (puedes usar campo `nextPayoutDate` opcional).

### Firebase Query

```dart

FirebaseFirestore.instance
  .collection('tickets')
  .where('driverId', isEqualTo: conductorUID)
  .where('status', isEqualTo: 'paid')

```

---

## 🧍‍♀️ 4. **Historial de pagos (Viajero App)**

### Pantalla

- [ ]  Lista de boletos con precio, fecha, asiento.
- [ ]  Estado del pago.
- [ ]  Botón para ver ticket / factura.
- [ ]  Botón para reenviar boleto por correo.

---

## 💸 5. **Reembolsos y ajustes**

### Tareas

- [ ]  En panel admin, opción para marcar un ticket como “reembolsado”.
- [ ]  Ejecutar función en Cloud Functions para usar Stripe API:

```tsx

const refund = await stripe.refunds.create({
  payment_intent: paymentIntentId
});

```

- [ ]  Actualizar `tickets/{id}` con `status: 'refunded'`.

---

## 📞 6. **Soporte y contacto**

### Todos los usuarios

- [ ]  Agregar en apps móviles:
    - Preguntas frecuentes (estáticas o desde Firestore).
    - Formulario de contacto que guarde en `support_requests/`.
    - Redirección a WhatsApp, mailto, o web chat.

### Firestore: `support_requests/`

```tsx

{
  uid: 'user123',
  message: 'No me llegó mi boleto',
  createdAt: Timestamp,
  status: 'open' | 'resolved',
  response: '',
  adminId: 'admin456'
}

```

### Admin

- [ ]  Ver solicitudes en el panel.
- [ ]  Responder manualmente (agregar `response` al doc).

---

## 🧪 7. Validaciones y seguridad

- [ ]  Solo admins pueden acceder a reportes globales y emitir reembolsos.
- [ ]  Conductores solo pueden ver sus tickets.
- [ ]  Viajero solo puede ver sus propios pagos.
- [ ]  Reembolsos solo si `status == 'paid'` y dentro del tiempo límite.

---

## 📦 8. Sugerencia de estructura

### Web Admin

```bash

/src/pages
  /finances
    dashboard.tsx
    export_report.tsx
  /support
    support_list.tsx

```

### Flutter Apps

```
bash
CopyEdit
/lib/finances/income_screen.dart
/lib/support/support_screen.dart

```

---

## ✅ Checklist final del Sprint

- [ ]  ¿El admin puede ver ingresos, exportar datos y hacer reembolsos?
- [ ]  ¿El conductor puede ver lo que ha ganado?
- [ ]  ¿El viajero puede revisar sus pagos?
- [ ]  ¿Todos pueden contactar a soporte?
- [ ]  ¿La app está protegida por roles (auth y reglas de Firestore)?