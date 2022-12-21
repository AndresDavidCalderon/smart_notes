import React from 'react';
import './AddReminder.css';
import PropTypes from 'prop-types';

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

  render() {
    const { reminder } = this.props;
    return (
      <div id="reminder_dialogue">
        <h1>New reminder:</h1>
        <h2>Hour</h2>
        <input value={reminder.time} onChange={(e) => { this.assignToReminder({ time: e.target.value }); }} type="time" />
        <h2>Repeat</h2>
        <select onChange={(e) => { this.assignToReminder({ unit: e.target.selectedIndex }); }}>
          <option>Every _ days</option>
          <option>Every _ weeks</option>
          <option>Every _ months</option>
          <option>Every _ years</option>
        </select>
        <input value={reminder.repeat_unit_amount} onChange={(e) => { this.assignToReminder({ repeat_unit_amount: parseInt(e.target.value, 10) }); }} type="number" placeholder="_" size={2} />
        <h3>amount of reminders</h3>
        <input type="number" onChange={(e) => { this.assignToReminder({ max_reminders: parseInt(e.target.value, 10) }); }} value={reminder.max_reminders} />
        <button onClick={this.addReminder} id="add_reminder_button" type="button">{reminder.exists ? 'confirm edit' : 'add reminder'}</button>
        {reminder.exists ? false : <button onClick={this.cancel} id="close_reminder_button" type="button">Cancel</button>}
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
};

export default ReminderDialogue;
