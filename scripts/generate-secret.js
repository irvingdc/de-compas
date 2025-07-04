#!/usr/bin/env node

const crypto = require('crypto');

function generateSecureSecret() {
  // Generate 256 bits (32 bytes) of cryptographically secure random data
  const secret = crypto.randomBytes(32).toString('hex');
  
  console.log('🔐 Secreto Seguro Generado:');
  console.log('');
  console.log(`INIT_ADMIN_SECRET=${secret}`);
  console.log('');
  console.log('📋 Instrucciones:');
  console.log('1. Copia esta línea a functions/.env');
  console.log('2. Redespliega las Functions: npm run functions:deploy');
  console.log('3. Usa el secreto en el comando init-admin');
  console.log('');
  console.log('🔒 Características:');
  console.log('- 256 bits de entropía');
  console.log('- Criptográficamente seguro');
  console.log('- Único e irrepetible');
  console.log('- Resistente a ataques de fuerza bruta');
}

generateSecureSecret(); 