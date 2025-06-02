// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: 40 }}>
      <h1>Golf Tracker</h1>
      <p>Welcome! Choose an action below:</p>
      {/* Manage Golfers Link */}
      <Link to="/manage-golfers">
        <button>Manage Golfers</button>
      </Link>
      <button>View Handicaps</button>
      <Link to="/manage-courses">
        <button>Manage Courses</button>
      </Link>
      <Link to="/manage-scores">
        <button>Manage Scores</button>
      </Link>
    </div>
  );
};

export default Home;
