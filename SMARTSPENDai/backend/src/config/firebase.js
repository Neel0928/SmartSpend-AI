const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You have two options to authenticate:
// 1. Using a service account key JSON file (Recommended for production)
// 2. Using environment variables (Useful for platforms like Vercel/Heroku)

const initFirebase = () => {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // If passing the JSON string in an env variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized using ENV variable.');
    } else {
      console.warn('Firebase Admin SDK not initialized: Missing FIREBASE_SERVICE_ACCOUNT in .env');
    }
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
};

module.exports = { admin, initFirebase };
