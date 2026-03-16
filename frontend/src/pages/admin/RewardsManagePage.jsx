import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const categoryEmoji = { voucher: '🎁', cashback: '💰', certificate: '🏆', other: '⭐' };

const RewardsManagePage = () => {
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rewards');
  const [showForm, setShowForm] = useState(false);
  const [editReward, setEditReward] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', pointsRequired: '', category: 'voucher' });

  useEffect(() => { fetchRewards(); fetchRedemptions(); }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/rewards');
      setRewards(data.rewards);
    } catch (error) {
      console.error('Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  const fetchRedemptions = async () => {
    try {
      const { data } = await API.get('/rewards/all-redemptions');
      setRedemptions(data.redemptions);
    } catch (error) {
      console.error('Failed to fetch redemptions');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.pointsRequired) { toast.error('Please fill all required fields'); return; }
    setSubmitting(true);
    try {
      if (editReward) {
        await API.put('/rewards/' + editReward._id, form);
        toast.success('Reward updated!');
      } else {
        await API.post('/rewards', form);
        toast.success('Reward created!');
      }
      fetchRewards();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save reward');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (rewardId) => {
    if (!window.confirm('Delete this reward?')) return;
    try {
      await API.delete('/rewards/' + rewardId);
      toast.success('Reward deleted!');
      fetchRewards();
    } catch (error) {
      toast.error('Failed to delete reward');
    }
  };

  const handleEdit = (reward) => {
    setEditReward(reward);
    setForm({ title: reward.title, description: reward.description || '', pointsRequired: reward.pointsRequired, category: reward.category || 'voucher' });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ title: '', description: '', pointsRequired: '', category: 'voucher' });
    setEditReward(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manage <span className="text-orange-500">Rewards</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{rewards.length} rewards configured</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
          className="px-5 py-2.5 rounded-xl font-semibold text-white transition-all"
          style={{ background: showForm ? '#6b7280' : '#f97316' }}
        >
          {showForm ? 'Cancel' : '+ Add Reward'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-6 border border-orange-100 shadow-sm">
          <h2 className="text-gray-800 font-bold mb-5">{editReward ? 'Edit Reward' : 'Add New Reward'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1.5">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Reward title"
                  className="w-full px-4 py-2.5 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1.5">Points Required *</label>
                <input
                  type="number"
                  name="pointsRequired"
                  value={form.pointsRequired}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2.5 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1.5">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                >
                  <option value="voucher">🎁 Gift Voucher</option>
                  <option value="cashback">💰 Cashback</option>
                  <option value="certificate">🏆 Certificate</option>
                  <option value="other">⭐ Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1.5">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short description"
                  className="w-full px-4 py-2.5 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editReward ? 'Update Reward' : 'Add Reward'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ id: 'rewards', label: 'Rewards', icon: '🎁' }, { id: 'redemptions', label: 'Redemptions', icon: '📋' }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all"
            style={{
              background: activeTab === tab.id ? '#f97316' : '#fff',
              color: activeTab === tab.id ? '#fff' : '#6b7280',
              borderColor: activeTab === tab.id ? '#f97316' : '#e5e7eb',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : rewards.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
            <div className="text-5xl mb-4">🎁</div>
            <p className="text-gray-600 font-semibold text-lg mb-2">No rewards yet</p>
            <p className="text-gray-400 text-sm">Add rewards for users to redeem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward._id}
                className="bg-white rounded-2xl p-5 border border-orange-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{categoryEmoji[reward.category] || '⭐'}</div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-50 border border-orange-200 text-orange-600">
                    {reward.pointsRequired} pts
                  </span>
                </div>
                <h3 className="text-gray-800 font-bold text-lg mb-1">{reward.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{reward.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(reward)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reward._id)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Redemptions Tab */}
      {activeTab === 'redemptions' && (
        <div className="space-y-3">
          {redemptions.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-600 font-semibold text-lg">No redemptions yet</p>
            </div>
          ) : (
            redemptions.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 flex items-center justify-between border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{categoryEmoji[item.reward?.category] || '🎁'}</div>
                  <div>
                    <p className="text-gray-800 font-semibold">{item.rewardTitle}</p>
                    <p className="text-gray-400 text-xs">
                      {item.user?.name} • {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-500">-{item.pointsUsed} pts</p>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium border"
                    style={{
                      background: item.status === 'completed' ? '#f0fdf4' : '#fffbeb',
                      borderColor: item.status === 'completed' ? '#bbf7d0' : '#fde68a',
                      color: item.status === 'completed' ? '#16a34a' : '#d97706',
                    }}
                  >
                    {item.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default RewardsManagePage;