import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import './AdminProfile.css';

function AdminProfile() {
  return (
    <div className="admin-profile">
     

      <nav className="admin-nav">
        <NavLink 
          to="usersnauthors" 
          className={({ isActive }) => 
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Users & Authors
        </NavLink>
      </nav>

      <div className="users-authors-section">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminProfile;