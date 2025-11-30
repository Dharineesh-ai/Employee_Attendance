import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    checkInTime: { type: String },
    checkOutTime: { type: String },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half-day'],
      default: 'present',
    },
    totalHours: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
