// frontend/src/pages/EditGolfer.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditGolfer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [handicap, setHandicap] = useState('');

  useEffect(() => {
    const loadGolfer = async () => {
      const golfers = await window.electronAPI.getGolfers();
      const golfer = golfers.find(g => g.id === parseInt(id));
      if (golfer) {
        setName(golfer.name);
        setHandicap(golfer.handicap);
      } else {
        alert('Golfer not found');
        navigate('/manage-golfers');
      }
    };
    loadGolfer();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert('Golfer name is required');
    if (isNaN(handicap) || handicap === '') return alert('Please enter a valid handicap');

    await window.electronAPI.updateGolfer(parseInt(id), name, parseFloat(handicap));
    alert('Golfer updated successfully!');
    navigate('/manage-golfers');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Edit Golfer</h2>
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
      <button type="submit">Update Golfer</button>
      <button type="button" onClick={() => navigate('/manage-golfers')} style={{ marginLeft: 10 }}>
        Cancel
      </button>
    </form>
  );
};

export default EditGolfer;
