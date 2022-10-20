const { contextBridge, ipcRenderer } = require('electron');

const API = {
  addReminder: (note) => ipcRenderer.send('add_note', note),
  setNotes: (notes) => ipcRenderer.send('set_notes', notes),
};

contextBridge.exposeInMainWorld('api', API);
