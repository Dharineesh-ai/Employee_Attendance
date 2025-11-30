import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function AllAttendancePage() {
  const [records, setRecords] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      // Real call when backend ready:
      // const res = await axiosClient.get('/api/attendance/all', {
      //   params: { employeeId, status, date }
      // });
      // setRecords(res.data);

      // Mock data for now
      const mock = [
        { employeeId: 'EMP001', name: 'John Doe', department: 'Engineering', date: '2025-11-29', status: 'present', checkIn: '09:10', checkOut: '18:05', hours: 8.9 },
        { employeeId: 'EMP002', name: 'Alice', department: 'HR', date: '2025-11-29', status: 'absent', checkIn: null, checkOut: null, hours: 0 },
        { employeeId: 'EMP003', name: 'Bob', department: 'Sales', date: '2025-11-29', status: 'late', checkIn: '10:15', checkOut: '18:30', hours: 8.25 },
      ];
      setRecords(mock);
    } catch (err) {
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAttendance();
  };

  const handleExportCsv = () => {
    // Real call:
    // window.open('/api/attendance/export?...', '_blank');

    const headers = ['Employee ID', 'Name', 'Department', 'Date', 'Status', 'Check In', 'Check Out', 'Hours'];
    const rows = records.map(r => [
      r.employeeId,
      r.name,
      r.department,
      r.date,
      r.status,
      r.checkIn || '',
      r.checkOut || '',
      r.hours ?? ''
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">All Employees Attendance</h1>
        <p className="text-gray-600">Filter and export attendance records for your team.</p>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleFilter}
        className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee ID
          </label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="EMP001"
            className="mt-1 block w-40 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-44 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-40 border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half-day">Half Day</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-900"
        >
          Export CSV
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Attendance Records</h2>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>

        {error && (
          <div className="px-6 py-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {r.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.checkIn || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.checkOut || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.hours ?? '-'}
                  </td>
                </tr>
              ))}
              {!loading && records.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No records found.
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
