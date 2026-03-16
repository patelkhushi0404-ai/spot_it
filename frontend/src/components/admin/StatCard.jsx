import React from 'react';

const StatCard = ({ title, value, icon, color, sub }) => {
  const colorMap = {
    orange: {
      bg: 'rgba(249,115,22,0.1)',
      border: 'rgba(249,115,22,0.3)',
      color: '#fb923c',
      glow: 'rgba(249,115,22,0.15)',
    },
    green: {
      bg: 'rgba(34,197,94,0.1)',
      border: 'rgba(34,197,94,0.3)',
      color: '#4ade80',
      glow: 'rgba(34,197,94,0.15)',
    },
    blue: {
      bg: 'rgba(59,130,246,0.1)',
      border: 'rgba(59,130,246,0.3)',
      color: '#60a5fa',
      glow: 'rgba(59,130,246,0.15)',
    },
    yellow: {
      bg: 'rgba(251,191,36,0.1)',
      border: 'rgba(251,191,36,0.3)',
      color: '#fbbf24',
      glow: 'rgba(251,191,36,0.15)',
    },
  };

  const c = colorMap[color] || colorMap.orange;

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, ' + c.bg + ' 0%, rgba(15,23,42,0.8) 100%)',
        border: '1px solid ' + c.border,
        boxShadow: '0 4px 20px ' + c.glow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 15px 40px ' + c.glow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px ' + c.glow;
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: c.bg, border: '1px solid ' + c.border }}
        >
          {icon}
        </div>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: c.bg, color: c.color, border: '1px solid ' + c.border }}
        >
          Live
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-black text-white mb-1">{value}</p>
      {sub && <p className="text-xs" style={{ color: c.color }}>{sub}</p>}
    </div>
  );
};

export default StatCard;