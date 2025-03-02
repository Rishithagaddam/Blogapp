import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, PlusCircle } from 'lucide-react';
import './AuthorProfile.css';
import { useState, useEffect } from 'react';
function AuthorProfile() {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if (currentUser) {
      setUserStatus(currentUser.blocked);
    }
  }, []);

  if (userStatus === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }
  return (
    <div className="author-profile">
      {userStatus ? (
        <div className="account-blocked-msg">
          Your account is blocked. Please contact the admin!
        </div>
      ) : (
        <>
          <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="author-nav"
      >
        <div className="author-nav-links">
          <NavLink
            to="articles"
            className={({ isActive }) =>
              `author-nav-link ${isActive ? 'author-nav-link-active' : ''}`
            }
          >
            <FileText className="nav-icon" />
            My Articles
          </NavLink>
          
          <NavLink
            to="article"
            className={({ isActive }) =>
              `author-nav-link ${isActive ? 'author-nav-link-active' : ''}`
            }
          >
            <PlusCircle className="nav-icon" />
            New Article
          </NavLink>
        </div>
      </motion.nav>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="author-content"
      >
        <Outlet />
      </motion.div>
        </>
      )}
    </div>
  );
}

export default AuthorProfile;