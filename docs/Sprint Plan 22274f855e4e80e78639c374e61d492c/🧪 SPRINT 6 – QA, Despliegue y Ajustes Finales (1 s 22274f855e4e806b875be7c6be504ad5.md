# 🧪 SPRINT 6 – QA, Despliegue y Ajustes Finales (1 semana)

---

## 🎯 Objetivo del Sprint

- Validar que todos los flujos principales funcionan correctamente en web y móvil.
- Corregir errores funcionales y visuales.
- Hacer el despliegue productivo (Firebase Hosting + App Stores).
- Asegurar que roles, reglas y permisos estén correctamente configurados.

---

## ✅ 1. **Checklist de pruebas funcionales por tipo de usuario**

### 🧍‍♂️ Viajero

- [ ]  Registro con validación de correo y subida de documentos.
- [ ]  Búsqueda de rutas con filtros.
- [ ]  Selección de asiento y pago exitoso.
- [ ]  Visualización de boleto y ubicación en vivo.
- [ ]  Botón de ayuda y botón de pánico funcional.
- [ ]  Historial de viajes y pagos.
- [ ]  Contacto con soporte.

### 👨‍✈️ Conductor

- [ ]  Registro y envío de documentos.
- [ ]  Recepción de aprobación desde el admin.
- [ ]  Visualización de viajes asignados.
- [ ]  Escaneo de boletos QR.
- [ ]  Inicio/finalización del viaje.
- [ ]  Transmisión de ubicación en tiempo real.
- [ ]  Visualización de ingresos y soporte.

### 🧑‍💼 Admin Web

- [ ]  Login y validación por rol.
- [ ]  Gestión de rutas, conductores y viajeros.
- [ ]  Revisión y aprobación de documentos.
- [ ]  Seguimiento en vivo de viajes activos.
- [ ]  Panel financiero con filtros y exportación.
- [ ]  Recepción de alertas y tickets de soporte.
- [ ]  Emisión de reembolsos (Stripe + Firestore).

---

## 🔐 2. **Pruebas de seguridad**

### Firebase Auth y Firestore Rules

- [ ]  Los viajeros no pueden acceder a rutas administrativas.
- [ ]  Conductores no pueden ver ingresos ajenos.
- [ ]  Admin tiene acceso completo, pero solo a través del panel.
- [ ]  Intentos maliciosos de escritura en Firestore son rechazados.
- [ ]  Pruebas de sesión expirada y refresh.

---

## 🧹 3. **Correcciones menores (UX/UI)**

- [ ]  Textos mal cortados, traducciones faltantes.
- [ ]  Comprobación de responsividad (web y móvil).
- [ ]  Alineación de botones, colores, accesibilidad mínima.
- [ ]  Iconografía consistente.
- [ ]  Estados vacíos o mensajes de error personalizados.

---

## 🚀 4. **Despliegue final**

### Web Admin (React + Firebase Hosting)

- [ ]  Ejecutar build:

```bash

npm run build
firebase deploy --only hosting

```

### Apps Móviles (Flutter)

- [ ]  Generar builds firmados:
    - Android → `.aab` o `.apk` (Play Console).
    - iOS → `.ipa` con cuenta de Apple Developer.
- [ ]  Revisar configuración de Firebase para `release`:
    - App ID
    - SHA-1 (Android)
    - Bundle ID (iOS)
- [ ]  Subir a tiendas:
    - Google Play: configuraciones de privacidad, soporte y seguridad.
    - App Store: configuración de TestFlight y políticas de revisión.

---

## 🗂️ 5. **Backups y monitoreo**

- [ ]  Configurar backups diarios de Firestore y Storage.
- [ ]  Configurar Firebase Crashlytics para ambas apps.
- [ ]  Monitoreo básico con Firebase Analytics + BigQuery (opcional).
- [ ]  Panel interno de incidentes (usando `alerts/`).

---

## 📅 6. **Checklist final de entrega**

| Elemento | Verificado |
| --- | --- |
| Registro y login seguro | 🔲 |
| Rutas y viajes operativos | 🔲 |
| Pagos y QR funcionales | 🔲 |
| Ubicación en vivo activa | 🔲 |
| Botón de pánico operando | 🔲 |
| Admin con control total | 🔲 |
| Financiero correcto | 🔲 |
| Apps publicadas | 🔲 |
| Backups y monitoreo activos | 🔲 |