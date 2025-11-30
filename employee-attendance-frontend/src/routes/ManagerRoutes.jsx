import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import ManagerLayout from '../components/layout/ManagerLayout';
import ManagerDashboardPage from '../pages/manager/ManagerDashboardPage';
import AllAttendancePage from '../pages/manager/AllAttendancePage';
import TeamCalendarPage from '../pages/manager/TeamCalendarPage';
import ReportsPage from '../pages/manager/ReportsPage';

export default function ManagerRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
        <Route element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboardPage />} />
          <Route path="attendance" element={<AllAttendancePage />} />
          <Route path="calendar" element={<TeamCalendarPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
