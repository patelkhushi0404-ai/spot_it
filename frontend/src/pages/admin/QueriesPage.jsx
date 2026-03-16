import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const statusStyle = {
  open: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
  replied: { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
  closed: { bg: '#f9fafb', border: '#e5e7eb', color: '#9ca3af' },
};

const QueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);
  const [closing, setClosing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchQueries(); }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/queries');
      setQueries(data.queries);
    } catch (error) {
      console.error('Failed to fetch queries');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (queryId) => {
    if (!replyMessage.trim()) { toast.error('Please enter a message'); return; }
    setReplying(true);
    try {
      await API.put('/queries/' + queryId + '/message', { text: replyMessage });
      toast.success('Reply sent!');
      setReplyMessage('');
      fetchQueries();
      const { data } = await API.get('/queries/' + queryId);
      setSelectedQuery(data.query);
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const handleClose = async (queryId) => {
    setClosing(true);
    try {
      await API.put('/queries/' + queryId + '/close');
      toast.success('Query closed!');
      fetchQueries();
      setSelectedQuery(null);
    } catch (error) {
      toast.error('Failed to close query');
    } finally {
      setClosing(false);
    }
  };

  const filteredQueries = filter === 'all' ? queries : queries.filter(q => q.status === filter);

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'replied', label: 'Replied' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manage <span className="text-blue-500">Queries</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{queries.length} total queries</p>
        </div>
        <button
          onClick={fetchQueries}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Queries List */}
        <div>
          {/* Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap"
                style={{
                  background: filter === f.value ? '#3b82f6' : '#fff',
                  color: filter === f.value ? '#fff' : '#6b7280',
                  borderColor: filter === f.value ? '#3b82f6' : '#e5e7eb',
                }}
              >
                {f.label} ({f.value === 'all' ? queries.length : queries.filter(q => q.status === f.value).length})
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredQueries.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-gray-600 font-semibold">No queries found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQueries.map((query) => {
                const s = statusStyle[query.status] || statusStyle.closed;
                const isSelected = selectedQuery?._id === query._id;
                return (
                  <div
                    key={query._id}
                    className="rounded-xl p-4 cursor-pointer transition-all duration-200 border"
                    style={{
                      background: isSelected ? '#eff6ff' : '#fff',
                      borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
                      boxShadow: isSelected ? '0 0 0 2px #bfdbfe' : '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                    onClick={() => { setSelectedQuery(query); setReplyMessage(''); }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-orange-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {query.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="text-gray-800 text-sm font-semibold">{query.user?.name}</span>
                        </div>
                        <p className="text-gray-600 text-sm font-medium mb-1">{query.subject}</p>
                        <p className="text-gray-400 text-xs">
                          {query.messages?.length || 0} messages • {new Date(query.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 border capitalize"
                        style={{ background: s.bg, borderColor: s.border, color: s.color }}
                      >
                        {query.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Chat View */}
        <div>
          {!selectedQuery ? (
            <div className="bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm" style={{ minHeight: '400px' }}>
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-gray-400">Select a query to view and reply</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div>
                  <h3 className="text-gray-800 font-bold text-sm">{selectedQuery.subject}</h3>
                  <p className="text-gray-400 text-xs">{selectedQuery.user?.name} • {selectedQuery.user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-bold border capitalize"
                    style={{
                      background: statusStyle[selectedQuery.status]?.bg,
                      borderColor: statusStyle[selectedQuery.status]?.border,
                      color: statusStyle[selectedQuery.status]?.color,
                    }}
                  >
                    {selectedQuery.status}
                  </span>
                  {selectedQuery.status !== 'closed' && (
                    <button
                      onClick={() => handleClose(selectedQuery._id)}
                      disabled={closing}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                    >
                      {closing ? '...' : 'Close'}
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 overflow-y-auto bg-gray-50" style={{ maxHeight: '350px' }}>
                {selectedQuery.messages?.map((msg, index) => (
                  <div key={index} className={'flex ' + (msg.sender === 'admin' ? 'justify-end' : 'justify-start')}>
                    <div
                      className="max-w-xs rounded-2xl px-4 py-3 shadow-sm"
                      style={{
                        background: msg.sender === 'admin' ? '#3b82f6' : '#fff',
                        border: msg.sender === 'admin' ? 'none' : '1px solid #e5e7eb',
                      }}
                    >
                      <p className={msg.sender === 'admin' ? 'text-white text-sm' : 'text-gray-700 text-sm'}>
                        {msg.text}
                      </p>
                      <p className={'text-xs mt-1 ' + (msg.sender === 'admin' ? 'text-blue-200' : 'text-gray-400')}>
                        {msg.sender === 'admin' ? 'You (Admin)' : selectedQuery.user?.name} • {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply */}
              {selectedQuery.status !== 'closed' ? (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      onKeyDown={(e) => e.key === 'Enter' && handleReply(selectedQuery._id)}
                      className="flex-1 px-4 py-3 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                    <button
                      onClick={() => handleReply(selectedQuery._id)}
                      disabled={replying}
                      className="px-5 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-all"
                    >
                      {replying ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-400 text-sm border-t border-gray-100">
                  This query has been closed.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default QueriesPage;