import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const ManageGolfers = () => {
  const [golfers, setGolfers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGolfers = async () => {
      const list = await window.electronAPI.getGolfers();
      setGolfers(list);
    };
    loadGolfers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this golfer?")) return;
    await window.electronAPI.deleteGolfer(id);
    setGolfers((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '90%' }}> {/* 90% width for better space */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <Link to="/" style={homeLinkStyle}>🏠 Home</Link>
        </div>
        <h2 style={{ marginBottom: '20px' }}>Manage Golfers</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={headerRow}>
              <th style={headerCellStyle}>Name</th>
              <th style={headerCellStyle}>Handicap</th>
              <th style={headerCellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {golfers.map((golfer, idx) => (
              <tr key={golfer.id} style={idx % 2 === 0 ? rowEven : rowOdd}>
                <td style={cellStyle}>{golfer.name}</td>
                <td style={cellStyle}>{golfer.handicap}</td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>
                  <div style={buttonContainer}>
                    <button
                      onClick={() => navigate(`/edit-golfer/${golfer.id}`)}
                      title="Edit"
                      style={iconButton}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(golfer.id)}
                      title="Delete"
                      style={{ ...iconButton, marginLeft: '10px' }}
                    >
                      <FaTrash color="#c0392b" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/add-golfer')}
            style={addGolferButtonStyle}
          >
            Add New Golfer
          </button>
        </div>
      </div>
    </div>
  );
};

// 🧾 Style objects
const homeLinkStyle = {
  fontSize: '16px',
  color: '#3498db',
  textDecoration: 'none',
  fontWeight: 'bold',
  padding: '10px 15px',
  borderRadius: '4px',
  backgroundColor: '#ecf0f1',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'Arial, sans-serif',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #ddd'
};

const headerRow = {
  backgroundColor: '#f4f4f4'
};

const headerCellStyle = {
  padding: '12px 16px',
  border: '1px solid #ddd',
  fontWeight: 'bold',
  textAlign: 'left',  // Ensuring left alignment for the header
  minWidth: '150px'  // Set a minimum width to prevent the columns from being too narrow
};

const cellStyle = {
  padding: '12px 16px',
  border: '1px solid #ddd',
  textAlign: 'left',  // Ensuring left alignment for the cell data
  wordWrap: 'break-word'  // Ensure long names don't overflow
};

const rowEven = {
  backgroundColor: '#fff'
};

const rowOdd = {
  backgroundColor: '#f9f9f9'
};

const iconButton = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px'
};

const buttonContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px'  // Spacing between the buttons
};

const addGolferButtonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

export default ManageGolfers;
