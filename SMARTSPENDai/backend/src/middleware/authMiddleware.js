const { admin } = require('../config/firebase');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // If Firebase Admin is fully configured, verify the token
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
      } else {
        // MOCK AUTH for local development without Service Account
        // In production, you MUST use the block above
        console.warn('Firebase Admin not configured. Using Mock Auth for request.');
        
        // We simulate a verified token by decoding the JWT locally (just reading the payload)
        // Note: This is NOT secure and does not verify the signature. Only for dev.
        try {
           const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
           req.user = {
             uid: payload.user_id || 'test-user-id',
             email: payload.email || 'test@example.com'
           };
        } catch(e) {
           req.user = { uid: 'mock-user-id' };
        }
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
