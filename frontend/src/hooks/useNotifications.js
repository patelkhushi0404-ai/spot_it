import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data } = await API.get('/profile/notifications');
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter(n => !n.read).length);
    } catch (error) {}
  };

  const markRead = async (id) => {
    if (!user) return;
    try {
      await API.put(`/profile/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {}
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  return { notifications, unreadCount, fetchNotifications, markRead };
};

export default useNotifications;