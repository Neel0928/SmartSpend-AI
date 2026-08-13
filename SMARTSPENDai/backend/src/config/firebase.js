const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin SDK
const initFirebase = () => {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // If passing the JSON string in an env variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized using ENV variable.');
    } else {
      console.warn('Firebase Admin SDK not initialized: Missing FIREBASE_SERVICE_ACCOUNT in .env');
    }
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
};

const admin = {
  auth: getAuth
};

module.exports = { admin, initFirebase };
