const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db'); // Add this to access DB directly for rounds and scores

const { addGolfer, getGolfers, updateGolfer, deleteGolfer } = require('./golferService');
const { addCourse, getCourses, updateCourse, deleteCourse, getCourseHoles } = require('./courseService');
const {
  saveRoundWithScores,
  getRound,
  updateRound,
  updateScores,
  getAllRounds
} = require('./roundService');

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  createWindow();

  // Golfer IPC handlers
  ipcMain.handle('add-golfer', (event, name, handicap) => {
    return addGolfer(name, handicap);
  });

  ipcMain.handle('get-golfers', () => {
    return getGolfers();
  });

  ipcMain.handle('delete-golfer', (event, id) => {
    return deleteGolfer(id);
  });

  ipcMain.handle('update-golfer', (event, id, name, handicap) => {
    return updateGolfer(id, name, handicap);
  });

  // Course IPC handlers
  ipcMain.handle('add-course', (event, courseData) => {
    return addCourse(courseData);
  });

  ipcMain.handle('get-courses', () => {
    return getCourses();
  });

  ipcMain.handle('get-course-holes', (event, courseId) => {
    try {
      const holes = getCourseHoles(courseId);
      return { success: true, holes };
    } catch (error) {
      console.error('Error fetching course holes:', error);
      return { success: false, message: 'Failed to fetch holes' };
    }
  });

  ipcMain.handle('delete-course', (event, id) => {
    return deleteCourse(id);
  });

  ipcMain.handle('update-course', (event, id, courseData) => {
    return updateCourse(id, courseData);
  });

  // Round & Scores IPC handlers

  ipcMain.handle('getRound', async (event, roundId) => {
    try {
      const round = getRound(roundId);
      return { success: true, round };
    } catch (error) {
      console.error('Failed to get round:', error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('updateRound', async (event, roundData) => {
    try {
      const { id, courseId, roundDate } = roundData;
      const result = updateRound(id, { courseId, roundDate });
      return { success: result.changes > 0 };
    } catch (error) {
      console.error('Failed to update round:', error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('updateScores', async (event, { roundId, scoresArray }) => {
    try {
      updateScores(roundId, scoresArray);
      return { success: true };
    } catch (error) {
      console.error('Failed to update scores:', error);
      return { success: false, message: error.message };
    }
  });

  // Existing submit scores (optional, if you want to keep it)
  ipcMain.handle('submit-scores', async (event, data) => {
    try {
      const roundId = saveRoundWithScores(data);
      return { success: true, roundId };
    } catch (err) {
      console.error('Failed to save scores:', err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-all-rounds', async () => {
    try {
      const rounds = getAllRounds();
      return { success: true, rounds };
    } catch (error) {
      console.error('Failed to get all rounds:', error);
      return { success: false, message: error.message };
    }
  });

  
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

