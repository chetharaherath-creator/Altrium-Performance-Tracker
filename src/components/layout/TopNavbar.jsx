import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AltriumLogo from '../ui/AltriumLogo';
import api from '../../api';

export default function TopNavbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Set up polling every 10 seconds for real-time feel
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await api.put(`/notifications/${notification.id}/read`);
        fetchNotifications();
      }
      
      // Determine where to navigate based on role or message
      if (currentUser?.role === 'employee') {
        navigate('/my-tasks');
      } else if (currentUser?.role === 'team_manager' || currentUser?.role === 'department_manager') {
        if (notification.message.includes('assigned')) {
          navigate('/my-tasks');
        } else {
          navigate('/reports');
        }
      }
      
      setShowDropdown(false);
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="h-16 flex items-center justify-between px-6 z-50">
      {/* Logo Area */}
      <div className="flex items-center space-x-2">
        <AltriumLogo className="w-8 h-8" />
        <span className="text-2xl font-bold text-black tracking-tight">altrium</span>
        <span className="text-gray-400 text-sm ml-2 font-medium">Performance Tracker</span>
      </div>

      {/* Right side Profile & Notifications */}
      <div className="flex items-center space-x-6">
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="cursor-pointer relative p-1"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
                {unreadCount}
              </span>
            )}
          </div>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50 max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-700">Notifications</div>
              {notifications.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex items-start">
                      {!notification.is_read && (
                        <div className="mt-1.5 mr-2 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                      )}
                      <div>
                        <p className={`text-sm ${!notification.is_read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-3 border border-gray-200 rounded-full py-1 px-3 bg-white shadow-sm cursor-pointer hover:shadow-md transition"
        >
          <span className="text-sm font-medium text-gray-700">{currentUser?.name || 'User'}</span>
          {currentUser?.profile_picture ? (
            <img 
              src={`http://localhost:5001${currentUser.profile_picture}`} 
              alt={currentUser.name} 
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#E7F0F8] text-[#1A2F45] flex items-center justify-center text-xs font-bold">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>

        <button 
          onClick={logout}
          className="text-sm font-medium text-red-500 hover:text-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
