// frontend/src/components/Wrapper.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Wrapper = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div style={styles.outer}>
      <div style={styles.backButtonContainer}>
        <button 
          onClick={() => navigate(-1)} 
          style={styles.backButton}
        >
          ← Back
        </button>
      </div>

      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.scrollWrapper}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  outer: {
    backgroundColor: '#e5e5e5',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    overflow: 'hidden', // Prevent overflow in outer container
  },
  container: {
    width: '1800px', // Fixed width
    height: '700px', // Fixed height
    overflow: 'hidden', // Prevent container from growing
  },
  content: {
    background: '#fff',
    borderRadius: '12px',
    padding: '30px',
    height: '100%',  // Full height of container
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',  // Prevent overflow of content
  },
  scrollWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'auto',   // Allow scrolling inside if content exceeds
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: '20px',
  },
  backButton: {
    padding: '8px 16px',
    borderRadius: 6,
    border: '1px solid #ccc',
    background: '#f7f7f7',
    cursor: 'pointer',
  },
};

export default Wrapper;
