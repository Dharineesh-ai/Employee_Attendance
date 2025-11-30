import { Outlet, NavLink } from 'react-router-dom';

export default function ManagerLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Manager Portal</h2>
        </div>
        <nav className="mt-6">
          <NavLink to="/manager/dashboard" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">Dashboard</NavLink>
          <NavLink to="/manager/attendance" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">All Attendance</NavLink>
          <NavLink to="/manager/calendar" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">Team Calendar</NavLink>
          <NavLink to="/manager/reports" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">Reports</NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
