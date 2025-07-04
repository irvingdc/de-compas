# 📱 SPRINT 2 – Registro y Validación de Usuarios (1.5 semanas

## 🎯 Objetivo del Sprint

Implementar los flujos básicos de:

- Registro de viajeros y conductores.
- Verificación de cuenta (correo/SMS).
- Subida de documentos.
- Gestión del perfil.
- Validación del lado del panel admin.

---

## ⚙️ 1. **Preparar proyecto Flutter**

Haz esto para cada app (`compas_viajero` y `compas_conductor`), o una sola con lógica condicional por rol si prefieres:

### Dependencias mínimas

```yaml

dependencies:
  firebase_core: ^latest
  firebase_auth: ^latest
  cloud_firestore: ^latest
  firebase_storage: ^latest
  flutter_secure_storage: ^latest
  image_picker: ^latest
  file_picker: ^latest
  fluttertoast: ^latest

```

### Inicializar Firebase en `main.dart`

```dart

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

```

---

## 👤 2. Registro de **Viajero**

### UI: Pantalla de registro

- [ ]  Formulario con: nombre, email, teléfono, contraseña.
- [ ]  Subida de documento (INE/pasaporte).
- [ ]  Checkbox de términos y condiciones.

### Funciones técnicas

- [ ]  Crear usuario en Firebase Auth (`email/password`).
- [ ]  Enviar verificación por email (`sendEmailVerification()`).
- [ ]  Subir documento a Firebase Storage (`/documents/{uid}/ine.pdf`).
- [ ]  Crear documento en `users/` con rol `"viajero"`:

```dart

await FirebaseFirestore.instance.collection('users').doc(uid).set({
  'role': 'viajero',
  'name': name,
  'email': email,
  'status': 'pending',
  'verified': false,
  'createdAt': Timestamp.now(),
});

```

---

## 👨‍✈️ 3. Registro de **Conductor**

### UI: Pantalla multistep

- [ ]  Datos personales: nombre, email, teléfono, RFC (opcional).
- [ ]  Subida de documentos (INE, licencia, tarjeta de circulación, seguro, domicilio).
- [ ]  Botón para aceptar términos y condiciones.

### Funciones técnicas

- [ ]  Crear usuario en Auth + email verification.
- [ ]  Subir documentos a Firebase Storage: `/documents/{uid}/{tipo}.pdf`
- [ ]  Crear documento en `users/` con rol `"conductor"` y status `"pending"`.
- [ ]  Crear documento en `drivers/`:

```dart

await FirebaseFirestore.instance.collection('drivers').doc(uid).set({
  'uid': uid,
  'documents': {
    'ine': 'storage-url',
    'license': '...',
    'circulation': '...',
    'insurance': '...',
    'proofOfAddress': '...'
  },
  'status': 'pending',
});

```

---

## ✅ 4. Validación de cuenta

### Para ambos roles:

- [ ]  Forzar verificación de correo antes de permitir el login (uso de `isEmailVerified`).
- [ ]  Mostrar mensaje tipo “Verifica tu correo para continuar”.

### Para conductor:

- [ ]  Esperar aprobación del admin desde el panel antes de dejar avanzar (revisar `status` en `drivers`).

---

## 🧑‍💼 5. Pantalla de perfil

### UI

- [ ]  Visualizar datos personales y documentos subidos.
- [ ]  Opción para editar nombre/teléfono.
- [ ]  Botón para cerrar sesión.

### Lógica

- [ ]  Leer de `users/{uid}` y mostrar datos.
- [ ]  Editar campos básicos (excepto rol/status).
- [ ]  Mostrar `status` ("En revisión", "Aprobado", etc.).

---

## 📱 6. Estructura de carpetas sugerida (Flutter)

```bash

/lib
  /auth
    login.dart
    register.dart
  /profile
    profile_screen.dart
  /services
    auth_service.dart
    firestore_service.dart
    storage_service.dart
  /widgets
    input_field.dart
    button.dart
  main.dart

```

---

## 🧪 7. Validaciones clave

- [ ]  Email duplicado: mostrar error.
- [ ]  Documento no subido: prevenir registro.
- [ ]  Contraseña débil: validar antes de enviar.
- [ ]  Usuario no verificado: bloquear avance.

---

## 📦 8. Verificaciones en Firebase Console

✅ ¿Usuarios creados aparecen en Firebase Auth?

✅ ¿Se suben correctamente los documentos a Storage?

✅ ¿Se escriben los datos en Firestore correctamente (users/drivers)?

✅ ¿Puedes verlos desde el panel admin para aprobarlos?