const { contextBridge, ipcRenderer } = require('electron');

const API = {
  addNote: (note) => ipcRenderer.send('add_note', note),
  setNotes: (notes) => ipcRenderer.send('set_notes', notes),
  deleteNote: (noteID) => ipcRenderer.send('delete_note', noteID),
};

contextBridge.exposeInMainWorld('api', API);
