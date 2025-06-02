import React, { useEffect, useState } from 'react';
import Wrapper from '../components/Wrapper';
import { FaTrash, FaEdit, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [expandedCourseIds, setExpandedCourseIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesList = await window.electronAPI.getCourses();
      setCourses(coursesList);
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    await window.electronAPI.deleteCourse(id);
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const toggleExpand = (id) => {
    setExpandedCourseIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  return (
    <Wrapper>
      <h2>Manage Courses</h2>
      {courses.length === 0 ? (
        <div>No Courses in DB. Click "Add Course" to add a new course.</div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            padding: '10px',
            borderBottom: '2px solid #ccc',
            fontWeight: 'bold',
            textAlign: 'left'
          }}>
            <div>Course Name</div>
            <div>Total Par</div>
            <div>Tees</div>
            <div>Actions</div>
          </div>
          {courses.map(course => (
            <div key={course.id}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #eee',
                textAlign: 'left'
              }}>
                <div>{course.name}</div>
                <div>{course.total_par}</div>
                <div>
                  <button 
                    onClick={() => toggleExpand(course.id)} 
                    style={{ 
                      border: '1px solid #ccc', 
                      background: '#e0e0e0', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: '6px'
                    }}
                  >
                    {expandedCourseIds.includes(course.id) ? <FaChevronUp /> : <FaChevronDown />}
                    <span style={{ marginLeft: 6 }}>
                      {expandedCourseIds.includes(course.id) ? 'Hide Tees' : 'View Tees'}
                    </span>
                  </button>
                </div>
                <div>
                  <button onClick={() => navigate(`/edit-course/${course.id}`)}><FaEdit /></button>
                  <button onClick={() => handleDelete(course.id)} disabled style={{ marginLeft: 10 }}><FaTrash /></button>
                </div>
              </div>
              {expandedCourseIds.includes(course.id) && (
                <div style={{
                  padding: '10px 20px',
                  background: '#f9f9f9',
                  borderLeft: '3px solid #27ae60',
                  textAlign: 'left'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    fontWeight: 'bold',
                    marginBottom: 8,
                    textAlign: 'left'
                  }}>
                    <div>Tee Name</div>
                    <div>Slope</div>
                    <div>Rating</div>
                    <div>Total Yardage</div>
                  </div>
                  {course.tees.map(tee => (
                    <div 
                      key={tee.id} 
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr 1fr', 
                        padding: '6px 0',
                        borderTop: '1px solid #eee',
                        textAlign: 'left'
                      }}
                    >
                      <div>{tee.tee_name}</div>
                      <div>{tee.slope}</div>
                      <div>{tee.rating}</div>
                      <div>{tee.total_yardage}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button 
        onClick={() => navigate('/add-course')}
        style={{ marginTop: 20, padding: '12px 24px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px' }}
      >
        Add Course
      </button>
    </Wrapper>
  );
};

export default ManageCourses;
