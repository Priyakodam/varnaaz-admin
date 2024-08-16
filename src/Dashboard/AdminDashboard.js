import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaSignOutAlt,
  FaUserPlus,
  FaCar 
} from "react-icons/fa"; 
import { IoHomeOutline } from "react-icons/io5";
import "./AdminDashboard.css";
import Logout from "./LogOut";
import logo from "../Img/Company_logo.png";

const AdminDashboard = ({ onToggleSidebar }) => {
    const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    onToggleSidebar(!collapsed); 
  };

  const handleNavItemClick = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  return (
    <>
      <div className="header">
        <div className="header-left">
       
          <div
            className={`sidebar-toggle ${collapsed ? 'collapsed' : ''}`}
            onClick={toggleSidebar}
          >
            <IoHomeOutline className="toggle-icon" />
          </div> &nbsp;&nbsp;
          <img src={logo} alt="Logo" className="company-logo" />
        </div>
        <div className="header-right">
          <div className="logout-button">
            <Logout />
          </div>
        </div>
      </div>

      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="position-sticky">
          <ul className="nav flex-column">
           
 <h2 className="text-center">Admin</h2>
            <li className={`nav-item ${location.pathname === '/users' ? 'active' : ''}`}>
              <Link className="nav-link" to="/users" onClick={handleNavItemClick}>
                <FaUsers className="nav-icon" />
                {!collapsed && <span className="link_text">Users</span>}
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/attendance' ? 'active' : ''}`}>
              <Link className="nav-link" to="/attendance" onClick={handleNavItemClick}>
                <FaUserPlus className="nav-icon" />
                {!collapsed && <span className="link_text">Attendance</span>}
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/leavetype' ? 'active' : ''}`}>
              <Link className="nav-link" to="/leavetype" onClick={handleNavItemClick}>
                <FaUserPlus className="nav-icon" />
                {!collapsed && <span className="link_text">Leave Type</span>}
              </Link>
            </li>

            <li className={`nav-item ${location.pathname === '/employeeleaves' ? 'active' : ''}`}>
              <Link className="nav-link" to="/employeeleaves" onClick={handleNavItemClick}>
                <FaUserPlus className="nav-icon" />
                {!collapsed && <span className="link_text">Leaves</span>}
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/vehiclereport' ? 'active' : ''}`}>
              <Link className="nav-link" to="/vehiclereport" onClick={handleNavItemClick}>
                <FaCar className="nav-icon" />
                {!collapsed && <span className="link_text">Vehicle Report</span>}
              </Link>
            </li>

            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <Link className="nav-link" to="/" onClick={handleNavItemClick}>
                <FaSignOutAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Logout</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
