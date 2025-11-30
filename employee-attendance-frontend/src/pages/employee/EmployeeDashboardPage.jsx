import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosClient from '../../api/axiosClient';

export default function EmployeeDashboardPage() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [todayStatus, setTodayStatus] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState({
    present: 0, absent: 0, late: 0, totalHours: 0
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayAction, setTodayAction] = useState('checkin'); // checkin or checkout

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    setLoading(true);
    const [todayRes, summaryRes, recentRes] = await Promise.all([
      axiosClient.get('/api/attendance/today'),
      axiosClient.get('/api/attendance/my-summary'),
      axiosClient.get('/api/attendance/my-history', { params: { limit: 7 } }),
    ]);

    setTodayStatus(todayRes.data);
    setMonthlyStats(summaryRes.data);
    setRecentAttendance(
      recentRes.data.map((r) => ({
        date: r.date,
        status: r.status,
        checkIn: r.checkInTime,
        checkOut: r.checkOutTime,
        hours: r.totalHours,
      }))
    );
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleTodayAction = async () => {
    try {
      const endpoint = todayAction === 'checkin' ? '/api/attendance/checkin' : '/api/attendance/checkout';
      await axiosClient.post(endpoint);
      fetchDashboardData(); // Refresh
    } catch (err) {
      console.log('Backend call failed - mock action');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">ID: {user?.employeeId} | {user?.department}</p>
      </div>

      {/* Today's Status + Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Status</h3>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {todayStatus?.status || 'Not Checked In'}
          </div>
          {todayStatus?.checkInTime && (
            <p className="text-sm text-gray-500">Checked in: {todayStatus.checkInTime}</p>
          )}
          <button
            onClick={handleTodayAction}
            className={`mt-4 w-full py-2 px-4 rounded-md font-medium text-white ${
              todayAction === 'checkin'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {todayAction === 'checkin' ? '🟢 Check In Now' : '🔵 Check Out'}
          </button>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{monthlyStats.present}</div>
              <div className="text-sm text-green-700">Present</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-800">{monthlyStats.absent}</div>
              <div className="text-sm text-red-700">Absent</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{monthlyStats.late} Late</div>
            <div className="text-2xl font-bold text-indigo-600">{monthlyStats.totalHours}h Total</div>
          </div>
        </div>
      </div>

      {/* Recent Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Attendance (7 days)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAttendance.map((record, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
