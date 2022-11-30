const { ipcMain, Notification } = require('electron');

const reminders = {};

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

function remind(reminder, note) {
  new Notification({ title: 'your reminder!', body: note.text }).show();
  // because they use each other
  // eslint-disable-next-line no-use-before-define
  planReminder(reminder, note);
}

function planReminder(reminder, note) {
  const timer = setTimeout(
    () => { remind(reminder, note); },
    getNextReminder(reminder).getTime() - (new Date()).getTime(),
  );
  reminders[note.id] = timer;
}

function addNote(note) {
  note.reminders.forEach((reminder) => {
    planReminder(reminder, note.text);
  });
}

// replaces all current reminders for a brand new list
ipcMain.on('set_reminders', (event, notes) => {
  Object.keys.forEach((key) => {
    clearTimeout(reminders[key]);
    delete reminders[key];
  });
  notes.forEach((note) => {
    addNote(note);
  });
});

ipcMain.on('add_note', (_event, note) => {
  addNote(note);
});

ipcMain.on('delete_reminder', (event, id) => {
  clearTimeout(reminders[id]);
  delete reminders[id];
});
