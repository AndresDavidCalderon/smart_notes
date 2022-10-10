const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const { BrowserWindow, app } = require('electron');

function CreateWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {},
  });
  win.loadURL('http://localhost:3000');
}

app.on('ready', () => {
  CreateWindow();
  installExtension(REACT_DEVELOPER_TOOLS);
});
