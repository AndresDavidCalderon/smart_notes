const { ipcMain, Notification } = require('electron');
const { removeAttachments, removeBBCode } = require('./noteFormatting');

// As key it has note ID's,
// and as values an object with reminder IDs as key and
// reminder objects containing the amount of reminders left and last timer ID as value.
const notes = {};

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
  new Notification({ title: 'your reminder!', body: removeBBCode(removeAttachments(note.text)) }).show();
  if (reminder.max_reminders === -1 || reminder.max_reminders > 0) {
    // because they use each other
    // eslint-disable-next-line no-use-before-define
    notes[note.id][reminder.id].timer_id = planReminder(reminder, note);
    notes[note.id][reminder.id].max_reminders -= 1;
  }
}

function planReminder(reminder, note) {
  const timer = setTimeout(
    () => { remind(reminder, note); },
    getNextReminder(reminder).getTime() - (new Date()).getTime(),
  );
  return timer;
}

function addNote(note) {
  notes[note.id] = [];
  note.reminders.forEach((reminder) => {
    notes[note.id][reminder.id] = { ...reminder, timer_id: planReminder(reminder, note) };
  });
}

function CancelRemindersOfNote(id) {
  Object.keys(notes[id]).forEach((reminderID) => {
    clearTimeout(notes[id][reminderID].timer_id);
  });
}

// replaces all current reminders for a brand new list
ipcMain.on('set_notes', (event, newNotes) => {
  Object.keys(notes).forEach((noteID) => {
    CancelRemindersOfNote(noteID);
  });
  newNotes.forEach((note) => {
    addNote(note);
  });
});

ipcMain.on('add_note', (event, note) => {
  addNote(note);
});

ipcMain.on('delete_note', (event, noteID) => {
  CancelRemindersOfNote(noteID);
  delete notes[noteID];
});
