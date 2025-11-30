import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import EmployeeLayout from '../components/layout/EmployeeLayout';
import EmployeeDashboardPage from '../pages/employee/EmployeeDashboardPage';
import MarkAttendancePage from '../pages/employee/MarkAttendancePage';
import AttendanceHistoryPage from '../pages/employee/AttendanceHistoryPage';
import EmployeeProfilePage from '../pages/employee/EmployeeProfilePage';

export default function EmployeeRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
        <Route element={<EmployeeLayout />}>
          <Route path="dashboard" element={<EmployeeDashboardPage />} />
          <Route path="attendance" element={<MarkAttendancePage />} />
          <Route path="history" element={<AttendanceHistoryPage />} />
          <Route path="profile" element={<EmployeeProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
