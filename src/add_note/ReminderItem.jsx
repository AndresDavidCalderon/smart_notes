import React from 'react';
import PropTypes from 'prop-types';
import './ReminderItem.css';

const text = {
  at: {
    en: 'at',
    es: 'a las',
  },
  every: {
    en: 'every',
    es: 'cada',
  },
};

class ReminderItem extends React.Component {
  edit = () => {
    const { reminder, setReminder, setReminderVisible } = this.props;
    setReminder(reminder);
    setReminderVisible(true);
  };

  render() {
    const {
      timeUnits, reminder, language, localTimeUnits,
    } = this.props;
    return (
      <button onClick={this.edit} id="reminder_item" type="button">{`${text.at[language]} ${reminder.time} ${text.every[language]} ${reminder.repeat_unit_amount} ${localTimeUnits[reminder.unit][language]}`}</button>
    );
  }
}

export default ReminderItem;

ReminderItem.propTypes = {
  timeUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
  localTimeUnits: PropTypes.arrayOf(PropTypes.shape({
    en: PropTypes.string,
    es: PropTypes.string,
  })).isRequired,
  reminder: PropTypes.shape({
    time: PropTypes.string,
    repeat_unit_amount: PropTypes.number,
    unit: PropTypes.number,
  }).isRequired,
  setReminder: PropTypes.func.isRequired,
  setReminderVisible: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};
