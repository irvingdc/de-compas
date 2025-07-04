const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize the Admin SDK
admin.initializeApp();

// Function to set user role (admin only)
exports.setUserRole = functions.https.onCall(async (data, context) => {
  // Check if request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado para realizar esta acción.');
  }

  // Check if the caller is an admin
  if (!context.auth.token.role || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Solo los administradores pueden asignar roles.');
  }

  const { uid, role } = data;

  // Validate input
  if (!uid || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'UID y rol son requeridos.');
  }

  // Validate role
  const validRoles = ['admin', 'conductor', 'viajero'];
  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'Rol no válido. Roles válidos: admin, conductor, viajero');
  }

  try {
    // Set custom user claims
    await admin.auth().setCustomUserClaims(uid, { role });
    
    // Update user document in Firestore
    await admin.firestore().collection('users').doc(uid).update({
      role: role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { message: `Rol ${role} asignado exitosamente al usuario ${uid}` };
  } catch (error) {
    console.error('Error setting user role:', error);
    throw new functions.https.HttpsError('internal', 'Error interno del servidor');
  }
});

// Function to get user role
exports.getUserRole = functions.https.onCall(async (data, context) => {
  // Check if request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado para realizar esta acción.');
  }

  const { uid } = data;
  const targetUid = uid || context.auth.uid;

  try {
    const userRecord = await admin.auth().getUser(targetUid);
    const customClaims = userRecord.customClaims || {};
    
    return { 
      uid: targetUid,
      role: customClaims.role || 'viajero',
      email: userRecord.email 
    };
  } catch (error) {
    console.error('Error getting user role:', error);
    throw new functions.https.HttpsError('internal', 'Error interno del servidor');
  }
});

// Function to initialize first admin (only runs once)
exports.initializeAdmin = functions.https.onCall(async (data, context) => {
  const { email, adminSecret } = data;

  // Simple security check (in production, use environment variables)
  if (adminSecret !== 'INIT_ADMIN_SECRET_2024') {
    throw new functions.https.HttpsError('permission-denied', 'Secreto de administrador incorrecto.');
  }

  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Set admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
    
    // Create/update user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { message: `Usuario ${email} ha sido establecido como administrador` };
  } catch (error) {
    console.error('Error initializing admin:', error);
    throw new functions.https.HttpsError('internal', 'Error interno del servidor');
  }
});

// Function to list all users with roles (admin only)
exports.listUsersWithRoles = functions.https.onCall(async (data, context) => {
  // Check if request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado para realizar esta acción.');
  }

  // Check if the caller is an admin
  if (!context.auth.token.role || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Solo los administradores pueden ver la lista de usuarios.');
  }

  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      role: user.customClaims?.role || 'viajero',
      emailVerified: user.emailVerified,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime
    }));

    return { users };
  } catch (error) {
    console.error('Error listing users:', error);
    throw new functions.https.HttpsError('internal', 'Error interno del servidor');
  }
}); 