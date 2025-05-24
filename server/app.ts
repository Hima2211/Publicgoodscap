import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import { verifyWeb3Auth } from './middleware/auth';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', verifyWeb3Auth, userRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

export default app;
