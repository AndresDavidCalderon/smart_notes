import React from 'react';
import PropTypes from 'prop-types';
import './ReminderItem.css';

class ReminderItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onHover: false,
    };
  }

  focus = () => {
    this.setState({
      onHover: true,
    });
  };

  unfocus = () => {
    this.setState({
      onHover: false,
    });
  };

  edit = () => {
    const { reminder, setReminder, setReminderVisible } = this.props;
    setReminder(reminder);
    setReminderVisible(true);
  };

  render() {
    const { timeUnits, reminder } = this.props;
    const { onHover } = this.state;
    return (
      <div id="reminder_item" onMouseOver={this.focus} onFocus={this.focus} onMouseOut={this.unfocus} onBlur={this.unfocus}>
        <span>{`at ${reminder.time} every ${reminder.repeat_unit_amount} ${timeUnits[reminder.unit]}`}</span>
        {onHover ? <button onClick={this.edit} id="edit_reminder" type="button">edit</button> : false}
      </div>
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
