import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Attendance from './models/Attendance.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/employee_attendance';

async function run() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Mongo connected for seeding');

    // Clear existing data (optional for local dev)
    await User.deleteMany({});
    await Attendance.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        name: 'Manoj Manager',
        email: 'manager@test.com',
        password: passwordHash,
        role: 'manager',
        employeeId: 'MGR001',
        department: 'CSE',
      },
      {
        name: 'John Doe',
        email: 'employee1@test.com',
        password: passwordHash,
        role: 'employee',
        employeeId: 'EMP001',
        department: 'Engineering',
      },
      {
        name: 'Alice',
        email: 'employee2@test.com',
        password: passwordHash,
        role: 'employee',
        employeeId: 'EMP002',
        department: 'HR',
      },
      {
        name: 'Bob',
        email: 'employee3@test.com',
        password: passwordHash,
        role: 'employee',
        employeeId: 'EMP003',
        department: 'Sales',
      },
    ]);

    const [manager, emp1, emp2, emp3] = users;

    // Simple attendance for last 3 days for dashboard/testing
    const records = [
      {
        userId: emp1._id,
        date: '2025-11-28',
        checkInTime: '09:10',
        checkOutTime: '18:05',
        status: 'present',
        totalHours: 8.9,
      },
      {
        userId: emp2._id,
        date: '2025-11-28',
        checkInTime: null,
        checkOutTime: null,
        status: 'absent',
        totalHours: 0,
      },
      {
        userId: emp3._id,
        date: '2025-11-28',
        checkInTime: '10:15',
        checkOutTime: '18:30',
        status: 'late',
        totalHours: 8.25,
      },
    ];

    await Attendance.insertMany(records);

    console.log('Seed data inserted');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

run();
