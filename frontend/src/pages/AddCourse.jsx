import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState('');
  const [holeData, setHoleData] = useState(
    Array.from({ length: 18 }, (_, i) => ({
      holeNumber: i + 1,
      par: '',
      handicap: '',
    }))
  );

  const [tees, setTees] = useState([{ name: '', slope: '', rating: '', totalYardage: '' }]);

  const updateHole = (index, field, value) => {
    const updated = [...holeData];
    updated[index][field] = value;
    setHoleData(updated);
  };

  const updateTee = (index, field, value) => {
    const updated = [...tees];
    updated[index][field] = value;
    setTees(updated);
  };

  const addTee = () => {
    setTees([...tees, { name: '', slope: '', rating: '', totalYardage: '' }]);
  };

  const removeTee = (index) => {
    const updated = [...tees];
    updated.splice(index, 1);
    setTees(updated);
  };

  const isFormValid =
    courseName &&
    holeData.length === 18 &&
    holeData.every(h => h.par && h.handicap) &&
    tees.length > 0 &&
    tees.every(t => t.name && t.slope && t.rating && t.totalYardage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let par_out = 0;
    let par_in = 0;
    let total_par = 0;

    holeData.forEach((hole, index) => {
      if (index < 9) {
        par_out += parseInt(hole.par);
      } else {
        par_in += parseInt(hole.par);
      }
      total_par += parseInt(hole.par);
    });

    const holes = holeData.map((h) => ({
      holeNumber: h.holeNumber,
      par: parseInt(h.par),
      handicap: parseInt(h.handicap),
    }));

    const simplifiedTees = tees.map((t) => ({
      name: t.name,
      slope: parseFloat(t.slope),
      rating: parseFloat(t.rating),
      totalYardage: parseInt(t.totalYardage),
    }));

    await window.electronAPI.addCourse({
      name: courseName,
      holes,
      tees: simplifiedTees,
      par_out,
      par_in,
      total_par,
    });

    alert('Course saved successfully!');
    navigate('/manage-courses');
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>← Back</button>
      <h2 style={styles.heading}>Add New Course</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={{ overflowX: 'auto', marginTop: 30 }}>
          <h3 style={styles.subheading}>Scorecard</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}></th>
                {holeData.map((_, i) => (
                  <th key={i} style={styles.th}>Hole {i + 1}</th>
                ))}
                <th style={styles.th}>OUT</th>
                <th style={styles.th}>IN</th>
                <th style={styles.th}>TOTAL</th>
              </tr>
              <tr>
                <td style={styles.tdLabel}>Par</td>
                {holeData.map((hole, idx) => (
                  <td key={idx} style={styles.td}>
                    <input
                      type="number"
                      value={hole.par}
                      onChange={(e) => updateHole(idx, 'par', e.target.value)}
                      style={styles.cellInput}
                    />
                  </td>
                ))}
                <td style={styles.td}>{holeData.slice(0, 9).reduce((sum, hole) => sum + parseInt(hole.par || 0), 0)}</td>
                <td style={styles.td}>{holeData.slice(9, 18).reduce((sum, hole) => sum + parseInt(hole.par || 0), 0)}</td>
                <td style={styles.td}>{holeData.reduce((sum, hole) => sum + parseInt(hole.par || 0), 0)}</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>Handicap</td>
                {holeData.map((hole, idx) => (
                  <td key={idx} style={styles.td}>
                    <input
                      type="number"
                      value={hole.handicap}
                      onChange={(e) => updateHole(idx, 'handicap', e.target.value)}
                      style={styles.cellInput}
                    />
                  </td>
                ))}
                <td style={styles.td}></td>
                <td style={styles.td}></td>
                <td style={styles.td}></td>
              </tr>
            </thead>
          </table>

          <div style={styles.addTeeSection}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Tee Name</th>
                  <th style={styles.th}>Slope</th>
                  <th style={styles.th}>Rating</th>
                  <th style={styles.th}>Total Yardage</th>
                  <th style={styles.th}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {tees.map((tee, teeIndex) => (
                  <tr key={teeIndex}>
                    <td style={styles.td}>
                      <input
                        type="text"
                        value={tee.name}
                        onChange={(e) => updateTee(teeIndex, 'name', e.target.value)}
                        placeholder="Tee Name"
                        style={styles.cellInput}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        value={tee.slope}
                        onChange={(e) => updateTee(teeIndex, 'slope', e.target.value)}
                        placeholder="Slope"
                        style={styles.cellInput}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        value={tee.rating}
                        onChange={(e) => updateTee(teeIndex, 'rating', e.target.value)}
                        placeholder="Rating"
                        style={styles.cellInput}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        value={tee.totalYardage}
                        onChange={(e) => updateTee(teeIndex, 'totalYardage', e.target.value)}
                        placeholder="Total Yardage"
                        style={styles.cellInput}
                      />
                    </td>
                    <td style={styles.td}>
                      <button
                        type="button"
                        onClick={() => removeTee(teeIndex)}
                        disabled={teeIndex === 0}
                        style={{
                          ...styles.removeButton,
                          opacity: teeIndex === 0 ? 0.5 : 1,
                          cursor: teeIndex === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addTee} style={styles.addButton}>Add Tee</button>
            <p style={styles.addTeeText}>Add new tees below and input slope, rating, and total yardage for the course.</p>
          </div>
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            opacity: isFormValid ? 1 : 0.5,
            cursor: isFormValid ? 'pointer' : 'not-allowed'
          }}
          disabled={!isFormValid}
        >
          Save Course
        </button>

        {!isFormValid && (
          <p style={{ color: '#c0392b', marginTop: 10, textAlign: 'center' }}>
            Please complete all 18 holes and at least one tee to enable saving.
          </p>
        )}
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: 40,
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#e5e5e5',
    minHeight: '100vh'
  },
  heading: {
    marginBottom: 10,
    color: '#2c3e50',
    fontSize: '2rem'
  },
  subheading: {
    color: '#34495e',
    marginBottom: 10
  },
  form: {
    width: '100%',
    maxWidth: 1200,
    background: '#fff',
    padding: 30,
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: 30
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    flex: 1
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 20,
    background: '#fcfcfc',
    border: '1px solid #ccc'
  },
  th: {
    padding: '10px',
    backgroundColor: '#f8f8f8',
    fontWeight: '600',
    textAlign: 'center',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  td: {
    border: '1px solid #ddd',
    padding: '6px',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  tdLabel: {
    fontWeight: 'bold',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center'
  },
  cellInput: {
    width: '100px',
    padding: '6px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textAlign: 'center'
  },
  button: {
    marginTop: 30,
    padding: '12px 24px',
    background: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    alignSelf: 'center'
  },
  backButton: {
    marginBottom: 20,
    padding: '8px 16px',
    borderRadius: 6,
    border: '1px solid #ccc',
    background: '#f7f7f7',
    cursor: 'pointer'
  },
  addTeeSection: {
    marginTop: '20px',
    marginBottom: '20px',
    width: '100%',
    textAlign: 'center'
  },
  addButton: {
    marginTop: '20px',
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '6px'
  },
  addTeeText: {
    marginTop: '10px',
    fontSize: '14px'
  },
  removeButton: {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    marginLeft: 5,
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default AddCourse;
