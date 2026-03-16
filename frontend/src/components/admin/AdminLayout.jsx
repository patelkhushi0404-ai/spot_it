import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useNotifications from '../../hooks/useNotifications';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { to: '/admin/reports', label: 'Reports', icon: '📍' },
  { to: '/admin/workers', label: 'Workers', icon: '👷' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/rewards', label: 'Rewards', icon: '🎁' },
  { to: '/admin/queries', label: 'Queries', icon: '💬' },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markRead } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-green-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow">
          <span className="text-white font-bold text-base">S</span>
        </div>
        {(!collapsed || mobile) && (
          <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
            SpotIT
          </span>
        )}
        {mobile && (
          <button onClick={() => setShowMobile(false)} className="ml-auto text-gray-400 hover:text-gray-600 text-xl">✕</button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => mobile && setShowMobile(false)}
              title={collapsed && !mobile ? item.label : ''}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: active ? '#fff7ed' : 'transparent',
                color: active ? '#ea580c' : '#6b7280',
                fontWeight: active ? '600' : '500',
                borderLeft: active ? '3px solid #ea580c' : '3px solid transparent',
              }}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {(!collapsed || mobile) && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Notifications Section */}
      <div className="px-2 py-2 border-t border-gray-100">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all relative"
        >
          <div className="relative flex-shrink-0">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          {(!collapsed || mobile) && (
            <span className="text-sm text-gray-600 font-medium">Notifications</span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-3 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
            </div>
            <div className="max-h-56 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-xs">🔔 No notifications yet</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => markRead(n._id)}
                    className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'border-l-4 border-l-orange-400' : ''}`}
                  >
                    <p className="text-xs text-gray-700">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Info + Logout */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-green-400 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          {(!collapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        {(!collapsed || mobile) && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        )}
        {/* Collapse Button - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex w-full items-center justify-center gap-2 px-3 py-2 mt-1 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all text-xs"
        >
          <span>{collapsed ? '→' : '←'}</span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar Desktop */}
      <aside
        className="hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0"
        style={{ width: collapsed ? '72px' : '240px' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {showMobile && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setShowMobile(false)}
        >
          <aside
            className="w-64 h-full bg-white flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main Content — no top header bar */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar only */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setShowMobile(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="font-bold text-gray-800">SpotIT Admin</span>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;