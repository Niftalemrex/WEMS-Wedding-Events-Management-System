import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="wems-footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-about">
          <h3>About WEMS</h3>
          <p>
            WEMS (Wedding Event Management System) helps couples plan their
            dream weddings effortlessly. Manage guests, vendors, timelines, and
            more in one elegant dashboard.
          </p>
          <div className="footer-social">
            <a href="#" className="social-icon" aria-label="Facebook">📘</a>
            <a href="#" className="social-icon" aria-label="Instagram">📷</a>
            <a href="#" className="social-icon" aria-label="Twitter">🐦</a>
            <a href="#" className="social-icon" aria-label="Pinterest">📌</a>
          </div>
        </div>

        {/* Contact Section with updated details */}
        <div className="footer-contact" id="contact">
          <h3>Contact Us</h3>
          <ul className="contact-list">
            <li>
              <span className="contact-icon">📧</span>
              <a href="mailto:Niftalemawe@gmail.com">Niftalemawe@gmail.com</a>
            </li>
            <li>
              <span className="contact-icon">📞</span>
              <a href="tel:+251939193603">+251 939 193 603</a>
            </li>
            <li>
              <span className="contact-icon">📍</span>
              <span>Addis Ababa, Ethiopia</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
          <li><a href="#top">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#recent">Recent Weddings</a></li>
            <li><a href="#about">About Us</a></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="footer-newsletter">
          <h3>Stay Updated</h3>
          <p>Subscribe for wedding tips and inspiration</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
         
          
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} WEMS. All rights reserved. Crafted with 💒 in Ethiopia.</p>
      </div>
    </footer>
  );
};

export default Footer;