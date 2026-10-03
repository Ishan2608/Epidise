import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isForDoctorsActive = location.pathname.startsWith('/for-doctors');

  return (
    <>
      <nav className="txt-md">
        {/* Left Part - Logo */}
        <div className="logo-container mid-center">
          <Link id="nav-logo" to="/">
            <img src="/assets/logo.svg" alt="Epidise Logo" />
          </Link>
        </div>

        {/* Middle Part - Navigation Links (4 Options) */}
        <div className="menu">
          <ul>
            <li className="menu-item">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/contact" className="nav-link">Contact Us</NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/discover" className="nav-link">Discover</NavLink>
            </li>
            <li className="menu-item">
              <Link to="/for-doctors" className={isForDoctorsActive ? 'nav-link active' : 'nav-link'}>For Doctors</Link>
            </li>
          </ul>
        </div>

        {/* Right Part - External Partner Form Button and Hamburger */}
        <div className="wrapper flex-row-even-stretch">
          <div id="m-partner-up-cont">
            <a href="https://forms.gle/HB9g4WkWFZyjuMmm7" target="_blank" rel="noopener noreferrer">
              <button id="m-partner-up" className="txt-md partner-up">
                Partner Up
              </button>
            </a>
          </div>

          <div className="hamburger" id="hamburger" onClick={toggleMenu}>
            <div className="wrapper mid-center">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div
        className={`body-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      ></div>

      <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <span className="close-btn" onClick={toggleMenu}>&times;</span>
        </div>
        <ul className="mobile-nav-menu">
          <li className="menu-item">
            <NavLink to="/" className="nav-link" onClick={toggleMenu}>Home</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/contact" className="nav-link" onClick={toggleMenu}>Contact Us</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/discover" className="nav-link" onClick={toggleMenu}>Discover</NavLink>
          </li>
          <li className="menu-item">
            <Link to="/for-doctors" className={isForDoctorsActive ? 'nav-link active' : 'nav-link'} onClick={toggleMenu}>For Doctors</Link>
          </li>
          <li className="menu-item" style={{ marginTop: '10px' }}>
            <a
              href="https://forms.gle/HB9g4WkWFZyjuMmm7"
              target="_blank"
              rel="noopener noreferrer"
              className="partner-up"
              onClick={toggleMenu}
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              Partner Up
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
