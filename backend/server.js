require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/db');

connectDB();

const app = express();

// Gzip compress all responses — reduces payload size by 60-80%
app.use(compression());

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/foods', require('./routes/food'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/riders',   require('./routes/riders'));

app.get('/', (req, res) => res.json({ message: 'MDB RESTROCAFE API Running 🍜' }));

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
