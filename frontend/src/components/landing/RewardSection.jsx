import React from 'react';
import { Link } from 'react-router-dom';

const rewards = [
  {
    title: 'Gift Voucher',
    points: 100,
    color: 'orange',
    emoji: '🎁',
    description: 'Redeem your points for exciting gift vouchers from top brands.',
    perks: ['Valid for 30 days', 'Multiple brands', 'Instant delivery'],
  },
  {
    title: 'Cashback',
    points: 200,
    color: 'green',
    emoji: '💰',
    description: 'Get real cashback directly credited to your account.',
    perks: ['Direct bank transfer', 'No minimum limit', 'Instant credit'],
    popular: true,
  },
  {
    title: 'Certificate',
    points: 300,
    color: 'blue',
    emoji: '🏆',
    description: 'Earn an official certificate recognizing your contribution.',
    perks: ['Official document', 'Shareable online', 'Government recognized'],
  },
];

const cs = {
  orange: {
    bg: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.4)',
    color: '#fb923c',
    glow: 'rgba(249,115,22,0.15)',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 100%)',
    btnBg: 'rgba(249,115,22,0.2)',
    btnHover: '#fb923c',
  },
  green: {
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.4)',
    color: '#4ade80',
    glow: 'rgba(34,197,94,0.15)',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
    btnBg: 'rgba(34,197,94,0.2)',
    btnHover: '#4ade80',
  },
  blue: {
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.4)',
    color: '#60a5fa',
    glow: 'rgba(59,130,246,0.15)',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)',
    btnBg: 'rgba(59,130,246,0.2)',
    btnHover: '#60a5fa',
  },
};

const RewardSection = () => {
  return (
    <section id="rewards" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Earn While You Help
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Amazing{' '}
            <span className="bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              Rewards
            </span>
            {' '}Await
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Every waste report you submit earns you points.
            Collect enough and redeem for real rewards!
          </p>
        </div>

        {/* How Points Work */}
        <div
          className="rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(34,197,94,0.1) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">📍</div>
            <div>
              <p className="text-white font-bold">Submit a Report</p>
              <p className="text-slate-400 text-sm">Spot and report waste</p>
            </div>
          </div>
          <div className="text-slate-500 text-2xl hidden md:block">→</div>
          <div className="flex items-center gap-4">
            <div className="text-4xl">✅</div>
            <div>
              <p className="text-white font-bold">Waste Gets Cleared</p>
              <p className="text-slate-400 text-sm">Admin verifies cleanup</p>
            </div>
          </div>
          <div className="text-slate-500 text-2xl hidden md:block">→</div>
          <div className="flex items-center gap-4">
            <div className="text-4xl">⭐</div>
            <div>
              <p className="text-white font-bold">Earn 10 Points</p>
              <p className="text-slate-400 text-sm">Per cleared report</p>
            </div>
          </div>
          <div className="text-slate-500 text-2xl hidden md:block">→</div>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎉</div>
            <div>
              <p className="text-white font-bold">Redeem Rewards</p>
              <p className="text-slate-400 text-sm">Choose your prize</p>
            </div>
          </div>
        </div>

        {/* Reward Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {rewards.map((reward, index) => {
            const c = cs[reward.color];
            return (
              <div
                key={index}
                className="relative rounded-2xl p-8 transition-all duration-300"
                style={{
                  background: c.gradient,
                  border: `1px solid ${c.border}`,
                  boxShadow: `0 4px 20px ${c.glow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 20px 50px ${c.glow}`;
                  e.currentTarget.style.border = `1px solid ${c.color}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${c.glow}`;
                  e.currentTarget.style.border = `1px solid ${c.border}`;
                }}
              >
                {/* Popular Badge */}
                {reward.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(90deg, #fb923c, #4ade80)' }}
                  >
                    🔥 Most Popular
                  </div>
                )}

                {/* Emoji */}
                <div className="text-5xl mb-4">{reward.emoji}</div>

                {/* Points Badge */}
                <div
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold mb-4"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
                >
                  ⭐ {reward.points} Points
                </div>

                {/* Title */}
                <h3
                  className="text-2xl font-black mb-3"
                  style={{ color: c.color }}
                >
                  {reward.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {reward.description}
                </p>

                {/* Perks */}
                <ul className="space-y-2 mb-6">
                  {reward.perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <span style={{ color: c.color }}>✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Link
                  to="/register"
                  className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{
                    background: c.btnBg,
                    border: `1px solid ${c.border}`,
                    color: c.color,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.color;
                    e.currentTarget.style.color = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = c.btnBg;
                    e.currentTarget.style.color = c.color;
                  }}
                >
                  Redeem for {reward.points} pts
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="text-center rounded-2xl p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(59,130,246,0.15) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <h3 className="text-3xl font-bold text-white mb-3">
            Ready to Start Earning? 🚀
          </h3>
          <p className="text-slate-400 mb-6">
            Join hundreds of citizens already making a difference and earning rewards.
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
          >
            Join SpotIT Free
          </Link>
        </div>

      </div>
    </section>
  );
};

export default RewardSection;