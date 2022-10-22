const { contextBridge, ipcRenderer } = require('electron');

const API = {
  addReminder: (note) => ipcRenderer.send('add_note', note),
  setNotes: (notes) => ipcRenderer.send('set_notes', notes),
  deleteReminder: (noteID) => ipcRenderer.send('delete_reminder', noteID),
};

contextBridge.exposeInMainWorld('api', API);
