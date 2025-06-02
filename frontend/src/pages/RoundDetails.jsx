import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scorecard from '../components/Scorecard';

function RoundDetails() {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);

  // For score editing (optional, remove if not editing)
  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchRound = async () => {
      setLoading(true);
      const response = await window.electronAPI.getRound(Number(roundId));
      if (response.success) {
        setRound(response.round);

        // Prepare scores in the nested object form for Scorecard
        const scoresObj = {};
        response.round.scores.forEach(({ golfer_id, hole_number, strokes }) => {
          if (!scoresObj[golfer_id]) scoresObj[golfer_id] = {};
          scoresObj[golfer_id][hole_number] = strokes;
        });
        setScores(scoresObj);
      } else {
        alert('Failed to load round details.');
      }
      setLoading(false);
    };
    fetchRound();
  }, [roundId]);

  // Early returns
  if (loading) return <p>Loading round details...</p>;
  if (!round) return <p>Round not found.</p>;
  if (round.scores.length === 0) return <p>No scores recorded for this round.</p>;

  // Extract unique golfers (id + name)
  const golfers = Array.from(
    new Map(
      round.scores.map(score => [score.golfer_id, score.golfer_name])
    ).entries()
  ).map(([id, name]) => ({ id, name }));

  // Extract unique holes with par and handicap info
  // We assume each hole object comes from round.scores, take first occurrence for each hole
  const holeMap = new Map();
  round.scores.forEach(score => {
    if (!holeMap.has(score.hole_number)) {
      holeMap.set(score.hole_number, {
        hole_number: score.hole_number,
        par: score.par ?? '-', // fallback if no par available
        handicap: score.handicap ?? null, // might be undefined
      });
    }
  });
  const courseHoles = Array.from(holeMap.values()).sort((a, b) => a.hole_number - b.hole_number);

  // Optional: handle score changes (if editable)
  const handleScoreChange = (golferId, holeNumber, newVal) => {
    setScores(prev => {
      const newScores = { ...prev };
      if (!newScores[golferId]) newScores[golferId] = {};
      newScores[golferId][holeNumber] = newVal === '' ? '' : parseInt(newVal, 10);
      return newScores;
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Round Details</h1>
      <p><strong>Round ID:</strong> {round.id}</p>
      <p><strong>Date:</strong> {round.round_date}</p>
      <p><strong>Course:</strong> {round.course_name}</p>

      <h2>Scores</h2>

      <Scorecard
        golfers={golfers}
        scores={scores}
        courseHoles={courseHoles}
          courseId={round.course_id}
        editable={false} // set to true if you want editing
        onScoreChange={handleScoreChange}
      />

      <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
        ← Back
      </button>
    </div>
  );
}

export default RoundDetails;
