import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';

const QueryPage = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '' });

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/queries/my');
      setQueries(data.queries);
    } catch (error) {
      console.error('Failed to fetch queries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      toast.error('Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      await API.post('/queries', {
        subject: form.subject,
        message: form.message,
        category: 'general',
      });
      toast.success('Query submitted successfully!');
      setForm({ subject: '', message: '' });
      fetchQueries();
      setActiveTab('myqueries');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit query');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (queryId) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    setReplying(true);
    try {
      await API.put('/queries/' + queryId + '/message', { text: replyMessage });
      toast.success('Message sent!');
      setReplyMessage('');
      const updated = await API.get('/queries/' + queryId);
      setSelectedQuery(updated.data.query);
      fetchQueries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setReplying(false);
    }
  };

  const statusConfig = {
    open: { label: 'Open', color: '#4ade80', bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.3)' },
    replied: { label: 'Replied', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.3)' },
    closed: { label: 'Closed', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.3)' },
  };

  const tabs = [
    { id: 'new', label: 'New Query', icon: '✏️' },
    { id: 'myqueries', label: 'My Queries', icon: '📋' },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d1f3c 50%, #0f172a 100%)' }}
    >
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Help{' '}
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              & Support
            </span>
          </h1>
          <p className="text-slate-400">Have a question? We are here to help!</p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-6"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.3)' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #60a5fa, #2563eb)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#94a3b8',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* New Query Tab */}
        {activeTab === 'new' && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(15,23,42,0.9)',
              border: '1px solid rgba(100,116,139,0.3)',
            }}
          >
            <h2 className="text-lg font-bold text-white mb-6">Submit a Query</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="What is your query about?"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all"
                  style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.4)' }}
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your issue or question in detail..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.4)' }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl font-bold text-white transition-all duration-200"
                style={{
                  background: submitting ? 'rgba(96,165,250,0.5)' : 'linear-gradient(135deg, #60a5fa, #2563eb)',
                  boxShadow: submitting ? 'none' : '0 10px 30px rgba(59,130,246,0.3)',
                }}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></div>
                    Submitting...
                  </span>
                ) : 'Submit Query'}
              </button>
            </form>
          </div>
        )}

        {/* My Queries List */}
        {activeTab === 'myqueries' && !selectedQuery && (
          <div>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(96,165,250,0.3)', borderTopColor: '#60a5fa' }}></div>
              </div>
            ) : queries.length === 0 ? (
              <div
                className="text-center py-16 rounded-2xl"
                style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.3)' }}
              >
                <div className="text-5xl mb-4">💬</div>
                <p className="text-white font-semibold text-lg mb-2">No queries yet</p>
                <p className="text-slate-400 text-sm">Submit a query and our team will respond shortly.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queries.map((query) => {
                  const status = statusConfig[query.status] || statusConfig.open;
                  return (
                    <div
                      key={query._id}
                      className="rounded-xl p-5 cursor-pointer transition-all duration-200"
                      style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(100,116,139,0.3)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = '1px solid rgba(96,165,250,0.4)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = '1px solid rgba(100,116,139,0.3)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      onClick={() => setSelectedQuery(query)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{query.subject}</h3>
                          <p className="text-slate-400 text-sm line-clamp-2">
                            {query.messages?.[0]?.text}
                          </p>
                          <p className="text-slate-500 text-xs mt-2">
                            {new Date(query.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: status.bg, border: '1px solid ' + status.border, color: status.color }}
                          >
                            {status.label}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {query.messages?.length || 0} messages
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Query Chat View */}
        {activeTab === 'myqueries' && selectedQuery && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(100,116,139,0.3)' }}
          >
            {/* Header */}
            <div
              className="p-5 flex items-center gap-3"
              style={{ borderBottom: '1px solid rgba(100,116,139,0.2)' }}
            >
              <button
                onClick={() => setSelectedQuery(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1">
                <h3 className="text-white font-bold">{selectedQuery.subject}</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: statusConfig[selectedQuery.status]?.bg || 'rgba(74,222,128,0.15)',
                    color: statusConfig[selectedQuery.status]?.color || '#4ade80',
                    border: '1px solid ' + (statusConfig[selectedQuery.status]?.border || 'rgba(74,222,128,0.3)'),
                  }}
                >
                  {selectedQuery.status}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
              {selectedQuery.messages?.map((msg, index) => (
                <div
                  key={index}
                  className={'flex ' + (msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className="max-w-xs rounded-2xl px-4 py-3"
                    style={{
                      background: msg.sender === 'user'
                        ? 'linear-gradient(135deg, #60a5fa, #2563eb)'
                        : 'rgba(30,41,59,0.8)',
                      border: msg.sender === 'user' ? 'none' : '1px solid rgba(100,116,139,0.3)',
                    }}
                  >
                    <p className="text-white text-sm">{msg.text}</p>
                    <p className="text-xs mt-1" style={{ color: msg.sender === 'user' ? 'rgba(255,255,255,0.6)' : '#64748b' }}>
                      {msg.sender === 'user' ? 'You' : 'Support'} •{' '}
                      {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {selectedQuery.status !== 'closed' && (
              <div className="p-4" style={{ borderTop: '1px solid rgba(100,116,139,0.2)' }}>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(selectedQuery._id)}
                    className="flex-1 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all"
                    style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.4)' }}
                  />
                  <button
                    onClick={() => handleReply(selectedQuery._id)}
                    disabled={replying}
                    className="px-5 py-3 rounded-xl font-bold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #60a5fa, #2563eb)' }}
                  >
                    {replying ? (
                      <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {selectedQuery.status === 'closed' && (
              <div className="p-4 text-center text-slate-400 text-sm" style={{ borderTop: '1px solid rgba(100,116,139,0.2)' }}>
                This query has been closed.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default QueryPage;