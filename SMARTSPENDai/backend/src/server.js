const app = require('./app');
const connectDB = require('./config/db');
const { initFirebase } = require('./config/firebase');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Initialize Firebase
initFirebase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
