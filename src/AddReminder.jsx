import React from 'react';
import './AddReminder.css';

function ReminderDialogue() {
  return (
    <div id="reminder_dialogue">
      <h1>New reminder:</h1>
      <h2>Hour</h2>
      <input type="time" />
      <h2>Repeat</h2>
      <select>
        <option>Every _ days</option>
        <option>Every _ weeks</option>
        <option>Every _ months</option>
        <option>Every _ years</option>
      </select>
      <input type="number" placeholder="_" size={2} />
      <button id="add_reminder_button" type="button">Add reminder</button>
      <button id="close_reminder_button" type="button">Cancel</button>
    </div>
  );
}

export default ReminderDialogue;
