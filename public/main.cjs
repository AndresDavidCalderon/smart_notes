const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const {
  Notification, BrowserWindow, app, Tray, Menu,
} = require('electron');

const path = require('path');
require('./Reminders.cjs');

let tray;
let window;

if (require('electron-squirrel-startup')) app.quit();

function CreateWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  if (process.env.NODE_ENV === 'production') {
    window.loadURL(URL.format({
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
  installExtension(REACT_DEVELOPER_TOOLS);
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
