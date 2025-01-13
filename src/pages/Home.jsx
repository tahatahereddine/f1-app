import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="container">
      <div className="hero">
        <div className="overlay">
          <h1>Welcome to F1 Hub</h1>
          <p>Your Ultimate Formula 1 Information Center</p>
          <div className="cta">
            <Link to="/drivers" className="button">View Drivers</Link>
            <Link to="/standings" className="button">Current Standings</Link>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="feature">
          <h2>Drivers</h2>
          <p>Explore detailed profiles of F1 drivers past and present</p>
        </div>
        <div className="feature">
          <h2>Teams</h2>
          <p>Learn about the competing constructors and their history</p>
        </div>
        <div className="feature">
          <h2>Compare</h2>
          <p>Compare the stats and achievements of your favorite drivers and teams</p>
        </div>
      </div>
    </div>
  );
};

export default Home;