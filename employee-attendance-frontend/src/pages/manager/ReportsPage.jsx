import { useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      setError('');
      // Real call when backend ready:
      // const res = await axiosClient.get('/api/attendance/all', {
      //   params: { fromDate, toDate, employeeId }
      // });
      // setRecords(res.data);

      // Mock data now
      const mock = [
        { employeeId: 'EMP001', name: 'John Doe', date: '2025-11-20', status: 'present', hours: 8.5 },
        { employeeId: 'EMP002', name: 'Alice', date: '2025-11-20', status: 'absent', hours: 0 },
      ];
      setRecords(mock);
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['Employee ID', 'Name', 'Date', 'Status', 'Hours'];
    const rows = records.map((r) => [
      r.employeeId,
      r.name,
      r.date,
      r.status,
      r.hours ?? '',
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance-report-range.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">
          Generate attendance reports by date range and employee, and export as CSV.
        </p>
      </div>

      {/* Filters form */}
      <form
        onSubmit={handleGenerate}
        className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="mt-1 block w-44 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="mt-1 block w-44 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee ID (optional)</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="EMP001 or empty for all"
            className="mt-1 block w-56 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          Generate
        </button>
        <button
          type="button"
          disabled={!records.length}
          onClick={handleExport}
          className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
        >
          Export CSV
        </button>
      </form>

      {/* Results table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Report Results</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                    {r.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.hours ?? '-'}
                  </td>
                </tr>
              ))}
              {!loading && records.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No data yet. Choose a range and click Generate.
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
