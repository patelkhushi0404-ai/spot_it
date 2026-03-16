import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Spot the Waste',
    description: 'See waste anywhere around you? Open SpotIT and click Spot Now to start reporting instantly.',
    color: 'orange',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Capture & Submit',
    description: 'Take a photo using your camera, add your location automatically via GPS, and submit the report.',
    color: 'green',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Admin Assigns Worker',
    description: 'Our admin reviews your report, verifies it, and assigns a nearby worker to clean the waste.',
    color: 'blue',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Earn Reward Points',
    description: 'Once waste is cleared, you get notified and earn points. Redeem them for exciting rewards!',
    color: 'orange',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const colorStyles = {
  orange: {
    iconBg: 'background: rgba(249,115,22,0.15)',
    iconBorder: '1px solid rgba(249,115,22,0.4)',
    iconColor: '#fb923c',
    numberColor: 'rgba(249,115,22,0.6)',
    hoverBorder: 'rgba(249,115,22,0.5)',
    hoverShadow: '0 0 30px rgba(249,115,22,0.15)',
  },
  green: {
    iconBg: 'background: rgba(34,197,94,0.15)',
    iconBorder: '1px solid rgba(34,197,94,0.4)',
    iconColor: '#4ade80',
    numberColor: 'rgba(34,197,94,0.6)',
    hoverBorder: 'rgba(34,197,94,0.5)',
    hoverShadow: '0 0 30px rgba(34,197,94,0.15)',
  },
  blue: {
    iconBg: 'background: rgba(59,130,246,0.15)',
    iconBorder: '1px solid rgba(59,130,246,0.4)',
    iconColor: '#60a5fa',
    numberColor: 'rgba(59,130,246,0.6)',
    hoverBorder: 'rgba(59,130,246,0.5)',
    hoverShadow: '0 0 30px rgba(59,130,246,0.15)',
  },
};

const FlowSection = () => {
  return (
    <section id="flow" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It{' '}
            <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From spotting waste to earning rewards — it takes just 4 simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const cs = colorStyles[step.color];
            return (
              <div
                key={index}
                className="step-card relative rounded-2xl p-6 transition-all duration-300 cursor-default group"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(100,116,139,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `1px solid ${cs.hoverBorder}`;
                  e.currentTarget.style.boxShadow = cs.hoverShadow;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(100,116,139,0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Step Number — visible */}
                <div
                  className="absolute top-4 right-4 text-6xl font-black leading-none select-none"
                  style={{ color: cs.numberColor }}
                >
                  {step.number}
                </div>

                {/* Icon Box */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: cs.iconBg.replace('background: ', ''),
                    border: cs.iconBorder,
                    color: cs.iconColor,
                  }}
                >
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-lg mb-2 pr-10">{step.title}</h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>

                {/* Bottom colored line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: cs.iconColor }}
                ></div>

              </div>
            );
          })}
        </div>

        {/* Bottom connector line */}
        <div className="hidden lg:flex justify-center mt-8 gap-2 items-center">
          {steps.map((step, index) => {
            const cs = colorStyles[step.color];
            return (
              <React.Fragment key={index}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: cs.iconColor, color: '#0f172a' }}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-400/50 via-green-400/50 to-blue-400/50 max-w-24"></div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FlowSection;