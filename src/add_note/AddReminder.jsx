import React from 'react';
import './AddReminder.css';
import PropTypes from 'prop-types';

const text = {
  at: {
    en: 'at',
    es: 'a las',
  },
  repeat: {
    en: 'every',
    es: 'cada',
  },
  times: {
    en: 'times',
    es: 'veces',
  },
};

class ReminderDialogue extends React.Component {
  assignToReminder = (source) => {
    const { reminder, setReminder } = this.props;
    setReminder(Object.assign(reminder, source));
  };

  addReminder = () => {
    const {
      setVisible, confirm,
    } = this.props;
    confirm();
    setVisible(false);
  };

  cancel = () => {
    const { setVisible, reset } = this.props;
    reset();
    setVisible(false);
  };

  delete = () => {
    const {
      noteChanger, note, reminder, setVisible,
    } = this.props;
    const index = note.reminders.findIndex(
      (comparingReminder) => comparingReminder.id === reminder.id,
    );
    const newReminders = [...note.reminders];
    newReminders.splice(index, 1);
    noteChanger({ reminders: newReminders });
    setVisible(false);
  };

  render() {
    const { reminder, localTimeUnits, language } = this.props;
    return (
      <div id="reminder_dialogue">
        <span className="clue">{text.at[language]}</span>
        <input value={reminder.time} onChange={(e) => { this.assignToReminder({ time: e.target.value }); }} type="time" />
        <br />
        <span className="clue">{text.repeat[language]}</span>
        <input id="repeat_multiplier" min={1} value={reminder.repeat_unit_amount} onChange={(e) => { this.assignToReminder({ repeat_unit_amount: parseInt(e.target.value, 10) }); }} type="number" placeholder="_" size={2} />
        <select onChange={(e) => { this.assignToReminder({ unit: e.target.selectedIndex }); }}>
          {localTimeUnits.map((timeUnit) => (
            <option
              key={timeUnit[language]}
            >
              {timeUnit[language]}
            </option>
          ))}
        </select>

        <br />
        <input id="repeat_times" type="number" onChange={(e) => { this.assignToReminder({ max_reminders: parseInt(e.target.value, 10) }); }} min="-1" value={reminder.max_reminders} />
        <span className="clue">{text.times[language]}</span>
        <div id="confirmations">
          <button onClick={this.addReminder} id="add_reminder_button" type="button" aria-label="done" />
          {reminder.exists ? <button id="delete" className="close_reminder_button" type="button" aria-label="delete" onClick={this.delete} /> : <button id="cancel" onClick={this.cancel} className="close_reminder_button" type="button" aria-label="cancel draft" />}
        </div>
      </div>
    );
  }
}

const reminderShape = {
  time: PropTypes.string,
  unit: PropTypes.number,
  repeat_unit_amount: PropTypes.number,
  max_reminders: PropTypes.number,
};
ReminderDialogue.propTypes = {
  reminder: PropTypes.shape(reminderShape).isRequired,
  setReminder: PropTypes.func.isRequired,
  setVisible: PropTypes.func.isRequired,
  note: PropTypes.shape({
    text: PropTypes.string,
    reminders: PropTypes.arrayOf(PropTypes.shape(reminderShape)),
  }).isRequired,
  reset: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  noteChanger: PropTypes.func.isRequired,
  localTimeUnits: PropTypes.arrayOf(PropTypes.shape(
    { en: PropTypes.string, es: PropTypes.string },
  )).isRequired,
  language: PropTypes.string.isRequired,
};

export default ReminderDialogue;
