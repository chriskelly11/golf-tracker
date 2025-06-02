const db = require('./db');  // Database connection

function addCourse(courseData) {
    const { name, holes, tees, par_out, par_in, total_par, total_yards } = courseData;

    // Insert into courses table
    const stmt = db.prepare('INSERT INTO courses (name, par_out, par_in, total_par, total_yards) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(name, par_out, par_in, total_par, total_yards);
    const courseId = result.lastInsertRowid;

    // Insert into course_holes table with handicap
    holes.forEach(hole => {
        const holeStmt = db.prepare('INSERT INTO course_holes (course_id, hole_number, par, handicap) VALUES (?, ?, ?, ?)');
        holeStmt.run(courseId, hole.holeNumber, hole.par, hole.handicap);  // Now including the handicap
    });

    // Insert into tees table
    tees.forEach(tee => {
        const teeStmt = db.prepare('INSERT INTO tees (course_id, tee_name, slope, rating, total_yardage) VALUES (?, ?, ?, ?, ?)');
        teeStmt.run(courseId, tee.name, tee.slope, tee.rating, tee.totalYardage);
    });

    return { success: true, message: 'Course added successfully', courseId };
}


// Get all courses and their tees
function getCourses() {
    const courses = db.prepare('SELECT * FROM courses').all();

    courses.forEach(course => {
        const tees = db.prepare('SELECT * FROM tees WHERE course_id = ?').all(course.id);
        course.tees = tees;
    });

    return courses;
}

// Get holes for a specific course
function getCourseHoles(courseId) {
    return db.prepare('SELECT * FROM course_holes WHERE course_id = ? ORDER BY hole_number ASC').all(courseId);
}

// Update a course
function updateCourse(id, courseData) {
    const { name, holes, tees, par_out, par_in, total_par, total_yards } = courseData;

    const stmt = db.prepare('UPDATE courses SET name = ?, par_out = ?, par_in = ?, total_par = ?, total_yards = ? WHERE id = ?');
    stmt.run(name, par_out, par_in, total_par, total_yards, id);

    holes.forEach(hole => {
        const holeStmt = db.prepare('UPDATE course_holes SET par = ? WHERE course_id = ? AND hole_number = ?');
        holeStmt.run(hole.par, id, hole.holeNumber);
    });

    tees.forEach(tee => {
        const teeStmt = db.prepare('UPDATE tees SET tee_name = ?, slope = ?, rating = ?, total_yardage = ? WHERE course_id = ? AND tee_name = ?');
        teeStmt.run(tee.name, tee.slope, tee.rating, tee.totalYardage, id, tee.name);
    });

    return { success: true, message: 'Course updated successfully' };
}

// Delete a course
const deleteCourse = (courseId) => {
    const stmt = db.prepare('PRAGMA foreign_keys = ON');
    stmt.run();

    const deleteTeesStmt = db.prepare('DELETE FROM tees WHERE course_id = ?');
    deleteTeesStmt.run(courseId);

    // const deleteRoundsStmt = db.prepare('DELETE FROM rounds WHERE course_id = ?');
    // deleteRoundsStmt.run(courseId);

    const deleteCourseStmt = db.prepare('DELETE FROM courses WHERE id = ?');
    deleteCourseStmt.run(courseId);
};

module.exports = { addCourse, getCourses, getCourseHoles, updateCourse, deleteCourse };
