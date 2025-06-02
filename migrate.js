const db = require('./db');  // Database connection

// Run migration to update courses table schema
function migrate() {
  db.prepare('ALTER TABLE courses ADD COLUMN par_out INTEGER').run();
  db.prepare('ALTER TABLE courses ADD COLUMN par_in INTEGER').run();
  db.prepare('ALTER TABLE courses ADD COLUMN total_par INTEGER').run();
  db.prepare('ALTER TABLE courses ADD COLUMN total_yards INTEGER').run();

  console.log('Migration completed: courses table updated');
}

migrate();
