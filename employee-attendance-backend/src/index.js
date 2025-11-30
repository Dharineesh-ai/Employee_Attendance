import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
//import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
//app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/employee_attendance';

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection error', err);
    process.exit(1);
  });
