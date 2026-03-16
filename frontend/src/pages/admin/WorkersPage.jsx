import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const WorkersPage = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editWorker, setEditWorker] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', area: '', email: '' });

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/workers');
      setWorkers(data.workers);
    } catch (error) {
      console.error('Failed to fetch workers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.area) { toast.error('Please fill all required fields'); return; }
    setSubmitting(true);
    try {
      if (editWorker) {
        await API.put('/workers/' + editWorker._id, form);
        toast.success('Worker updated!');
      } else {
        await API.post('/workers', form);
        toast.success('Worker added!');
      }
      fetchWorkers();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save worker');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (workerId) => {
    try {
      await API.put('/workers/' + workerId + '/toggle');
      toast.success('Worker status updated!');
      fetchWorkers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (workerId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete('/workers/' + workerId);
      toast.success('Worker deleted!');
      fetchWorkers();
    } catch (error) {
      toast.error('Failed to delete worker');
    }
  };

  const handleEdit = (worker) => {
    setEditWorker(worker);
    setForm({ name: worker.name, phone: worker.phone, area: worker.area, email: worker.email || '' });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', phone: '', area: '', email: '' });
    setEditWorker(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manage <span className="text-green-500">Workers</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{workers.length} total workers</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
          className="px-5 py-2.5 rounded-xl font-semibold text-white transition-all"
          style={{
            background: showForm ? '#6b7280' : '#16a34a',
          }}
        >
          {showForm ? 'Cancel' : '+ Add Worker'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-6 border border-green-100 shadow-sm">
          <h2 className="text-gray-800 font-bold mb-5">
            {editWorker ? 'Edit Worker' : 'Add New Worker'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1.5">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Worker name"
                  className="w-full px-4 py-2.5 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1.5">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full px-4 py-2.5 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1.5">Area *</label>
                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="Working area"
                  className="w-full px-4 py-2.5 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email (optional)"
                  className="w-full px-4 py-2.5 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editWorker ? 'Update Worker' : 'Add Worker'}
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

      {/* Workers Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
          <div className="text-5xl mb-4">👷</div>
          <p className="text-gray-600 font-semibold text-lg mb-2">No workers yet</p>
          <p className="text-gray-400 text-sm">Add workers to assign them to reports.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <div
              key={worker._id}
              className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              style={{ borderColor: worker.isActive ? '#bbf7d0' : '#e5e7eb' }}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-xl font-black text-white">
                  {worker.name?.charAt(0).toUpperCase()}
                </div>
                <span
                  className="px-2 py-1 rounded-full text-xs font-bold border"
                  style={{
                    background: worker.isActive ? '#f0fdf4' : '#f9fafb',
                    borderColor: worker.isActive ? '#bbf7d0' : '#e5e7eb',
                    color: worker.isActive ? '#16a34a' : '#9ca3af',
                  }}
                >
                  {worker.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Info */}
              <h3 className="text-gray-800 font-bold text-lg mb-2">{worker.name}</h3>
              <div className="space-y-1 mb-4">
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <span>📞</span> {worker.phone}
                </p>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <span>📍</span> {worker.area}
                </p>
                {worker.email && (
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <span>📧</span> {worker.email}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(worker._id)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold border transition-all"
                  style={{
                    background: worker.isActive ? '#fef2f2' : '#f0fdf4',
                    borderColor: worker.isActive ? '#fecaca' : '#bbf7d0',
                    color: worker.isActive ? '#dc2626' : '#16a34a',
                  }}
                >
                  {worker.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(worker)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(worker._id)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default WorkersPage;