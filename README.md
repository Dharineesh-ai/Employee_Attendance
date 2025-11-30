# Employee Attendance System

A full-stack attendance tracking system with separate Employee and Manager portals.

## Tech Stack

- Frontend: React, React Router, Redux Toolkit, Vite, Tailwind CSS  
- Backend: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT)  
- Database: MongoDB (local or Atlas)

## Features

### Employee

- Register and login  
- Dashboard with:
  - Today’s status (checked in / not checked in)
  - This month summary (present / absent / late days)
  - Total hours worked this month
  - Recent attendance (last 7 days)
- Mark Attendance page:
  - Check In / Check Out
  - Calculates total hours for the day
- My Attendance History:
  - View past records in a table with month/year filters
- Profile:
  - View personal details (name, email, employee ID, department, role)

### Manager

- Login as manager  
- Manager Dashboard:
  - Total employees
  - Today’s present / absent count
  - Late arrivals today
  - Weekly attendance trend chart
  - Department-wise attendance chart
  - List of absent employees today
- All Employees Attendance:
  - View all employee records
  - Filter by employee ID, date, and status
  - Export results to CSV
- Team Calendar View:
  - Monthly calendar-style overview of team attendance
- Reports:
  - Select date range and employee/all
  - Generate table of attendance and export to CSV

## Project Structure
Employee_Attendance/

  employee-attendance-backend/ (Node.js + Express + MongoDB API)
  
  employee-attendance-frontend/ (React + Redux + Tailwind UI)


## Backend Setup

1. Go to the backend folder and install dependencies:
2. Create a `.env` file :
3. Seed sample users and attendance (optional but recommended):
4. Start the backend server: (npm run dev)



API base URL: `http://localhost:5000`

## Frontend Setup

1. Go to the frontend folder and install dependencies:

cd employee-attendance-frontend

npm install


2. Start the Vite dev server:

npm run dev


Frontend URL: `http://localhost:5173`

## Test Credentials (after seeding)

**Manager**

- Email: `manager@test.com`  
- Password: `password123`

**Employee**

- Email: `employee1@test.com`  
- Password: `password123`

You can also register new employees from the Register page.

## Environment Variables

Backend `.env` example:


## Screenshots


- Employee Dashboard
  <img width="1919" height="1021" alt="image" src="https://github.com/user-attachments/assets/2f0dc1a6-2319-47d4-a746-6965f6828b3b" />

- Mark Attendance
  <img width="1918" height="1016" alt="image" src="https://github.com/user-attachments/assets/9a53ba03-aa3b-499d-8acc-c3c0a4e8beeb" />
    
- Employee Attendance History
  <img width="1918" height="1017" alt="image" src="https://github.com/user-attachments/assets/1d60bb3e-883b-4c74-a41a-19e699d800a2" />
  
- Manager Dashboard
  <img width="1079" height="1854" alt="Screenshot 2025-11-30 102409" src="https://github.com/user-attachments/assets/251d6038-8052-47d0-b627-a4d19e6860e5" />
 
- All Employees Attendance
  <img width="1912" height="1012" alt="image" src="https://github.com/user-attachments/assets/23353b9b-9412-43a7-ba6f-9679829f227b" />
  
- Team Calendar / Reports
  <img width="1919" height="1017" alt="image" src="https://github.com/user-attachments/assets/fc21bba4-a1b0-42b6-af1e-1c697b2f9c64" />
  









