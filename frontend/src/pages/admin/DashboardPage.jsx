import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/reports/admin/stats');
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { to: '/admin/reports', label: 'Manage Reports', sub: 'Assign workers, update status', icon: '📍', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
    { to: '/admin/workers', label: 'Manage Workers', sub: 'Add, edit, toggle workers', icon: '👷', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    { to: '/admin/queries', label: 'Handle Queries', sub: 'Reply to user queries', icon: '💬', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  ];

  const statCards = [
    { label: 'Total Reports', value: stats?.total || 0, icon: '📍', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
    { label: 'Pending', value: stats?.pending || 0, icon: '⏳', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { label: 'In Progress', value: (stats?.assigned || 0) + (stats?.inprogress || 0), icon: '🔄', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { label: 'Cleared', value: stats?.cleared || 0, icon: '✅', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  ];

  const progressBars = [
    { label: 'Pending', value: stats?.pending || 0, color: '#f59e0b' },
    { label: 'Assigned', value: stats?.assigned || 0, color: '#3b82f6' },
    { label: 'In Progress', value: stats?.inprogress || 0, color: '#f97316' },
    { label: 'Cleared', value: stats?.cleared || 0, color: '#22c55e' },
  ];

  const pieData = [
    { name: 'Pending', value: stats?.pending || 0, color: '#f59e0b' },
    { name: 'Assigned', value: stats?.assigned || 0, color: '#3b82f6' },
    { name: 'In Progress', value: stats?.inprogress || 0, color: '#f97316' },
    { name: 'Cleared', value: stats?.cleared || 0, color: '#22c55e' },
  ].filter(d => d.value > 0);

  const barData = (stats?.reportsPerDay || []).map(d => ({
    date: d._id ? d._id.slice(5) : '',
    Reports: d.count,
  }));

  const total = stats?.total || 1;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin <span className="text-orange-500">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Welcome back! Here is what is happening.</p>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-all"
        >
          Refresh Stats
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl p-5 border transition-all hover:-translate-y-1 duration-200"
                style={{ background: card.bg, borderColor: card.border }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <p className="text-gray-500 text-xs font-medium mb-1">{card.label}</p>
                <p className="text-3xl font-black" style={{ color: card.color }}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Extra Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl p-5 border border-purple-100 bg-purple-50">
              <div className="text-3xl mb-3">👥</div>
              <p className="text-gray-500 text-xs font-medium mb-1">Total Users</p>
              <p className="text-3xl font-black text-purple-600">{stats?.totalUsers || 0}</p>
            </div>
            <div className="rounded-2xl p-5 border border-green-100 bg-green-50">
              <div className="text-3xl mb-3">🎁</div>
              <p className="text-gray-500 text-xs font-medium mb-1">Points Awarded</p>
              <p className="text-3xl font-black text-green-600">{stats?.totalRewardsGiven || 0}</p>
            </div>
            <div className="rounded-2xl p-5 border border-blue-100 bg-blue-50 col-span-2 md:col-span-1">
              <div className="text-3xl mb-3">📈</div>
              <p className="text-gray-500 text-xs font-medium mb-1">Clearance Rate</p>
              <p className="text-3xl font-black text-blue-600">
                {stats?.total ? Math.round((stats.cleared / stats.total) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Bar Chart — Reports Per Day */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-gray-800 font-bold mb-1">Reports Last 7 Days</h2>
              <p className="text-gray-400 text-xs mb-4">Daily report submissions</p>
              {barData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-300">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-sm">No data yet</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Bar dataKey="Reports" fill="#f97316" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie Chart — Status Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-gray-800 font-bold mb-1">Status Distribution</h2>
              <p className="text-gray-400 text-xs mb-4">Current report status breakdown</p>
              {pieData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-300">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🥧</div>
                    <p className="text-sm">No data yet</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h2 className="text-gray-800 font-bold mb-5">Reports Overview</h2>
            <div className="space-y-4">
              {progressBars.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500 font-medium">{item.label}</span>
                    <span className="text-gray-800 font-bold">{item.value}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-100">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700"
                      style={{
                        width: total > 0 ? ((item.value / total) * 100) + '%' : '0%',
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md block"
                style={{ background: item.bg, borderColor: item.border }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-1">{item.label}</h3>
                <p className="text-gray-400 text-sm mb-3">{item.sub}</p>
                <p className="text-sm font-semibold" style={{ color: item.color }}>
                  Go to {item.label} →
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;