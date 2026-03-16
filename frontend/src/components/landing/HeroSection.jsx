import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-20">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
          Making India Cleaner, One Spot at a Time
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Spot Waste.
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
            Report It.
          </span>
          <br />
          Earn Rewards.
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          SpotIT is a waste reporting platform where you capture waste images,
          submit location-based reports, and earn points when waste is cleared by our team.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {user ? (
            <Link
              to="/spot-now"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
            >
              Spot Now
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
            >
              Get Started Free
            </Link>
          )}

          <button
            onClick={() => navigate('/#flow')}
            className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-200"
          >
            How It Works
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-400">500+</p>
            <p className="text-slate-400 text-sm mt-1">Reports Filed</p>
          </div>
          <div className="text-center border-x border-slate-700">
            <p className="text-3xl font-bold text-green-400">300+</p>
            <p className="text-slate-400 text-sm mt-1">Areas Cleaned</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">200+</p>
            <p className="text-slate-400 text-sm mt-1">Active Users</p>
          </div>
        </div>

      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <button
          onClick={() => document.getElementById('flow').scrollIntoView({ behavior: 'smooth' })}
          className="bg-transparent border-none cursor-pointer"
        >
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

    </section>
  );
};

export default HeroSection;