import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { FaBars } from "react-icons/fa";
import logo from "../styles/spot_it_full_logo.png";   // your logo path

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="SpotIt Logo" className="logo-img"/>
        
      </div>

      {/* Hamburger */}
      <div 
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaBars />
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/flow">The Flow</Link></li>
        <li><Link to="/rewards">Reward</Link></li>
      </ul>

      {/* Buttons */}
      <div className="nav-buttons">
        
        <Link to="/register" className="rg-btn">Register</Link>
      </div>

    </nav>
  );
}

export default Navbar;