import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../../api/axiosClient';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4F46E5', '#22C55E', '#F97316', '#EF4444'];

export default function ManagerDashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    todayPresent: 0,
    todayAbsent: 0,
    lateToday: 0,
  });
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [deptAttendance, setDeptAttendance] = useState([]);
  const [absentToday, setAbsentToday] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // When backend is ready, call real APIs:
      // const [dashRes, todayStatusRes, summaryRes] = await Promise.all([
      //   axiosClient.get('/api/dashboard/manager'),
      //   axiosClient.get('/api/attendance/today-status'),
      //   axiosClient.get('/api/attendance/summary'),
      // ]);

      // Mock data for now (matches assignment requirements)
      setStats({
        totalEmployees: 25,
        todayPresent: 20,
        todayAbsent: 5,
        lateToday: 3,
      });

      setWeeklyTrend([
        { day: 'Mon', present: 20 },
        { day: 'Tue', present: 22 },
        { day: 'Wed', present: 21 },
        { day: 'Thu', present: 23 },
        { day: 'Fri', present: 19 },
      ]);

      setDeptAttendance([
        { name: 'Engineering', value: 10 },
        { name: 'Sales', value: 5 },
        { name: 'HR', value: 4 },
        { name: 'Support', value: 6 },
      ]);

      setAbsentToday([
        { id: 'EMP010', name: 'Alice', department: 'HR', status: 'absent' },
        { id: 'EMP014', name: 'Bob', department: 'Sales', status: 'absent' },
        { id: 'EMP019', name: 'Charlie', department: 'Support', status: 'absent' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading manager dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name} ({user?.department})</p>
      </div>

      {/* Top stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={stats.totalEmployees} />
        <StatCard label="Present Today" value={stats.todayPresent} color="text-green-600" />
        <StatCard label="Absent Today" value={stats.todayAbsent} color="text-red-600" />
        <StatCard label="Late Arrivals Today" value={stats.lateToday} color="text-yellow-600" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly attendance trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department-wise attendance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department-wise Attendance
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={deptAttendance}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {deptAttendance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Absent employees today */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Absent Employees Today
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {absentToday.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {emp.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {emp.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {emp.department}
                  </td>
                </tr>
              ))}
              {absentToday.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    No absentees today
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'text-gray-900' }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
