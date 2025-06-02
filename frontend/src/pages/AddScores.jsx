import React, { useEffect, useState } from 'react';
import Wrapper from '../components/Wrapper';

const AddScores = () => {
  const [courses, setCourses] = useState([]);
  const [golfers, setGolfers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseHoles, setCourseHoles] = useState([]);
  const [roundDate, setRoundDate] = useState('');
  const [activeGolfers, setActiveGolfers] = useState({});
  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      const courseList = await window.electronAPI.getCourses();
      const golferList = await window.electronAPI.getGolfers();
      setCourses(courseList);
      setGolfers(golferList);
    };
    fetchInitialData();
  }, []);

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setCourseHoles([]);

    if (courseId) {
      const holesResponse = await window.electronAPI.getCourseHoles(courseId);
      const holes = holesResponse?.holes || [];
      const sorted = [...holes].sort((a, b) => a.hole_number - b.hole_number);
      setCourseHoles(sorted);
    }
  };

  const toggleGolferActive = (golferId) => {
    setActiveGolfers((prev) => ({
      ...prev,
      [golferId]: !prev[golferId],
    }));
  };

  const handleScoreChange = (golferId, holeNumber, value) => {
    setScores((prev) => ({
      ...prev,
      [golferId]: {
        ...prev[golferId],
        [holeNumber]: value,
      },
    }));
  };

  const calculateTotal = (holeNumbers, golferId) => {
    return holeNumbers.reduce((sum, num) => sum + (parseInt(scores[golferId]?.[num]) || 0), 0);
  };

  const handleSubmit = async () => {
    console.log("roundDate" + roundDate);
    const payload = {
      courseId: selectedCourse,
      roundDate,
      scores: Object.entries(scores)
        .filter(([golferId]) => activeGolfers[golferId])
        .map(([golferId, holeScores]) => ({
          golferId: parseInt(golferId),
          scores: holeScores,
        })),
    };

    try {
      await window.electronAPI.submitScores(payload);
      alert('Scores submitted successfully!');
      // Optionally clear form state here:
      setScores({});
      setActiveGolfers({});
      setSelectedCourse('');
      setCourseHoles([]);
      setRoundDate('');
    } catch (err) {
      console.error('Error submitting scores:', err);
      alert('Failed to submit scores. Please try again.');
    }
  };

  const allScoresValid = () => {
    return Object.entries(activeGolfers)
      .filter(([_, isActive]) => isActive)
      .every(([golferId]) => {
        const golferScores = scores[golferId];
        if (!golferScores) return false;
        return [...Array(18).keys()].every(i => {
          const val = golferScores[i + 1];
          return val && /^\d+$/.test(val) && parseInt(val) > 0;
        });
      });
  };


  return (
    <Wrapper>
      <h2 style={styles.heading}>Add Scores</h2>

      <div style={styles.inputRow}>
        <label>Course:&nbsp;
          <select value={selectedCourse} onChange={handleCourseChange} style={styles.select}>
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </label>
        &nbsp;&nbsp;
        <label>Date:&nbsp;
          <input
            type="date"
            value={roundDate}
            onChange={(e) => setRoundDate(e.target.value)}
            style={styles.input}
          />
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 style={styles.subheading}>Golfers</h3>
        {golfers.map((golfer) => (
          <div key={golfer.id}>
            <label>
              <input
                type="checkbox"
                checked={!!activeGolfers[golfer.id]}
                onChange={() => toggleGolferActive(golfer.id)}
                style={styles.checkbox}
              />
              &nbsp;{golfer.name} (Hdcp: {golfer.handicap})
            </label>
          </div>
        ))}
      </div>

      {selectedCourse && courseHoles.length === 18 && (
        <div style={{ overflowX: 'auto', marginTop: 30 }}>
          <h3 style={styles.subheading}>Scorecard</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Hole</th>
                {[...Array(9)].map((_, i) => (
                  <th key={`hole-${i + 1}`} style={styles.th}>{i + 1}</th>
                ))}
                <th style={styles.th}>Front</th>
                {[...Array(9)].map((_, i) => (
                  <th key={`hole-${i + 10}`} style={styles.th}>{i + 10}</th>
                ))}
                <th style={styles.th}>Back</th>
                <th style={styles.th}>Total</th>
              </tr>
              <tr>
                <th style={styles.th}>Par</th>
                {[...Array(9)].map((_, i) => (
                  <th key={`par-${i}`} style={styles.th}>{courseHoles[i].par}</th>
                ))}
                <th style={styles.th}></th>
                {[...Array(9)].map((_, i) => (
                  <th key={`par-${i + 9}`} style={styles.th}>{courseHoles[i + 9].par}</th>
                ))}
                <th style={styles.th}></th>
                <th style={styles.th}></th>
              </tr>
              <tr>
                <th style={styles.th}>Handicap</th>
                {[...Array(9)].map((_, i) => (
                  <th key={`hcp-${i}`} style={styles.th}>{courseHoles[i].handicap}</th>
                ))}
                <th style={styles.th}></th>
                {[...Array(9)].map((_, i) => (
                  <th key={`hcp-${i + 9}`} style={styles.th}>{courseHoles[i + 9].handicap}</th>
                ))}
                <th style={styles.th}></th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {golfers.filter(g => activeGolfers[g.id]).map(golfer => (
                <tr key={golfer.id}>
                  <td style={styles.td}>{golfer.name}</td>
                  {[...Array(9)].map((_, i) => {
                    const value = scores[golfer.id]?.[i + 1] || '';
                    const par = courseHoles[i].par;
                    const numericScore = parseInt(value);
                    const diff = numericScore - par;
                    const isBirdie = diff === -1;
                    const isEagleOrBetter = diff <= -2;
                    return (
                      <td key={`score-${i + 1}`} style={styles.td}>
                        <input
                          type="number"
                          min="1"
                          style={{
                            ...styles.cellInput,
                            ...(isBirdie ? styles.birdie : {}),
                            ...(isEagleOrBetter ? styles.eagle : {}),
                            ...(numericScore > par ? styles.bogey : {})

                          }}
                          value={value}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (newValue === '' || parseInt(newValue) >= 1) {
                              handleScoreChange(golfer.id, i + 1, newValue);
                            }
                          }}
                        />
                      </td>
                    );
                  })}
                  <td style={styles.td}>{calculateTotal([1,2,3,4,5,6,7,8,9], golfer.id)}</td>
                  {[...Array(9)].map((_, i) => {
                    const value = scores[golfer.id]?.[i + 10] || '';
                    const par = courseHoles[i + 9].par;
                    const numericScore = parseInt(value);
                    const diff = numericScore - par;
                    const isBirdie = diff === -1;
                    const isEagleOrBetter = diff <= -2;
                    return (
                      <td key={`score-${i + 10}`} style={styles.td}>
                        <input
                          type="number"
                          min="1"
                          style={{
                            ...styles.cellInput,
                            ...(isBirdie ? styles.birdie : {}),
                            ...(isEagleOrBetter ? styles.eagle : {}),
                            ...(numericScore > par ? styles.bogey : {})

                          }}
                          value={value}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (newValue === '' || parseInt(newValue) >= 1) {
                              handleScoreChange(golfer.id, i + 10, newValue);
                            }
                          }}
                        />
                      </td>
                    );
                  })}
                  <td style={styles.td}>{calculateTotal([10,11,12,13,14,15,16,17,18], golfer.id)}</td>
                  <td style={styles.td}>{calculateTotal([...Array(18).keys()].map(n => n + 1), golfer.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        disabled={!roundDate || !allScoresValid()}
        onClick={handleSubmit}
        style={{
          ...styles.button,
          background: !roundDate || !allScoresValid() ? '#ccc' : '#2ecc71',
          cursor: !roundDate || !allScoresValid() ? 'not-allowed' : 'pointer',
        }}
      >
        Submit Scores
      </button>
    </Wrapper>
  );
};

const styles = {
  heading: {
    marginBottom: 10,
    color: '#2c3e50',
    fontSize: '2rem'
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: 30
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px'
  },
  subheading: {
    color: '#34495e',
    marginBottom: 10
  },
  checkbox: {
    marginRight: '10px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fcfcfc',
    border: '1px solid #ccc'
  },
  th: {
    padding: '14px',
    backgroundColor: '#f8f8f8',
    fontWeight: '600',
    textAlign: 'center',
    border: '1px solid #ddd',
    fontSize: '14px',
    whiteSpace: 'nowrap'
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#fff'
  },
  cellInput: {
    width: '50px',
    padding: '6px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textAlign: 'center'
  },
  birdie: {
    backgroundColor: '#27ae60',
    color: '#fff',
    borderRadius: '50%',
    fontWeight: 'bold'
  },
  eagle: {
    border: '2px double #000',
    borderRadius: '50%',
    fontWeight: 'bold'
  },
  button: {
    marginTop: 30,
    padding: '12px 24px',
    background: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    alignSelf: 'center'
  },
  bogey: {
  backgroundColor: '#e74c3c', // red
  color: '#fff',
  fontWeight: 'bold'
},
};

export default AddScores;
