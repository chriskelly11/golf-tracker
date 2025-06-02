window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron app loaded');
});

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Golfer methods
  addGolfer: (name, handicap) => ipcRenderer.invoke('add-golfer', name, handicap),
  getGolfers: () => ipcRenderer.invoke('get-golfers'),
  deleteGolfer: (id) => ipcRenderer.invoke('delete-golfer', id),
  updateGolfer: (id, name, handicap) => ipcRenderer.invoke('update-golfer', id, name, handicap),

  // Course methods
  addCourse: (courseData) => ipcRenderer.invoke('add-course', courseData),
  getCourses: () => ipcRenderer.invoke('get-courses'),
  deleteCourse: (id) => ipcRenderer.invoke('delete-course', id),
  updateCourse: (id, courseData) => ipcRenderer.invoke('update-course', id, courseData),
  getCourseHoles: (courseId) => ipcRenderer.invoke('get-course-holes', courseId),

  // Round & Scores methods
  submitScores: (data) => ipcRenderer.invoke('submit-scores', data),
  getRound: (roundId) => ipcRenderer.invoke('getRound', roundId),
  updateRound: (roundData) => ipcRenderer.invoke('updateRound', roundData),
  updateScores: (payload) => ipcRenderer.invoke('updateScores', payload),
  getAllRounds: () => ipcRenderer.invoke('get-all-rounds'),
});

