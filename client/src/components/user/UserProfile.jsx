import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

function UserProfile() {
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
    <div>
      {userStatus ? (
        <div className="account-blocked-msg text-white">
          Your account is blocked. Please contact the admin.
        </div>
      ) : (
        <>
          <motion.ul 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-around list-unstyled fs-1"
          >
            <li className="nav-item">
              <Link to="articles" className="nav-link">Articles</Link>
            </li>
          </motion.ul>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-5"
          >
            <Outlet />
          </motion.div>
        </>
      )}
    </div>
  );
}

export default UserProfile;