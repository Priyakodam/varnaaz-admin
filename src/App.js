
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserTable from './Users/users';
import Login from "./Login/Login";
import AdminDashboard from './Dashboard/AdminDashboard';
import LeaveType from './Leave/LeaveType';
import EmployeeLeaves from './Leave/EmployeeLeaves';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UserTable />} />
        <Route path="/" element={<Login />} />
       
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/leavetype" element={<LeaveType />} />

<Route path="/employeeleaves" element={<EmployeeLeaves />} />
      </Routes>
    </Router>
  );
};

export default App;
