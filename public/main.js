const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const {
  Notification, ipcMain, BrowserWindow, app,
} = require('electron');

const { join } = require('path');

function CreateWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, './preload.js'),
    },
  });
  win.loadURL('http://localhost:3000');
}

function getNextReminder(reminder) {
  const currentDate = new Date();
  const date = new Date();
  const hours = parseInt(reminder.time.substring(0, 2), 10);
  const minutes = parseInt(reminder.time.substring(3, 5), 10);
  date.setHours(hours, minutes, 0);
  if (currentDate.getHours() > hours
  || (currentDate.getHours() === hours && currentDate.getMinutes() >= minutes)) {
    const daysFromNow = [1, 7, 31, 365][reminder.unit] * reminder.repeat_unit_amount;
    date.setDate(date.getDate() + daysFromNow);
  }
  return date;
}

app.on('ready', () => {
  CreateWindow();
  installExtension(REACT_DEVELOPER_TOOLS);
});

app.on('window-all-closed', () => {
  new Notification({ title: 'smart notes is running', body: 'smart notes will keep checking for reminders' }).show();
});

function remind(reminder, note) {
  new Notification({ title: 'your reminder!', body: note }).show();
  // because they use each other
  // eslint-disable-next-line no-use-before-define
  planReminder(reminder, note);
}
function planReminder(reminder, note) {
  setTimeout(
    () => { remind(reminder, note); },
    getNextReminder(reminder).getTime() - (new Date()).getTime(),
  );
}

ipcMain.on('add_reminder', (event, reminderList, note) => {
  reminderList.forEach((reminder) => { planReminder(reminder, note); });
});
