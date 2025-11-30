import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import employeeReducer from '../features/attendance/employeeSlice';
import managerReducer from '../features/attendance/managerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    manager: managerReducer,
  },
});

export default store;
