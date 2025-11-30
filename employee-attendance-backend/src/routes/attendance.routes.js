import express from 'express';
import dayjs from 'dayjs';
import Attendance from '../models/Attendance.js';
import { authMiddleware, requireManager } from '../middleware/auth.js';

const router = express.Router();

// GET /api/attendance/today
// POST /api/attendance/checkin
// POST /api/attendance/checkout
// GET /api/attendance/my-history
// GET /api/attendance/my-summary

// Employee: today's status
router.get('/today', authMiddleware, async (req, res) => {
  const today = dayjs().format('YYYY-MM-DD');
  const record = await Attendance.findOne({ userId: req.user._id, date: today });
  if (!record) return res.json({ status: 'Not Checked In' });
  res.json(record);
});

// Employee: check in
router.post('/checkin', authMiddleware, async (req, res) => {
  const now = dayjs();
  const today = now.format('YYYY-MM-DD');
  const timeStr = now.format('HH:mm');
  const isLate = now.hour() > 10 || (now.hour() === 10 && now.minute() > 15);

  let record = await Attendance.findOne({ userId: req.user._id, date: today });
  if (record?.checkInTime) {
    return res.status(400).json({ message: 'Already checked in' });
  }

  const status = isLate ? 'late' : 'present';

  record = await Attendance.findOneAndUpdate(
    { userId: req.user._id, date: today },
    { checkInTime: timeStr, status },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json(record);
});

// Employee: check out
router.post('/checkout', authMiddleware, async (req, res) => {
  const now = dayjs();
  const today = now.format('YYYY-MM-DD');
  const timeStr = now.format('HH:mm');

  let record = await Attendance.findOne({ userId: req.user._id, date: today });
  if (!record?.checkInTime) {
    return res.status(400).json({ message: 'Check in first' });
  }
  if (record.checkOutTime) {
    return res.status(400).json({ message: 'Already checked out' });
  }

  const [inH, inM] = record.checkInTime.split(':').map(Number);
  const inDate = now.hour(inH).minute(inM).second(0);
  const diffHrs = Number(((now.valueOf() - inDate.valueOf()) / (1000 * 60 * 60)).toFixed(2));

  record.checkOutTime = timeStr;
  record.totalHours = diffHrs;
  await record.save();

  res.json(record);
});

// Employee: my history
router.get('/my-history', authMiddleware, async (req, res) => {
  const { month, year, limit = 50 } = req.query;

  const filter = { userId: req.user._id };
  if (month && year) {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    filter.date = { $regex: `^${prefix}` };
  }

  const records = await Attendance.find(filter)
    .sort({ date: -1 })
    .limit(Number(limit));

  res.json(records);
});

// Employee: my summary (monthly)
router.get('/my-summary', authMiddleware, async (req, res) => {
  const now = dayjs();
  const month = req.query.month || now.month() + 1;
  const year = req.query.year || now.year();
  const prefix = `${year}-${String(month).padStart(2, '0')}`;

  const records = await Attendance.find({
    userId: req.user._id,
    date: { $regex: `^${prefix}` },
  });

  let present = 0, absent = 0, late = 0, halfDay = 0, totalHours = 0;
  records.forEach((r) => {
    if (r.status === 'present') present++;
    else if (r.status === 'absent') absent++;
    else if (r.status === 'late') late++;
    else if (r.status === 'half-day') halfDay++;
    totalHours += r.totalHours || 0;
  });

  res.json({ present, absent, late, halfDay, totalHours });
});

// Manager: all employees attendance with filters
router.get('/all', authMiddleware, requireManager, async (req, res) => {
  try {
    const { employeeId, status, date } = req.query;

    const query = {};
    if (status) query.status = status;
    if (date) query.date = date; // expected 'YYYY-MM-DD'

    // If employeeId is provided, join with User
    if (employeeId) {
      query.employeeId = employeeId; // stored in virtual below
    }

    const records = await Attendance.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $addFields: {
          employeeId: '$user.employeeId',
          name: '$user.name',
          department: '$user.department',
        },
      },
      {
        $match: {
          ...(status && { status }),
          ...(date && { date }),
          ...(employeeId && { employeeId }),
        },
      },
      { $sort: { date: -1 } },
    ]);

    res.json(records);
  } catch (err) {
    console.error('Manager all attendance error', err);
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
});

// Manager: today's attendance status (who's present/absent)
router.get('/today-status', authMiddleware, requireManager, async (req, res) => {
  try {
    const today = dayjs().format('YYYY-MM-DD');

    const todayRecords = await Attendance.aggregate([
      { $match: { date: today } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          employeeId: '$user.employeeId',
          name: '$user.name',
          department: '$user.department',
          status: '$status',
        },
      },
    ]);

    const present = todayRecords.filter((r) => r.status === 'present' || r.status === 'late');
    const absentExplicit = todayRecords.filter((r) => r.status === 'absent');

    // To get absentees with no record today, fetch all employees and diff:
    const allEmployees = await Attendance.db.collection('users')
      .find({ role: 'employee' })
      .project({ employeeId: 1, name: 1, department: 1 })
      .toArray();

    const presentIds = new Set(present.map((p) => p.employeeId));
    const absent = [
      ...absentExplicit,
      ...allEmployees
        .filter((u) => !presentIds.has(u.employeeId))
        .map((u) => ({
          employeeId: u.employeeId,
          name: u.name,
          department: u.department,
          status: 'absent',
        })),
    ];

    res.json({
      presentCount: present.length,
      absentCount: absent.length,
      present,
      absent,
    });
  } catch (err) {
    console.error('today-status error', err);
    res.status(500).json({ message: 'Failed to fetch today status' });
  }
});


// Manager: team summary for charts
router.get('/summary', authMiddleware, requireManager, async (req, res) => {
  try {
    const today = dayjs();
    const startOfWeek = today.startOf('week'); // Sunday
    const endOfWeek = today.endOf('week');
    const weekStartStr = startOfWeek.format('YYYY-MM-DD');
    const weekEndStr = endOfWeek.format('YYYY-MM-DD');

    // Weekly trend: count present per day
    const weekly = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: weekStartStr, $lte: weekEndStr },
        },
      },
      {
        $group: {
          _id: '$date',
          present: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ['$status', 'present'] }, { $eq: ['$status', 'late'] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Department-wise attendance (today)
    const dept = await Attendance.aggregate([
      { $match: { date: today.format('YYYY-MM-DD') } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user.department',
          value: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ['$status', 'present'] }, { $eq: ['$status', 'late'] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1,
        },
      },
    ]);

    res.json({ weekly, department: dept });
  } catch (err) {
    console.error('summary error', err);
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
});



export default router;
