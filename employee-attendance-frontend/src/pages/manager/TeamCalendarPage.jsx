import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const STATUS_COLORS = {
  present: 'bg-green-200',
  absent: 'bg-red-200',
  late: 'bg-yellow-200',
  'half-day': 'bg-orange-200',
};

export default function TeamCalendarPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);

  useEffect(() => {
    loadCalendar();
  }, [month, year]);

  const loadCalendar = async () => {
    // Later: call /api/attendance/summary or a calendar endpoint with month/year
    // For now, mock statuses
    const daysInMonth = new Date(year, month, 0).getDate();
    const mock = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const status = day % 6 === 0 ? 'absent' : day % 5 === 0 ? 'late' : 'present';
      return { day, status };
    });
    setDays(mock);
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">Team Calendar View</h1>
        <p className="text-gray-600">Monthly attendance overview for the team.</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="mt-1 block w-40 border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="mt-1 block w-32 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div className="text-sm text-gray-600">
          <div className="font-medium">{monthName} {year}</div>
          <div className="flex gap-3 mt-1">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-green-200 rounded" /> Present
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-red-200 rounded" /> Absent
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-200 rounded" /> Late
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-orange-200 rounded" /> Half Day
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-2">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map(({ day, status }) => (
            <div
              key={day}
              className={`h-16 rounded border flex flex-col items-center justify-center text-sm cursor-pointer ${STATUS_COLORS[status]}`}
            >
              <div className="font-semibold">{day}</div>
              <div className="text-xs capitalize">{status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
