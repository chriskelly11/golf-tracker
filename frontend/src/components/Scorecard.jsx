import React, { useEffect, useState } from 'react';

function Scorecard({
  golfers,
  scores,
  courseHoles: propCourseHoles,
  editable = false,
  onScoreChange,
  courseId,
}) {
  const [courseHoles, setCourseHoles] = useState(propCourseHoles || []);

  useEffect(() => {
    if (courseId) {
      async function fetchCourseHoles() {
        try {
          const response = await window.electronAPI.getCourseHoles(courseId);
          if (response.success) {
            setCourseHoles(response.holes.sort((a, b) => a.hole_number - b.hole_number));
          } else {
            console.error('Failed to fetch course holes');
          }
        } catch (err) {
          console.error('Error fetching course holes:', err);
        }
      }
      fetchCourseHoles();
    }
  }, [courseId]);

  if (!courseHoles || courseHoles.length === 0) return null;

  const holesSorted = [...courseHoles];
  const frontNine = holesSorted.slice(0, 9);
  const backNine = holesSorted.slice(9, 18);

  const calculateTotal = (holeArray, golferId) => {
    return holeArray.reduce((sum, hole) => {
      const val = scores?.[golferId]?.[hole.hole_number];
      return sum + (val ? parseInt(val) : 0);
    }, 0);
  };

  const renderScoreCell = (golfer, hole) => {
    const val = scores?.[golfer.id]?.[hole.hole_number] || '';
    const numericScore = parseInt(val);
    const diff = numericScore - hole.par;
    const isBirdie = diff === -1;
    const isEagleOrBetter = diff <= -2;
    const isBogey = diff === 1;
    const isDoubleBogeyOrWorse = diff >= 2;

    let bgColor = '#fff';
    let border = '1px solid #ccc';
    let color = '#000';

    if (isEagleOrBetter) {
      bgColor = '#000';
      border = '2px double #000';
      color = '#fff';
    } else if (isBirdie) {
      bgColor = '#27ae60';
      color = '#fff';
    } else if (isBogey) {
      bgColor = '#e74c3c';
      color = '#fff';
      border = '2px solid #e74c3c'; // single red border for bogey
    } else if (isDoubleBogeyOrWorse) {
      bgColor = '#fff';
      color = '#e74c3c';
      border = '4px double #e74c3c'; // double square border for double bogey or worse
    }

    const content = editable ? (
      <input
        type="number"
        min="1"
        value={val}
        onChange={(e) => {
          const newVal = e.target.value;
          if (newVal === '' || parseInt(newVal) >= 1) {
            onScoreChange && onScoreChange(golfer.id, hole.hole_number, newVal);
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: 'transparent',
          color,
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center',
          outline: 'none',
        }}
        onFocus={(e) => e.target.select()}
      />
    ) : (
      <span style={{ color }}>{val || '-'}</span>
    );

    return (
      <td key={hole.hole_number} style={styles.td}>
        <div
          style={{
            width: 44,       // Increased size for double square border
            height: 44,
            borderRadius: isEagleOrBetter || isBirdie ? '50%' : '4px', // circle for eagle/birdie, rounded squares for others
            backgroundColor: bgColor,
            border,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
            fontWeight: 'bold',
            fontSize: '14px',
            userSelect: 'none',
          }}
        >
          {content}
        </div>
      </td>
    );
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Golfer</th>
            {frontNine.map((h) => (
              <th key={h.hole_number} style={styles.th}>Hole {h.hole_number}</th>
            ))}
            <th style={styles.th}>Front</th>
            {backNine.map((h) => (
              <th key={h.hole_number} style={styles.th}>Hole {h.hole_number}</th>
            ))}
            <th style={styles.th}>Back</th>
            <th style={styles.th}>Total</th>
          </tr>
          <tr>
            <th style={styles.parTh}>Par</th>
            {frontNine.map((h) => (
              <th key={h.hole_number} style={styles.parTh}>{h.par}</th>
            ))}
            <th style={styles.th}></th>
            {backNine.map((h) => (
              <th key={h.hole_number} style={styles.parTh}>{h.par}</th>
            ))}
            <th style={styles.th}></th>
            <th style={styles.th}></th>
          </tr>
          {holesSorted.some((h) => h.handicap !== undefined && h.handicap !== null) && (
            <tr>
              <th style={styles.th}>Handicap</th>
              {frontNine.map((h) => (
                <th key={h.hole_number} style={styles.th}>{h.handicap ?? ''}</th>
              ))}
              <th style={styles.th}></th>
              {backNine.map((h) => (
                <th key={h.hole_number} style={styles.th}>{h.handicap ?? ''}</th>
              ))}
              <th style={styles.th}></th>
              <th style={styles.th}></th>
            </tr>
          )}
        </thead>
        <tbody>
          {golfers.map((golfer) => (
            <tr key={golfer.id}>
              <td style={styles.nameTd}>{golfer.name}</td>
              {frontNine.map((h) => renderScoreCell(golfer, h))}
              <td style={styles.totalTd}>{calculateTotal(frontNine, golfer.id)}</td>
              {backNine.map((h) => renderScoreCell(golfer, h))}
              <td style={styles.totalTd}>{calculateTotal(backNine, golfer.id)}</td>
              <td style={styles.totalTd}>{calculateTotal(holesSorted, golfer.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fcfcfc',
    border: '1px solid #ccc',
  },
  th: {
    padding: '12px',
    backgroundColor: '#f4f4f4',
    fontWeight: '600',
    textAlign: 'center',
    border: '1px solid #ddd',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  parTh: {
    padding: '10px',
    backgroundColor: '#e9f7ef',
    fontWeight: '600',
    textAlign: 'center',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  nameTd: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#fff',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  totalTd: {
    border: '1px solid #ddd',
    padding: '8px',
    fontWeight: '600',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
};

export default Scorecard;
