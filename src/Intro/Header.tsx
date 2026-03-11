import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import ringIcon from "../assets/rings.png";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="wems-header">
      <div className="header-container">

        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={ringIcon} alt="WEMS" className="logo-icon" />
          <span className="logo-text">WEMS</span>
        </Link>

        {/* Burger Button */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
        </button>

        {/* Navigation */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="#top"onClick={closeMenu}>Home</a>
          <a href="#recent" onClick={closeMenu}>Recent Weddings</a>
          <a href="#features" onClick={closeMenu}>Features</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>

          <Link to="/login" className="login-btn" onClick={closeMenu}>
            Login
          </Link>
        </nav>

      </div>
    </header>
  );
};

export default Header;