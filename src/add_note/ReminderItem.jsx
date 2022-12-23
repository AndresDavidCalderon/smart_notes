import React from 'react';
import PropTypes from 'prop-types';
import './ReminderItem.css';

class ReminderItem extends React.Component {
  edit = () => {
    const { reminder, setReminder, setReminderVisible } = this.props;
    setReminder(reminder);
    setReminderVisible(true);
  };

  render() {
    const { timeUnits, reminder } = this.props;
    return (
      <button onClick={this.edit} id="reminder_item" type="button">{`at ${reminder.time} every ${reminder.repeat_unit_amount} ${timeUnits[reminder.unit]}`}</button>
    );
  }
}

export default ReminderItem;

ReminderItem.propTypes = {
  timeUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
  reminder: PropTypes.shape({
    time: PropTypes.string,
    repeat_unit_amount: PropTypes.number,
    unit: PropTypes.number,
  }).isRequired,
  setReminder: PropTypes.func.isRequired,
  setReminderVisible: PropTypes.func.isRequired,
};
