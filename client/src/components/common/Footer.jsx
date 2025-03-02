import React from "react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h6 className="footer-heading">About InkFlow</h6>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Our Story</a></li>
              <li><a href="#" className="footer-link">Team</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
              <li><a href="#" className="footer-link">Press</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h6 className="footer-heading">Resources</h6>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Writing Tips</a></li>
              <li><a href="#" className="footer-link">Style Guide</a></li>
              <li><a href="#" className="footer-link">Community Guidelines</a></li>
              <li><a href="#" className="footer-link">Support Center</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h6 className="footer-heading">Legal</h6>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Cookie Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h6 className="footer-heading">Connect</h6>
            <ul className="footer-links">
              <li><a href="mailto:contact@inkflow.com" className="footer-link">contact@inkflow.com</a></li>
              <li><a href="#" className="footer-link">Twitter</a></li>
              <li><a href="#" className="footer-link">LinkedIn</a></li>
              <li><a href="#" className="footer-link">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} InkFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;