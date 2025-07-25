const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let serviceAccount;

// Option 1: Load from JSON file (recommended)
if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  serviceAccount = require(serviceAccountPath);
} 
// Option 2: Load from base64 encoded environment variable
else if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
  serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString()
  );
} 
// Option 3: Fallback to direct JSON parse (not recommended)
else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', error);
    process.exit(1);
  }
} else {
  console.error('No Firebase service account configuration found');
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const auth = admin.auth();
  const db = admin.firestore(); // Optional: if you need Firestore

  module.exports = { 
    admin, 
    auth,
    db // Optional
  };
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}