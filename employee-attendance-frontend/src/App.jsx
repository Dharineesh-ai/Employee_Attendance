import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage'; // Create next
import EmployeeRoutes from './routes/EmployeeRoutes';
import ManagerRoutes from './routes/ManagerRoutes';
import ProfilePage from './pages/employee/ProfilePage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/employee/*" element={<EmployeeRoutes />} />
      <Route path="/employee/profile" element={<ProfilePage />} />

      <Route path="/manager/*" element={<ManagerRoutes />} />
    </Routes>
  );
}

export default App;
