import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import eventsRouter from './routes/eventsRouter';
import languagesRouter from './routes/languagesRouter';
import authRouter from './routes/authRouter';
import adminRouter from './routes/adminRouter';
import speciesRouter from './routes/speciesRouter';
import usersRouter from './routes/usersRouter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'https://agricalendar.net',
      'https://agricalendar.net/admin',
      process.env.FRONTEND_URL || 'http://localhost:3000',
      process.env.ADMIN_URL || 'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ];

    // En producción, permitir requests sin origin (proxies reversos)
    if (!origin && process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }

    // En desarrollo, permitir requests sin origin (Postman, etc.)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins:`, allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/languages', languagesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/species', speciesRouter);
app.use('/api/users', usersRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(' AgriCalendar Backend running on port ' + PORT);
  console.log(' Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log(' Health check: http://localhost:' + PORT + '/api/health');
});
