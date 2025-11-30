import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

export default function EmployeeLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Employee Portal</h2>
        </div>

        <nav className="mt-4 flex-1">
          <NavLink to="/employee/dashboard" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">
            Dashboard
          </NavLink>
          <NavLink to="/employee/attendance" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">
            Mark Attendance
          </NavLink>
          <NavLink to="/employee/history" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">
            My History
          </NavLink>
          <NavLink to="/employee/profile" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">
            Profile
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 mt-auto rounded-md bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
