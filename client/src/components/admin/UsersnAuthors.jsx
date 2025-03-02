import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import './AdminProfile.css';

const UsersnAuthors = () => {
  const [users, setUsers] = useState([]);
  const { getToken } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getToken();
      
        const response = await axios.get(`${BACKEND_URL}/admin-api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.payload);
      } catch (error) {
        console.error("Full error:", error);
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, [getToken]);

  const toggleBlockStatus = async (id, blocked) => {
    try {
      const token = await getToken();
      const response = await axios.put(
        `${BACKEND_URL}/admin-api/admin/block-unblock/${id}`,
        { blocked: !blocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, blocked: response.data.payload.blocked } : user
        )
      );
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      toast.error("Failed to update user status");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admin-profile"
    >
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td>
                  <div className="text-white">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </td>
                <td>
                  <span className="status-badge status-active">
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.blocked ? 'status-blocked' : 'status-active'}`}>
                    {user.blocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleBlockStatus(user._id, user.blocked)}
                    className={user.blocked ? "read-more-2" : "read-more"}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersnAuthors;