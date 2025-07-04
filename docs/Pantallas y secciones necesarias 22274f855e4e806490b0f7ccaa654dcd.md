# Pantallas y secciones necesarias

> Se enumeran todas las vistas que deben existir en las tres aplicaciones, seguidas de los componentes/funciones que cada una contiene.
> 
> 
> *Puedes usarlas como checklist de UI/UX y como referencia de rutas de navegación.*
> 

---

## A. **App Viajero** (Flutter)

| Pantalla | Secciones / widgets imprescindibles |
| --- | --- |
| **1. Splash & Onboarding** | • Logo + animación breve• Slides con beneficios­­• Botones “Iniciar sesión” / “Crear cuenta” |
| **2. Registro** | • Form (email, teléfono, contraseña)• Checkbox aceptar términos• Botón “Continuar” |
| **3. Verificación e-mail/SMS** | • Campo código• Temporizador reenviar• Botón “Verificar” |
| **4. Subir identificación** | • Selector de tipo (INE, pasaporte)• ImagePicker + preview• Botón “Enviar” |
| **5. Selección método de pago inicial** | • Lista de tarjetas guardadas (vacía)• Botón “Agregar tarjeta / SPEI / PayPal” |
| **6. Home / Buscar ruta** | • Inputs origen, destino, fecha• Filtros rápidos (precio, vehículo, horario)• Listado rutas populares• Botón “Buscar” |
| **7. Resultados de búsqueda** | • Tarjetas de ruta con precio, horario, duración, disponibilidad• Mapa miniatura opcional• Filtro y ordenación persistentes |
| **8. Detalle de ruta / Selección de asiento** | • Mapa completo del recorrido• Información de conductor y vehículo• Malla de asientos interactiva• Selector equipaje extra• Resumen costo |
| **9. Pago** | • Desglose total (impuestos, comisión)• Selector de cupón• PaymentSheet Stripe / SPEI• Indicador de proceso |
| **10. Confirmación de boleto** | • QR grande• Datos del viaje (hora, asiento)• Botones “Añadir al calendario” / “Enviar por correo” |
| **11. Viaje en curso** | • Mapa live con marker vehículo• Estado (“En ruta”, ETA)• Botón “Ayuda”• Botón “Pánico” (rojo) |
| **12. Historial de viajes** | • Tabs “Próximos” / “Pasados” / “Cancelados”• Tarjeta de cada viaje con acceso a ticket |
| **13. Ticket / Factura** | • QR + detalles• Botón “Descargar PDF / Factura” |
| **14. Perfil** | • Foto y datos básicos• Editar email, teléfono, nombre• Nivel de verificación• Botón “Eliminar cuenta” |
| **15. Métodos de pago** | • Lista y CRUD tarjetas / SPEI• Switch “Predeterminado” |
| **16. Ajustes / Notificaciones** | • Toggles push, correo, SMS• Idioma• Tema claro/oscuro |
| **17. Centro de ayuda** | • FAQ searchable• Formulario contacto (genera `support_requests`)• Historial de tickets soporte |
| **18. Calificar viaje** | • Estrellas conductor + comentario opcional |
| **19. Alertas y mensajes** | • Bandeja con notificaciones push recibidas |

---

## B. **App Conductor** (Flutter)

| Pantalla | Secciones / widgets imprescindibles |
| --- | --- |
| **1. Splash & Onboarding** | Igual a viajero pero con mensajes para conductores |
| **2. Registro** | • Form datos personales + RFC opcional• Checkbox términos |
| **3. Verificación e-mail/SMS** | Igual a viajero |
| **4. Subir documentos** | • 5 slots (INE, licencia, tarjeta circ., póliza, domicilio)• Progreso 0 %-100 % |
| **5. Registro de vehículo** | • Form marca, modelo, año, tipo, placas, asientos• ImagePicker foto auto |
| **6. Estado de aprobación** | • Banner “En revisión” / “Aprobado” / “Rechazado”• Lista de correcciones si aplica |
| **7. Inicio / Próximos viajes** | • Tarjetas por fecha/hora• Badge pasajeros confirmados• Botón “Detalles” |
| **8. Detalle del viaje** | • Lista de pasajeros + asientos• Mapa ruta• Botón “Escanear boletos” |
| **9. Escáner QR** | • Visor cámara• Resultado OK/ERROR + sonido |
| **10. Viaje en curso (mapa live)** | • Mapa + polyline• Botón “Finalizar”• Velocidad / ETA• Botón “Pánico” |
| **11. Resumen de viaje** | • Tiempo real vs estimado• Ingresos generados• Calificación promedio |
| **12. Ganancias** | • Totales día-semana-mes• Lista de pagos realizados/pedientes• Próxima fecha de depósito |
| **13. Perfil & documentos** | • Datos editables• Estado de cada doc (válido/caducado) |
| **14. Ajustes & notificaciones** | Similar a viajero |
| **15. Centro de ayuda** | FAQ + formulario soporte |
| **16. Comunidad / Noticias** | • Feed interno para conductores (opcional) |

---

## C. **Panel Administrativo** (Web)

| Vista / ruta | Secciones / widgets imprescindibles |
| --- | --- |
| **/login** | • Form email/pass• ReCAPTCHA opcional |
| **/dashboard (overview)** | • KPIs: usuarios, conductores, viajes activos, ingresos hoy• Mini-gráfica ocupación• Lista últimas alertas |
| **/routes** | • Tabla Rutas• Filtros por ciudad/activo• Botón “Nueva ruta” (modal)• Edit / toggle activo |
| **/drivers** | • Tabs Pending / Approved / Rejected• Tarjeta conductor con documentos (preview PDF/img)• Aprobar / Rechazar• Historial viajes y reputación |
| **/vehicles (dentro de conductor)** | • Tabla vehículos vinculados• Botón desactivar vehículo |
| **/travelers** | • Tabla viajeros con filtros (bloqueados/verificados)• Acción bloquear/desbloquear |
| **/trips** | • Lista viajes programados / activos• Filtros ruta, fecha, estatus• Link a mapa live |
| **/live-map** | • Mapa fullscreen con todos vehículos en curso• Sidebar selección viaje para centrar |
| **/alerts** | • Cola de pánicos abiertos• Detalles ubicación + timestamp• Botón “Marcar como resuelto” |
| **/finance** | • Selector rango fechas• KPIs ingreso bruto, comisión, neto conductores• Tabla tickets (export CSV)• Botón “Reembolsar” (abre modal, llama Cloud Function) |
| **/support** | • Tabla `support_requests` estado open/resolved• Respuesta inline (envía email/push) |
| **/content** | • Editor markdown FAQ• Editor banners promomacionales• Campos términos y condiciones |
| **/settings/system** | • Parámetros globales (comisión %, tiempos espera, límites equipaje)• Guardar en `settings/system` |
| **/settings/roles** | • CRUD roles RBAC granulares (lectura/escritura por módulo) |
| **/audit-log** | • Tabla acciones (quién, qué, cuándo) con filtros |
| **/integrations** | • Campos API keys (Stripe, Map, Twilio, Veriff) en forms seguros |
| **/profile** | • Cambiar contraseña admin• Cerrar sesión |