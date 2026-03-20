import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  useEffect(() => {
    fetchNotifications();
    fetchMyReports();
  }, []);

  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
  }, [activeTab]);

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const { data } = await API.get('/profile/notifications');
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setNotifLoading(false);
    }
  };

  const fetchMyReports = async () => {
    setReportsLoading(true);
    try {
      const { data } = await API.get('/reports/my');
      setReports(data.reports);
    } catch (error) {
      console.error('Failed to fetch reports');
    } finally {
      setReportsLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const { data } = await API.get('/profile/stats');
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/profile', form);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/profile/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const statusConfig = {
    pending: { label: 'Pending', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)' },
    assigned: { label: 'Assigned', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.3)' },
    inprogress: { label: 'In Progress', color: '#fb923c', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)' },
    cleared: { label: 'Cleared', color: '#4ade80', bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.3)' },
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'stats', label: 'My Stats', icon: '📊' },
    { id: 'reports', label: 'My Reports', icon: '📍' },
    { id: 'notifications', label: `Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}`, icon: '🔔' },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d1f3c 50%, #0f172a 100%)' }}
    >
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header Card */}
        <div
          className="rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center md:items-start gap-5"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(59,130,246,0.15) 100%)',
            border: '1px solid rgba(100,116,139,0.3)',
          }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #fb923c, #4ade80, #60a5fa)' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                style={{
                  background: user?.role === 'admin' ? 'rgba(96,165,250,0.2)' : 'rgba(249,115,22,0.2)',
                  border: user?.role === 'admin' ? '1px solid rgba(96,165,250,0.4)' : '1px solid rgba(249,115,22,0.4)',
                  color: user?.role === 'admin' ? '#60a5fa' : '#fb923c',
                }}
              >
                {user?.role === 'admin' ? '🛡️ Admin' : '👤 User'}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.4)', color: '#4ade80' }}
              >
                ⭐ {user?.totalPoints || 0} Points
              </span>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-orange-400">{reports.length}</p>
              <p className="text-slate-400 text-xs">Reports</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-green-400">{reports.filter(r => r.status === 'cleared').length}</p>
              <p className="text-slate-400 text-xs">Cleared</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-400">{user?.totalPoints || 0}</p>
              <p className="text-slate-400 text-xs">Points</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.3)' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap"
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #fb923c, #ea580c)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#94a3b8',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Profile */}
        {activeTab === 'profile' && (
          <div className="rounded-2xl p-6" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(100,116,139,0.3)' }}>
            <h2 className="text-lg font-bold text-white mb-6">Edit Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.4)' }} />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.4)' }} />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Phone Number</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number"
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.4)' }} />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Address</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Enter address"
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.4)' }} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="px-8 py-3 rounded-xl font-bold text-white transition-all duration-200"
                style={{ background: loading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #fb923c, #ea580c)', boxShadow: loading ? 'none' : '0 10px 30px rgba(249,115,22,0.3)' }}>
                {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Saving...</span> : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Tab: Stats */}
        {activeTab === 'stats' && (
          <div>
            {statsLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            ) : !stats ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.3)' }}>
                <div className="text-5xl mb-4">📊</div>
                <p className="text-white font-semibold">No stats available yet</p>
              </div>
            ) : (
              <div className="space-y-6">

               

                {/* Monthly Reports Bar Chart */}
                <div className="rounded-2xl p-6" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(100,116,139,0.3)' }}>
                  <h3 className="text-white font-bold mb-1">Reports Last 6 Months</h3>
                  <p className="text-slate-400 text-xs mb-4">Monthly report submissions</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                      <Bar dataKey="count" name="Reports" fill="#fb923c" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Points Earned Bar Chart */}
                <div className="rounded-2xl p-6" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(100,116,139,0.3)' }}>
                  <h3 className="text-white font-bold mb-1">Points Earned Last 6 Months</h3>
                  <p className="text-slate-400 text-xs mb-4">Points from cleared reports</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.pointsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                      <Bar dataKey="points" name="Points" fill="#4ade80" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Pie Chart */}
                <div className="rounded-2xl p-6" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(100,116,139,0.3)' }}>
                  <h3 className="text-white font-bold mb-1">Report Status Breakdown</h3>
                  <p className="text-slate-400 text-xs mb-4">Current status of all your reports</p>
                  {stats.statusBreakdown.every(s => s.value === 0) ? (
                    <div className="text-center py-8 text-slate-400">No reports yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={stats.statusBreakdown.filter(s => s.value > 0)} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                          {stats.statusBreakdown.filter(s => s.value > 0).map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: My Reports */}
        {activeTab === 'reports' && (
          <div>
            {reportsLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.3)' }}>
                <div className="text-5xl mb-4">📍</div>
                <p className="text-white font-semibold text-lg mb-2">No reports yet</p>
                <p className="text-slate-400 text-sm">Start spotting waste and submit your first report!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => {
                  const status = statusConfig[report.status] || statusConfig.pending;
                  return (
                    <div key={report._id} className="rounded-2xl overflow-hidden transition-all duration-300"
                      style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(100,116,139,0.3)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.border = '1px solid rgba(249,115,22,0.4)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid rgba(100,116,139,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <div className="h-36 overflow-hidden relative">
                        <img src={report.image?.url} alt="report" className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'rgba(30,41,59,0.8)'; e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:2.5rem">📸</div>'; }} />
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold"
                          style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color }}>
                          {status.label}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <p className="text-orange-400 text-xs truncate">{report.location?.address || 'Unknown'}</p>
                        </div>
                        <p className="text-slate-300 text-sm line-clamp-2 mb-3">{report.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-xs">{new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          {report.status === 'cleared' && <span className="text-green-400 text-xs font-bold">+10 pts earned</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {notifLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.3)' }}>
                <div className="text-5xl mb-4">🔔</div>
                <p className="text-white font-semibold text-lg mb-2">No notifications yet</p>
                <p className="text-slate-400 text-sm">You'll be notified when your reports are updated.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif._id}
                  className="rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all duration-200"
                  style={{ background: notif.read ? 'rgba(15,23,42,0.8)' : 'rgba(249,115,22,0.08)', border: notif.read ? '1px solid rgba(100,116,139,0.2)' : '1px solid rgba(249,115,22,0.3)' }}
                  onClick={() => !notif.read && markAsRead(notif._id)}>
                  <div className="text-2xl flex-shrink-0">
                    {notif.type === 'report_cleared' ? '✅' : notif.type === 'report_assigned' ? '👷' : notif.type === 'points_earned' ? '⭐' : '🔔'}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${notif.read ? 'text-slate-400' : 'text-white font-medium'}`}>{notif.message}</p>
                    <p className="text-slate-500 text-xs mt-1">{new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  {!notif.read && <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0 mt-1"></div>}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;