const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const {
  Notification, BrowserWindow, app, Tray, Menu,
} = require('electron');

const path = require('path');
const url = require('url');
require('./Reminders.cjs');

function CreateWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  if (process.env.NODE_ENV === 'production') {
    win.loadURL(url.format({
      protocol: 'file',
      slashes: true,
      pathname: path.join(path.dirname(__dirname), 'dist', 'index.html'),
    }));
  } else {
    win.loadURL('http://localhost:8080/');
  }
}

function CloseApp() {
  app.quit();
}

app.on('ready', () => {
  CreateWindow();
  installExtension(REACT_DEVELOPER_TOOLS);
});

app.on('window-all-closed', () => {
  new Notification({ title: 'smart notes is running', body: 'smart notes will keep checking for reminders' }).show();
  const trayIcon = Tray(path.join(__dirname, 'OnTray.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open in desktop', click: CreateWindow },
    { label: 'close smart notes', click: CloseApp },
  ]);
  trayIcon.setContextMenu(contextMenu);
});
