import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editPoints, setEditPoints] = useState(null);
  const [pointsValue, setPointsValue] = useState('');
  const [updatingPoints, setUpdatingPoints] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (userId) => {
    try {
      await API.put('/admin/users/' + userId + '/toggle');
      toast.success('User status updated!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleUpdatePoints = async (userId) => {
    if (pointsValue === '') { toast.error('Please enter points value'); return; }
    setUpdatingPoints(true);
    try {
      await API.put('/admin/users/' + userId + '/points', { points: Number(pointsValue) });
      toast.success('Points updated!');
      setEditPoints(null);
      setPointsValue('');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update points');
    } finally {
      setUpdatingPoints(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manage <span className="text-blue-500">Users</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{users.length} total users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all"
        >
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-700 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all bg-white"
        />
      </div>

      {/* Users */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-gray-600 font-semibold text-lg">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              style={{ borderColor: user.isActive ? '#e5e7eb' : '#fecaca' }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">

                {/* Avatar + Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-orange-400 flex items-center justify-center text-lg font-black text-white flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-gray-800 font-bold">{user.name}</h3>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold capitalize border"
                        style={{
                          background: user.role === 'admin' ? '#eff6ff' : '#fff7ed',
                          borderColor: user.role === 'admin' ? '#bfdbfe' : '#fed7aa',
                          color: user.role === 'admin' ? '#2563eb' : '#ea580c',
                        }}
                      >
                        {user.role}
                      </span>
                      {!user.isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 border border-red-200 text-red-500">
                          Banned
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <p className="text-gray-300 text-xs mt-0.5">Reports: {user.totalReports || 0}</p>
                  </div>
                </div>

                {/* Points + Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  {editPoints === user._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={pointsValue}
                        onChange={(e) => setPointsValue(e.target.value)}
                        placeholder="Points"
                        className="w-24 px-3 py-2 rounded-lg text-gray-700 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                      />
                      <button
                        onClick={() => handleUpdatePoints(user._id)}
                        disabled={updatingPoints}
                        className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-green-500 hover:bg-green-600 transition-all"
                      >
                        {updatingPoints ? '...' : 'Save'}
                      </button>
                      <button
                        onClick={() => { setEditPoints(null); setPointsValue(''); }}
                        className="px-3 py-2 rounded-lg text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditPoints(user._id); setPointsValue(user.totalPoints || 0); }}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 transition-all"
                    >
                      ⭐ {user.totalPoints || 0} pts
                    </button>
                  )}

                  <button
                    onClick={() => handleToggle(user._id)}
                    className="px-4 py-2 rounded-lg text-xs font-bold border transition-all"
                    style={{
                      background: user.isActive ? '#fef2f2' : '#f0fdf4',
                      borderColor: user.isActive ? '#fecaca' : '#bbf7d0',
                      color: user.isActive ? '#dc2626' : '#16a34a',
                    }}
                  >
                    {user.isActive ? 'Ban' : 'Unban'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default UsersPage;