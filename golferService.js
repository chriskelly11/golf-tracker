// golferService.js
const db = require('./db');

function addGolfer(name, handicap) {
  const stmt = db.prepare('INSERT INTO golfers (name, handicap) VALUES (?, ?)');
  const info = stmt.run(name, handicap);
  return info.lastInsertRowid;
}

function getGolfers() {
  const stmt = db.prepare('SELECT * FROM golfers');
  return stmt.all();
}

function deleteGolfer(id) {
  const stmt = db.prepare('DELETE FROM golfers WHERE id = ?');
  return stmt.run(id);
}

function updateGolfer(id, name, handicap) {
  const stmt = db.prepare('UPDATE golfers SET name = ?, handicap = ? WHERE id = ?');
  return stmt.run(name, handicap, id);
}

module.exports = { addGolfer, getGolfers, deleteGolfer, updateGolfer };