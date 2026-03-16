import React from 'react';
import Navbar from '../../components/common/Navbar';
import HeroSection from '../../components/landing/HeroSection';
import FlowSection from '../../components/landing/FlowSection';
import AboutSection from '../../components/landing/AboutSection';
import RewardSection from '../../components/landing/RewardSection';
import RecentReports from '../../components/landing/RecentReports';
import Footer from '../../components/common/Footer';

const LandingPage = () => (
  <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d1f3c 50%, #0f172a 100%)' }}>
    <Navbar />
    <HeroSection />
    <AboutSection />
    <FlowSection />
    <RewardSection />
    <RecentReports />
    <Footer />
  </div>
);

export default LandingPage;