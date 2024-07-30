
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserTable from './Users/users';
import Login from "./Login/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UserTable />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
