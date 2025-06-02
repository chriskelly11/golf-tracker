import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageScores() {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchRounds = async () => {
    console.log('Fetching all rounds...'); // ✅ Debug log
    const response = await window.electronAPI.getAllRounds();
    console.log('Rounds response:', response); // ✅ Check response

    if (response.success) {
      setRounds(response.rounds);
    } else {
      console.error('Failed to load rounds:', response.message);
    }

    setLoading(false);
  };

  fetchRounds();
}, []);

  const handleAddScores = () => {
    navigate('/add-scores');
  };

  const handleEditScores = (roundId) => {
    navigate(`/edit-scores/${roundId}`);
  };

    const handleViewScores = (roundId) => {
    navigate(`/round/${roundId}`);
    };


  return (
    <div style={{ padding: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
            ← Back
        </button>
      <h1>Manage Scores</h1>
      <button onClick={handleAddScores}>➕ Add New Scores</button>

      <h2 style={{ marginTop: '2rem' }}>Existing Rounds</h2>
      {loading ? (
        <p>Loading rounds...</p>
      ) : rounds.length === 0 ? (
        <p>No rounds found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Round ID</th>
              <th>Date</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round) => (
              <tr key={round.id}>
                <td>{round.id}</td>
                <td>{round.round_date}</td>
                <td>{round.course_name}</td>
                <td>
                  <button onClick={() => handleViewScores(round.id)}>👁 View</button>
                  <button onClick={() => handleEditScores(round.id)}>✏️ Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageScores;
