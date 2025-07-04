# Descripción General

## Proyecto **“De Compas”** – Visión General y Funcionalidades

### 1. Concepto

“De Compas” es una plataforma integral que conecta **pasajeros** que desean compartir rutas interestatales con **conductores** de vehículos eléctricos o híbridos. Combina dos apps móviles (Viajero y Conductor) y un panel web administrativo para operar, supervisar y monetizar los viajes con seguridad y trazabilidad en tiempo real.

---

### 2. Componentes principales

| Componente | Tecnología base | Usuarios objetivo |
| --- | --- | --- |
| **Panel Administrativo (web)** | React + TypeScript, Tailwind, Firebase Admin SDK | Personal interno (operaciones, soporte, finanzas, supervisión) |
| **App Viajero (móvil)** | Flutter, Firebase (Auth, Firestore, FCM, Storage) | Pasajeros |
| **App Conductor (móvil)** | Flutter, Firebase | Conductores |
| **Backend serverless** | Firebase Auth · Firestore · Realtime DB · Cloud Functions · Storage · FCM | Lógica de negocio, pagos, notificaciones |

---

### 3. Funcionalidades por módulo

### 3.1 Panel Administrativo (Web)

1. **Gestión de Rutas y Horarios**
    - Crear, editar, activar/desactivar rutas y frecuencias.
    - Asignar vehículos y conductores.
    - Precios base y dinámicos, visualización en mapa.
2. **Gestión de Conductores**
    - Revisión de documentos (INE, licencia, póliza, etc.).
    - Aprobación/rechazo, estados (pending/approved/rejected).
    - Historial de viajes, cancelaciones e incidentes.
    - Evaluación de desempeño y reputación.
3. **Gestión de Viajeros**
    - Consulta de perfiles y verificación de identidad.
    - Historial de viajes y reportes de comportamiento.
    - Bloqueo/desbloqueo de cuentas.
4. **Gestión de Viajes**
    - Monitoreo en tiempo real (desvíos, progreso, ocupación).
    - Alertas automáticas (botón de pánico, geofencing).
    - Historial con filtros avanzados.
5. **Gestión Financiera**
    - Reportes por viaje, ciudad, conductor y rango de fechas.
    - Control de comisiones y pagos pendientes.
    - Reembolsos mediante Stripe; exportación CSV.
6. **Seguridad y Alertas**
    - Recepción de alertas de pánico con ubicación exacta.
    - Registro y seguimiento de incidentes.
7. **Panel de Métricas & Analítica**
    - KPIs (ingresos, ocupación, cancelaciones).
    - Tendencias de demanda por ciudad o temporada.
8. **Gestión de Contenido y Configuración**
    - FAQs, banners, términos y condiciones.
    - Sistema de roles RBAC granulado y bitácora de auditoría.
    - Parámetros globales (comisión, límites de equipaje, etc.).
    - Integraciones externas (verificación biométrica, pasarela de pago, SMS).

---

### 3.2 App Viajero (Flutter)

1. **Registro y Verificación**
    - Alta con email/teléfono y verificación por correo/SMS.
    - Carga de identificación; validación biométrica opcional.
    - Gestión de perfil y métodos de pago.
2. **Exploración de Rutas**
    - Búsqueda por origen, destino y fecha con filtros (vehículo, precio, horario).
    - Vista previa en mapa y disponibilidad de asientos.
3. **Compra de Boletos**
    - Selección de asiento, equipaje y acompañantes.
    - Pago integrado (Stripe, SPEI, PayPal); cupones promocionales.
    - Emisión instantánea de boleto digital con código QR.
4. **Gestión de Boletos y Viajes**
    - Historial de viajes, reembolsos y notificaciones de cambios.
    - Acceso rápido al boleto para escaneo.
5. **Durante el Viaje**
    - Rastreo en tiempo real de la ubicación del vehículo.
    - Estado del viaje (“Próximo”, “En ruta”, “Finalizado”).
    - Botón de ayuda y botón de pánico.
6. **Seguridad y Confianza**
    - Perfil público del conductor (calificaciones, viajes).
    - Checklist previo de placa y vehículo.
7. **Soporte y Facturación**
    - FAQ, contacto con soporte, descarga de facturas.
    - Configuración de notificaciones y cierre de cuenta.

---

### 3.3 App Conductor (Flutter)

1. **Registro y Validación**
    - Alta con datos personales y RFC.
    - Carga de documentos obligatorios (INE, licencia, póliza, etc.).
    - Verificación biométrica opcional; aprobación manual por admin.
2. **Gestión de Vehículos**
    - Registro de uno o varios vehículos (marca, modelo, placas, foto).
    - Estados: activo, revisión, inhabilitado.
3. **Viajes Asignados**
    - Lista de próximos viajes con detalle de ruta y pasajeros.
    - Aceptar/rechazar viaje (configurable).
4. **Inicio y Control de Viaje**
    - Escaneo de boletos QR para validar pasajeros.
    - Botones “Iniciar” y “Finalizar” viaje.
    - Envío de ubicación al backend cada pocos segundos.
    - Registro automático de ubicación.
5. **Seguridad en Ruta**
    - Botón de pánico conectado al centro de soporte.
    - Canal de comunicación con administración.
6. **Ingresos y Pagos**
    - Panel de ganancias por día, semana, mes.
    - Histórico de pagos y próximas liquidaciones.
7. **Reputación**
    - Calificaciones recibidas y métricas de puntualidad/cancelaciones.
8. **Soporte y Comunidad**
    - FAQs, noticias internas y sugerencias.

---

### 4. Backend y Seguridad

| Servicio Firebase | Función en el proyecto |
| --- | --- |
| **Auth + Custom Claims** | Registro seguro y roles (admin, conductor, viajero). |
| **Firestore** | Datos estructurados (usuarios, rutas, trips, tickets, vehículos). |
| **Realtime DB** | Ubicación en vivo de vehículos. |
| **Cloud Functions** | Creación automática de documentos, pago Stripe, generación de tickets, asignación de roles, alertas de pánico. |
| **Storage** | Documentos oficiales, fotos de vehículos, códigos QR. |
| **FCM** | Notificaciones push (cambios de viaje, alertas). |
| **Hosting** | Despliegue del panel administrativo React. |

**Seguridad**

- Reglas de Firestore/Storage bloquean cambios maliciosos.
- Roles salvaguardados con Custom Claims.
- Datos sensibles cifrados en tránsito (TLS 1.3) y en reposo.
- Bitácora de acciones administrativas y monitoreo con Crashlytics/Analytics.

---

### 5. DevOps e Infraestructura

- **Monorepo pnpm** con CI/CD en GitHub Actions.
- Deploy automático de Hosting, Functions, Reglas y Storage.
- Emuladores locales para Auth, Firestore, Functions y Hosting.
- Backups diarios automatizados de Firestore y Storage.
- Integración con Stripe para pagos y reembolsos, SendGrid/Twilio para email/SMS.
- Panel de monitoreo (BigQuery + Looker o Grafana) para KPIs técnicos y de negocio.

---

### 6. Flujo resumido de uso

1. **Registro y aprobación**
    - Viajero se registra y verifica email/SMS.
    - Conductor se registra, sube documentos y espera aprobación admin.
2. **Publicación de rutas**
    - Admin configura rutas y horarios, asigna conductor y vehículo.
3. **Compra de boleto**
    - Viajero busca ruta, paga y recibe QR.
    - Cloud Function crea ticket y actualiza ocupación.
4. **Embarque y viaje**
    - Conductor escanea QR, inicia viaje y envía ubicación.
    - Viajero sigue la ruta en su app; alertas de pánico disponibles.
5. **Finalización y pagos**
    - Conductor cierra viaje; sistema liquida ingresos.
    - Admin revisa métricas, maneja reembolsos y soporte.

---

**Resultado final:** Una plataforma confiable y escalable que cubre todo el ciclo —desde la gestión operativa hasta la experiencia de usuario— garantizando seguridad, trazabilidad y facilidad de expansión a nuevas ciudades o servicios.