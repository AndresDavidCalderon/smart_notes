let REACT_DEVELOPER_TOOLS;
let installExtension;

require('dotenv').config();

const devtoolsInstaller = process.env.NODE_ENV === 'development' ? require('electron-devtools-installer') : undefined;

if (process.env.NODE_ENV === 'development') {
  ({ default: installExtension, REACT_DEVELOPER_TOOLS } = devtoolsInstaller);
}

const {
  Notification, BrowserWindow, app, Tray, Menu,
} = require('electron');

const url = require('url');
const path = require('path');
const squirrelStartup = require('electron-squirrel-startup');

if (squirrelStartup) app.quit();

let tray;
let window;

require('./Reminders.cjs');

function CreateWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  if (process.env.NODE_ENV !== 'development') {
    window.loadURL(url.format({
      protocol: 'file',
      slashes: true,
      pathname: path.join(path.dirname(__dirname), 'dist', 'index.html'),
    }));
  } else {
    window.loadURL('http://localhost:8080/');
  }
}

function CloseApp() {
  app.quit();
}

app.on('ready', () => {
  CreateWindow();
  if (devtoolsInstaller !== undefined) {
    installExtension(REACT_DEVELOPER_TOOLS);
  }
});

app.on('window-all-closed', () => {
  window = undefined;
  new Notification({ title: 'smart notes is running', body: 'smart notes will keep checking for reminders' }).show();
  if (tray === undefined) {
    tray = Tray(path.join(__dirname, 'OnTray.png'));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open in desktop', click: () => { if (window === undefined) { CreateWindow(); } else { window.moveTop(); } } },
      { label: 'close smart notes', click: CloseApp },
    ]);
    tray.setContextMenu(contextMenu);
  }
});
