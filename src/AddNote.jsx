import React from 'react';
import './AddNote.css';
import PropTypes from 'prop-types';
import ReminderDialogue from './AddReminder';

class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addingReminder: false,
    };
  }

  onNoteTextChanged = (event) => {
    const { changer } = this.props;
    changer({ text: event.target.value });
  };

  newReminder = () => {
    this.setState({
      addingReminder: true,
    });
  };

  render() {
    const {
      note, changeVisibility, confirmNoteChange, noteAdd, deleteNote,
    } = this.props;
    const { addingReminder } = this.state;
    return (
      <div id="add_dialogue">
        {addingReminder ? <ReminderDialogue /> : false}
        <button id="add_note_close" onClick={() => { changeVisibility(false); }} type="button">close</button>
        <button
          id="note_add_confirm"
          onClick={() => {
            if (note.exists) {
              confirmNoteChange();
            } else {
              note.exists = true;
              noteAdd(note);
              changeVisibility(false);
            }
          }}
          type="button"
        >
          {note.exists ? 'save edits' : 'save'}
        </button>
        <div id="note_properties">
          <h1>Note:</h1>
          <textarea onChange={this.onNoteTextChanged} value={note.text} id="note_edit" />
          {note.exists ? <button type="button" onClick={() => { deleteNote(note); }}>delete</button> : false}
          <h2>Reminders:</h2>
          <button type="button" onClick={this.newReminder}>Add renminder</button>
        </div>
      </div>
    );
  }
}

const {
  func, string, bool, shape,
} = PropTypes;

AddNote.propTypes = {
  changer: func.isRequired,
  confirmNoteChange: func.isRequired,
  changeVisibility: func.isRequired,
  noteAdd: func.isRequired,
  deleteNote: func.isRequired,
  note: shape({
    text: string,
    exists: bool,
  }).isRequired,
};

export default AddNote;
