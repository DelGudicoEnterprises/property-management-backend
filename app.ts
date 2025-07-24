import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import ticketRoutes from './routes/tickets';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// CORS configuration to allow CodeSandbox and development origins
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://codesandbox.io',
    /.*\.csb\.app$/,
    /.*\.codesandbox\.io$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

// rate limiter (100 req / 15min per IP)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// healthcheck
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// error handler
app.use(errorHandler);

export default app;
