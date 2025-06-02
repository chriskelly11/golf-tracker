// roundService.js
const db = require('./db');

function saveRoundWithScores({ courseId, roundDate, scores }) {
  const insertRound = db.prepare(`
    INSERT INTO rounds (course_id, round_date) VALUES (?, ?)
  `);
  const insertScore = db.prepare(`
    INSERT INTO scores (round_id, golfer_id, hole_number, strokes)
    VALUES (?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    const roundResult = insertRound.run(courseId, roundDate);
    const roundId = roundResult.lastInsertRowid;

    for (const { golferId, scores: holeScores } of scores) {
      for (const [holeNumberStr, strokesStr] of Object.entries(holeScores)) {
        const holeNumber = parseInt(holeNumberStr);
        const strokes = parseInt(strokesStr);
        if (!Number.isInteger(strokes)) continue;
        insertScore.run(roundId, golferId, holeNumber, strokes);
      }
    }

    return roundId;
  });

  return transaction();
}

function getRound(roundId) {
  const round = db.prepare(`
    SELECT r.id, r.course_id, r.round_date, c.name as course_name
    FROM rounds r
    JOIN courses c ON r.course_id = c.id
    WHERE r.id = ?
  `).get(roundId);

  if (!round) return null;

  const scores = db.prepare(`
    SELECT s.golfer_id, s.hole_number, s.strokes, g.name as golfer_name
    FROM scores s
    JOIN golfers g ON s.golfer_id = g.id
    WHERE s.round_id = ?
  `).all(roundId);

  return { ...round, scores };
}

function updateRound(roundId, { courseId, roundDate }) {
  return db.prepare(`
    UPDATE rounds
    SET course_id = ?, round_date = ?
    WHERE id = ?
  `).run(courseId, roundDate, roundId);
}

function updateScores(roundId, scores) {
  // scores: array of { golferId, holeNumber, strokes }
  const insert = db.prepare(`
    INSERT INTO scores (round_id, golfer_id, hole_number, strokes)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(round_id, golfer_id, hole_number) DO UPDATE SET strokes=excluded.strokes
  `);
  const insertMany = db.transaction((scores) => {
    for (const s of scores) {
      insert.run(roundId, s.golferId, s.holeNumber, s.strokes);
    }
  });
  insertMany(scores);
}

function getAllRounds() {
  return db.prepare(`
    SELECT rounds.id, rounds.round_date, courses.name AS course_name
    FROM rounds
    JOIN courses ON rounds.course_id = courses.id
    ORDER BY rounds.round_date DESC
  `).all();
}

module.exports = {
  saveRoundWithScores,
  getRound, 
  updateRound, 
  updateScores,
  getAllRounds
};
