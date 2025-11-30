import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function MarkAttendancePage() {
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
  try {
    setLoading(true);
    setError('');
    const res = await axiosClient.get('/api/attendance/today');
    setTodayRecord(res.data);
  } catch (err) {
    setError('Failed to load today attendance');
  } finally {
    setLoading(false);
  }
};


  const handleCheckIn = async () => {
  try {
    setActionLoading(true);
    setError('');
    await axiosClient.post('/api/attendance/checkin');
    await fetchToday();
  } catch (err) {
    setError(err.response?.data?.message || 'Check-in failed');
  } finally {
    setActionLoading(false);
  }
};


  const handleCheckOut = async () => {
  try {
    setActionLoading(true);
    setError('');
    await axiosClient.post('/api/attendance/checkout');
    await fetchToday();
  } catch (err) {
    setError(err.response?.data?.message || 'Check-out failed');
  } finally {
    setActionLoading(false);
  }
};


  if (loading) {
    return <div className="text-center py-12">Loading today&apos;s attendance...</div>;
  }

  const canCheckIn = !todayRecord.checkInTime;
  const canCheckOut = !!todayRecord.checkInTime && !todayRecord.checkOutTime;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-600">Date: {todayRecord.date}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Status</div>
            <div className="text-xl font-semibold">
              {todayRecord.status || 'Not Checked In'}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Check In</div>
            <div className="text-lg">{todayRecord.checkInTime || '-'}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Check Out</div>
            <div className="text-lg">{todayRecord.checkOutTime || '-'}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Total Hours</div>
            <div className="text-lg">{todayRecord.totalHours || '-'}</div>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleCheckIn}
            disabled={!canCheckIn || actionLoading}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-white 
              ${canCheckIn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {actionLoading && canCheckIn ? 'Checking in...' : 'Check In'}
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!canCheckOut || actionLoading}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-white 
              ${canCheckOut ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {actionLoading && canCheckOut ? 'Checking out...' : 'Check Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
