import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddGolfer = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [handicap, setHandicap] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!name) return alert("Golfer name is required");
    if (isNaN(handicap) || handicap === '') return alert("Please enter a valid handicap");

    // Send the data to the main Electron process to add golfer to SQLite
    const id = await window.electronAPI.addGolfer(name, parseFloat(handicap));

    // Show success message
    alert(`Golfer added with ID: ${id}`);
    navigate('/manage-golfers');
    
  };

  return (
    <div>
      <button onClick={() => navigate('/')}>← Back to Home</button>
      <button
        type="button"
        onClick={async () => {
          const golfers = await window.electronAPI.getGolfers();
          console.log('Current golfers:', golfers);
        }}
      >
        Log Golfers
      </button>
      <form onSubmit={handleSubmit} style={{ padding: 20 }}>
        <h2>Add Golfer</h2>
        <input
          type="text"
          placeholder="Golfer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Handicap"
          value={handicap}
          onChange={(e) => setHandicap(e.target.value)}
        />
        <button type="submit">Add Golfer</button>
      </form>
    </div>

  );
};

export default AddGolfer;
