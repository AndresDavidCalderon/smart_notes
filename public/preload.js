const { contextBridge, ipcRenderer } = require('electron');

const API = {
  addReminder: (reminders, note) => ipcRenderer.send('add_reminder', reminders, note),
};

contextBridge.exposeInMainWorld('api', API);
