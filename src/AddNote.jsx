import React from 'react';
import './AddNote.css';
import PropTypes from 'prop-types';

class AddNote extends React.Component {
  onNoteTextChanged = (event) => {
    const { changer } = this.props;
    changer({ text: event.target.value });
  };

  render() {
    const {
      note, changeVisibility, confirmNoteChange, noteAdd, deleteNote,
    } = this.props;
    return (
      <div id="add_dialogue">
        {note.exists ? false : <button id="add_note_close" onClick={() => { changeVisibility(false); }} type="button">close</button>}
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
