const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
admin.initializeApp({
  projectId: 'de-compas-dev',
});

async function createAdminUser() {
  try {
    // Crear usuario
    const userRecord = await admin.auth().createUser({
      email: 'admin@decompas.com',
      password: 'Admin123!',
      displayName: 'Administrador Principal',
      disabled: false,
    });

    console.log('✅ Usuario creado:', userRecord.uid);

    // Asignar rol de admin usando Custom Claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    console.log('✅ Rol admin asignado');

    // Crear documento en Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: 'admin@decompas.com',
      name: 'Administrador Principal',
      role: 'admin',
      status: 'active',
      verified: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Documento creado en Firestore');
    console.log('\n🎉 Usuario admin creado exitosamente!');
    console.log('📧 Email: admin@decompas.com');
    console.log('🔑 Password: Admin123!');
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
}

createAdminUser(); 