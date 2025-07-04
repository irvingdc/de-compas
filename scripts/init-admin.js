#!/usr/bin/env node

require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFunctions, httpsCallable } = require('firebase/functions');

// Firebase configuration (using environment variables)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Verify configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Variables de entorno de Firebase no configuradas');
  console.error('💡 Asegúrate de que el archivo .env esté presente y configurado');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

async function initializeAdmin() {
  const email = process.argv[2];
  const adminSecret = process.argv[3];

  if (!email || !adminSecret) {
    console.error('❌ Uso: node init-admin.js <email> <admin-secret>');
    console.error('   Ejemplo: node init-admin.js admin@decompas.com INIT_ADMIN_SECRET_2024');
    process.exit(1);
  }

  try {
    console.log('🔄 Inicializando administrador...');
    
    // Call the Firebase Function
    const initializeAdminFn = httpsCallable(functions, 'initializeAdmin');
    const result = await initializeAdminFn({ email, adminSecret });
    
    console.log('✅ Éxito:', result.data.message);
    console.log('🎉 El usuario ahora puede acceder al panel administrativo');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'functions/permission-denied') {
      console.error('💡 Verifica que el secreto de administrador sea correcto');
    }
    process.exit(1);
  }
}

initializeAdmin(); 