import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

const STATUS_COLORS = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-yellow-100 text-yellow-800',
  'half-day': 'bg-orange-100 text-orange-800',
};

export default function AttendanceHistoryPage() {
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchHistory();
  }, [month, year]);

  const fetchHistory = async () => {
  try {
    setLoading(true);
    setError('');
    const res = await axiosClient.get('/api/attendance/my-history', {
      params: { month, year },
    });
    setRecords(
      res.data.map((r) => ({
        date: r.date,
        status: r.status,
        checkIn: r.checkInTime,
        checkOut: r.checkOutTime,
        hours: r.totalHours,
      }))
    );
    setPage(1);
  } catch (err) {
    setError('Failed to load attendance history');
  } finally {
    setLoading(false);
  }
};


  const filtered = records; // month/year filter already applied in fetch when backend exists
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">My Attendance History</h1>
        <p className="text-gray-600">View your past attendance records by month.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Month</label>
          <select
            value={month}
            onChange={handleMonthChange}
            className="mt-1 block w-40 border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            value={year}
            onChange={handleYearChange}
            placeholder="2025"
            className="mt-1 block w-32 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageData.map((rec, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rec.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        STATUS_COLORS[rec.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rec.checkIn || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rec.checkOut || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rec.hours || '-'}
                  </td>
                </tr>
              ))}
              {!loading && pageData.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No records found for selected month/year.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
