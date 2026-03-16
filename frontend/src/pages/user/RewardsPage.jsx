import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';

const cs = {
  voucher: {
    bg: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.4)',
    color: '#fb923c',
    glow: 'rgba(249,115,22,0.15)',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 100%)',
    emoji: '🎁',
  },
  cashback: {
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.4)',
    color: '#4ade80',
    glow: 'rgba(34,197,94,0.15)',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
    emoji: '💰',
  },
  certificate: {
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.4)',
    color: '#60a5fa',
    glow: 'rgba(59,130,246,0.15)',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)',
    emoji: '🏆',
  },
  other: {
    bg: 'rgba(168,85,247,0.1)',
    border: 'rgba(168,85,247,0.4)',
    color: '#c084fc',
    glow: 'rgba(168,85,247,0.15)',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 100%)',
    emoji: '⭐',
  },
};

const RewardsPage = () => {
  const { user, updateUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [history, setHistory] = useState([]);
  const [rewardsLoading, setRewardsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [activeTab, setActiveTab] = useState('rewards');

  useEffect(() => {
    fetchRewards();
    fetchHistory();
  }, []);

  const fetchRewards = async () => {
    setRewardsLoading(true);
    try {
      const { data } = await API.get('/rewards');
      setRewards(data.rewards);
    } catch (error) {
      console.error('Failed to fetch rewards');
    } finally {
      setRewardsLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data } = await API.get('/rewards/history');
      setHistory(data.redemptions);
    } catch (error) {
      console.error('Failed to fetch history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRedeem = async (reward) => {
    const userPoints = user?.totalPoints || 0;
    if (userPoints < reward.pointsRequired) {
      toast.error('Not enough points to redeem this reward!');
      return;
    }
    setRedeeming(reward._id);
    try {
      const { data } = await API.post('/rewards/redeem', { rewardId: reward._id });
      updateUser({ ...user, totalPoints: data.remainingPoints });
      toast.success('Reward redeemed successfully!');
      fetchHistory();
      setActiveTab('history');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Redemption failed');
    } finally {
      setRedeeming(null);
    }
  };

  const tabs = [
    { id: 'rewards', label: 'Rewards', icon: '🎁' },
    { id: 'history', label: 'My Redemptions', icon: '📋' },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d1f3c 50%, #0f172a 100%)' }}
    >
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your{' '}
            <span className="bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              Rewards
            </span>
          </h1>
          <p className="text-slate-400">Redeem your points for amazing rewards!</p>
        </div>

        {/* Points Card */}
        <div
          className="rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(34,197,94,0.2) 100%)',
            border: '1px solid rgba(249,115,22,0.3)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">⭐</div>
            <div>
              <p className="text-slate-400 text-sm">Your Current Points</p>
              <p className="text-4xl font-black text-white">{user?.totalPoints || 0}</p>
            </div>
          </div>
          <div className="text-slate-400 text-sm text-center md:text-right">
            <p>Complete reports to earn more points</p>
            <p className="text-white font-semibold mt-1">{rewards.length} rewards available</p>
          </div>
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
                background: activeTab === tab.id ? 'linear-gradient(135deg, #fb923c, #ea580c)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#94a3b8',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          rewardsLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : rewards.length === 0 ? (
            <div
              className="text-center py-16 rounded-2xl"
              style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.3)' }}
            >
              <div className="text-5xl mb-4">🎁</div>
              <p className="text-white font-semibold text-lg mb-2">No rewards available</p>
              <p className="text-slate-400 text-sm">Admin has not added any rewards yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const c = cs[reward.category] || cs.other;
                const userPoints = user?.totalPoints || 0;
                const canRedeem = userPoints >= reward.pointsRequired;
                const isRedeeming = redeeming === reward._id;
                return (
                  <div
                    key={reward._id}
                    className="relative rounded-2xl p-8 transition-all duration-300"
                    style={{
                      background: c.gradient,
                      border: '1px solid ' + c.border,
                      boxShadow: '0 4px 20px ' + c.glow,
                      opacity: canRedeem ? 1 : 0.7,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 20px 50px ' + c.glow;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.boxShadow = '0 4px 20px ' + c.glow;
                    }}
                  >
                    <div className="text-5xl mb-4">{c.emoji}</div>

                    <div
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold mb-4"
                      style={{ background: c.bg, border: '1px solid ' + c.border, color: c.color }}
                    >
                      {reward.pointsRequired} Points
                    </div>

                    <h3 className="text-2xl font-black mb-2" style={{ color: c.color }}>
                      {reward.title}
                    </h3>

                    <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: c.color }}></div>

                    {reward.description && (
                      <p className="text-slate-300 text-sm leading-relaxed mb-5">{reward.description}</p>
                    )}

                    {!canRedeem && (
                      <p className="text-xs mb-3" style={{ color: '#f87171' }}>
                        Need {reward.pointsRequired - userPoints} more points
                      </p>
                    )}

                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canRedeem || isRedeeming}
                      className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200"
                      style={{
                        background: canRedeem ? c.color : 'rgba(100,116,139,0.2)',
                        color: canRedeem ? '#0f172a' : '#64748b',
                        border: canRedeem ? 'none' : '1px solid rgba(100,116,139,0.3)',
                        cursor: canRedeem ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {isRedeeming ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#0f172a' }}></div>
                          Redeeming...
                        </span>
                      ) : canRedeem ? 'Redeem Now' : 'Not Enough Points'}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          historyLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : history.length === 0 ? (
            <div
              className="text-center py-16 rounded-2xl"
              style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.3)' }}
            >
              <div className="text-5xl mb-4">📋</div>
              <p className="text-white font-semibold text-lg mb-2">No redemptions yet</p>
              <p className="text-slate-400 text-sm">Redeem your points for amazing rewards!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl p-5 flex items-center justify-between"
                  style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(100,116,139,0.3)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">
                      {cs[item.reward?.category]?.emoji || cs[item.rewardTitle?.toLowerCase()]?.emoji || '🎁'}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{item.rewardTitle || item.reward?.title}</p>
                      <p className="text-slate-400 text-xs">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: '#f87171' }}>
                      -{item.pointsUsed} pts
                    </p>
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        background: 'rgba(74,222,128,0.15)',
                        color: '#4ade80',
                        border: '1px solid rgba(74,222,128,0.3)',
                      }}
                    >
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
};

export default RewardsPage;