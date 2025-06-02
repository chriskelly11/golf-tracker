const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'golf-tracker.db'));

// Create golfers table
db.prepare(`
  CREATE TABLE IF NOT EXISTS golfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    handicap REAL
  )
`).run();

// Create courses table
db.prepare(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    par_out INTEGER,
    par_in INTEGER,
    total_par INTEGER,
    total_yards INTEGER  -- This will store the total yardage for the course
  )
`).run();

// Create course_holes table (only par and yardage per hole now)
db.prepare(`
  CREATE TABLE IF NOT EXISTS course_holes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    hole_number INTEGER,
    par INTEGER,
    handicap INTEGER,  -- Added the handicap column
    FOREIGN KEY(course_id) REFERENCES courses(id)
  )
`).run();

// Create tees table (now stores total yardage for each tee)
db.prepare(`
  CREATE TABLE IF NOT EXISTS tees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    tee_name TEXT NOT NULL,
    slope REAL NOT NULL,
    rating REAL NOT NULL,
    total_yardage INTEGER,   -- This is the total yardage for the tee
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
  )
`).run();

// Create rounds table
db.prepare(`
  CREATE TABLE IF NOT EXISTS rounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    round_date TEXT NOT NULL,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
  )
`).run();

// Create scores table
db.prepare(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    round_id INTEGER NOT NULL,
    golfer_id INTEGER NOT NULL,
    hole_number INTEGER NOT NULL,
    strokes INTEGER NOT NULL,
    FOREIGN KEY(round_id) REFERENCES rounds(id) ON DELETE CASCADE,
    FOREIGN KEY(golfer_id) REFERENCES golfers(id) ON DELETE CASCADE
  )
`).run();

// Add unique index to prevent duplicate scores for same round/golfer/hole
db.prepare(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_scores_round_golfer_hole
  ON scores(round_id, golfer_id, hole_number)
`).run();



module.exports = db;
