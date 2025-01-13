import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import f1Logo from '../../assets/f1.png';
import './Navbar.css';

const Navbar = () => {
  const [isDriversDropdownOpen, setDriversDropdownOpen] = useState(false);
  const [isConstructorsDropdownOpen, setConstructorsDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={f1Logo} alt="Formula 1 Logo" className="f1-logo" />
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li
            className="dropdown"
            onMouseEnter={() => setDriversDropdownOpen(true)}
            onMouseLeave={() => setDriversDropdownOpen(false)}
          >
            <Link to="/drivers">Drivers</Link>
            {isDriversDropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/drivers?filter=most-wins">Most Wins</Link></li>
                <li><Link to="/drivers?filter=most-championships">Most Championships</Link></li>
                <li><Link to="/drivers?filter=most-podiums">Most Podiums</Link></li>
                <li><Link to="/drivers?filter=most-fastest-laps">Most Fastest Laps</Link></li>
                <li><Link to="/drivers?filter=most-poles">Most Poles</Link></li>
              </ul>
            )}
          </li>
          <li
            className="dropdown"
            onMouseEnter={() => setConstructorsDropdownOpen(true)}
            onMouseLeave={() => setConstructorsDropdownOpen(false)}
          >
            <Link to="/constructors">Constructors</Link>
            {isConstructorsDropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/constructors?filter=most-wins">Most Wins</Link></li>
                <li><Link to="/constructors?filter=most-championships">Most Championships</Link></li>
                <li><Link to="/constructors?filter=most-points">Most Points</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/standings">Standings</Link></li>
          <li><Link to="/countries">Country</Link></li>
          <li><Link to="/compare-stats">Compare</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <input type="text" placeholder="Search..." className="search-bar" />
        <div className="profile">
          <img src="/path-to-profile-icon.png" alt="Profile Icon" className="profile-icon" />
          <span className="profile-name">Your Name</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;