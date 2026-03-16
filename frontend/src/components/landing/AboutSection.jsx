import React from 'react';

const values = [
  {
    title: 'Our Mission',
    description: 'To empower every citizen to take action against waste by providing a simple, effective platform to report and track waste disposal issues in their community.',
    color: 'orange',
    number: '01',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Our Vision',
    description: 'A clean, healthy India where communities actively participate in waste management and every reported waste spot gets cleaned within 24 hours.',
    color: 'green',
    number: '02',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: 'Our Objective',
    description: 'To create a reward-based system that motivates citizens to report waste, while enabling authorities to efficiently manage and resolve waste complaints.',
    color: 'blue',
    number: '03',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
];

const stats = [
  { value: '10+', label: 'Cities Covered', color: '#fb923c' },
  { value: '50+', label: 'Workers Active', color: '#4ade80' },
  { value: '95%', label: 'Issues Resolved', color: '#60a5fa' },
  { value: '24h', label: 'Avg Response Time', color: '#fb923c' },
];

const cs = {
  orange: {
    bg: 'rgba(249,115,22,0.15)',
    border: 'rgba(249,115,22,0.5)',
    color: '#fb923c',
    glow: 'rgba(249,115,22,0.2)',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(249,115,22,0.05) 100%)',
  },
  green: {
    bg: 'rgba(34,197,94,0.15)',
    border: 'rgba(34,197,94,0.5)',
    color: '#4ade80',
    glow: 'rgba(34,197,94,0.2)',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.05) 100%)',
  },
  blue: {
    bg: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.5)',
    color: '#60a5fa',
    glow: 'rgba(59,130,246,0.2)',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.05) 100%)',
  },
};

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Who We Are
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              SpotIT
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            SpotIT was built with a single goal — to make waste reporting easy,
            fast, and rewarding for every citizen of India.
          </p>
        </div>

        {/* Mission Vision Objective Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {values.map((item, index) => {
            const c = cs[item.color];
            return (
              <div
                key={index}
                className="rounded-2xl p-8 transition-all duration-300"
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
                {/* Top row: icon + number */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                      color: c.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    className="text-5xl font-black opacity-60"
                    style={{ color: c.color }}
                  >
                    {item.number}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-2xl font-black mb-3"
                  style={{ color: c.color }}
                >
                  {item.title}
                </h3>

                {/* Divider */}
                <div
                  className="w-12 h-1 rounded-full mb-4"
                  style={{ backgroundColor: c.color }}
                ></div>

                {/* Description */}
                <p className="text-slate-200 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div
          className="rounded-2xl p-8 mb-16"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(34,197,94,0.1) 50%, rgba(59,130,246,0.1) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-black mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-slate-300 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why SpotIT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Why We Built{' '}
              <span className="text-orange-400">SpotIT?</span>
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Every day, millions of Indians see waste piled up on streets, parks,
              and public spaces — but feel helpless because there's no easy way to report it.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              SpotIT bridges that gap. With just a photo and your location,
              your report reaches the right authorities instantly.
            </p>
            <p className="text-slate-300 leading-relaxed">
              And because we believe action deserves recognition —
              we reward every successful cleanup with points you can redeem for real rewards.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '🗺️', title: 'Location Based', sub: 'Auto GPS detection', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)' },
              { emoji: '📸', title: 'Photo Evidence', sub: 'Camera capture', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)' },
              { emoji: '⚡', title: 'Fast Response', sub: '24hr resolution', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)' },
              { emoji: '🎁', title: 'Earn Rewards', sub: 'Points system', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)' },
            ].map((feat, i) => (
              <div
                key={i}
                className="rounded-xl p-5 text-center transition-all duration-300"
                style={{
                  background: feat.bg,
                  border: `1px solid ${feat.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 10px 30px ${feat.bg}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="text-3xl mb-2">{feat.emoji}</div>
                <p className="text-white font-semibold text-sm">{feat.title}</p>
                <p className="text-slate-400 text-xs mt-1">{feat.sub}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;