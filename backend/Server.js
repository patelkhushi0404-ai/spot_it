const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});


const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { background-color: #16a34a }',
  customSiteTitle: 'SpotIT API Docs',
}));



app.use('/api', limiter);
app.use('/api/auth', authLimiter);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));
app.use('/api/queries', require('./routes/queryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/workers', require('./routes/workerRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SpotIT API is running 🌱' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

