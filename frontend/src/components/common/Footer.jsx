import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#080d1a] border-t border-slate-700/30">

      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="grid md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#fb923c,#4ade80,#60a5fa)" }}
              >
                <span className="text-white font-bold text-sm">S</span>
              </div>

              <span className="text-lg font-bold bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                SpotIT
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Capture waste images and submit location-based reports to help
              keep our environment clean.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              Quick Links
            </h4>

            <ul className="space-y-1 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-orange-400">Home</Link></li>
              <li><a href="/#about" className="text-slate-400 hover:text-green-400">About</a></li>
              <li><a href="/#rewards" className="text-slate-400 hover:text-orange-400">Rewards</a></li>
              <li><Link to="/register" className="text-slate-400 hover:text-blue-400">Register</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-orange-400">Login</Link></li>
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              How It Works
            </h4>

            <ul className="space-y-1 text-sm text-slate-400">
              <li>1. Capture waste image</li>
              <li>2. Admin verifies report</li>
              <li>3. Worker cleans waste</li>
              <li>4. Earn reward points</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700/30 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">

          <p>© {new Date().getFullYear()} SpotIT. All rights reserved.</p>

          <p>
            Made with <span className="text-red-400">♥</span> for a cleaner environment 🌱
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;