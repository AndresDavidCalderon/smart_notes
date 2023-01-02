import React from 'react';
import './AddNote.css';
import PropTypes from 'prop-types';
import ReminderDialogue from './AddReminder';
import ReminderItem from './ReminderItem';
import TextEditor from './Text/TextEditor';

const text = {
  cancelNote: {
    true: {
      en: 'delete note',
      es: 'eliminar nota',
    },
    false: {
      en: 'delete draft',
      es: 'descartar borrador',
    },
  },
  reminders: {
    title: {
      en: 'Reminders:',
      es: 'Recordatiorios:',
    },
    add: {
      en: 'add reminder',
      es: 'añadir recordatorio',
    },
  },
};

class AddNote extends React.Component {
  defaultReminder = {
    time: '00:00',
    unit: 0,
    repeat_unit_amount: 1,
    max_reminders: -1,
    exists: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      addingReminder: false,
      currentReminder: { ...this.defaultReminder },
    };
  }

  fixMissingAttachments = () => {
    const { note } = this.props;
    const newAttachments = [];
    note.attached.forEach((attachment, index) => {
      const attachPosition = note.text.indexOf(`[attachment #${index}]`);
      if (attachPosition !== -1) {
        // We replace the old index with the new one.
        note.text = `${note.text.substring(0, attachPosition)}[attachment #${newAttachments.length}]${note.text.substring(attachPosition + 15)}`;
        newAttachments.push(attachment);
      }
    });
    Object.keys(note.placeholders).forEach((placeholder) => {
      if (note.text.indexOf(placeholder) === -1) {
        delete note.placeholders[placeholder];
      }
    });
    note.attached = newAttachments;
  };

  newReminder = () => {
    this.setState({
      addingReminder: true,
      currentReminder: { ...this.defaultReminder },
    });
  };

  resetReminder = () => {
    this.setState({
      currentReminder: { ...this.defaultReminder },
    });
  };

  confirmReminder = () => {
    const { note, changer } = this.props;
    const { currentReminder } = this.state;

    if (currentReminder.exists) {
      changer({ reminders: note.reminders });
    } else {
      currentReminder.id = note.nextReminderID;
      currentReminder.exists = true;
      changer({ reminders: [...note.reminders, currentReminder] });
      note.nextReminderID += 1;
    }
  };

  setReminder = (reminder) => {
    this.setState({
      currentReminder: reminder,
    });
  };

  setReminderVisible = (visible) => {
    this.setState({
      addingReminder: visible,
    });
  };

  cancelNote = () => {
    const {
      changer, defaultNote, changeVisibility,
    } = this.props;
    changer(defaultNote);
    changeVisibility(false);
  };

  deleteNote = () => {
    const { deleteNote, changeVisibility, note } = this.props;
    deleteNote(note);
    changeVisibility(false);
  };

  render() {
    const {
      timeUnits, localTimeUnits, note, changeVisibility,
      confirmNoteChange, noteAdd, changer, language,
    } = this.props;
    const { addingReminder, currentReminder } = this.state;
    return (
      <div id="add_dialogue">
        {addingReminder ? (
          <ReminderDialogue
            reminder={currentReminder}
            setReminder={this.setReminder}
            setVisible={this.setReminderVisible}
            reset={this.resetReminder}
            note={note}
            confirm={this.confirmReminder}
            noteChanger={changer}
            localTimeUnits={localTimeUnits}
            language={language}
          />
        ) : false}
        <div id="draft_option_container">
          {note.exists ? <button id="delete_note" className="draft_option" onClick={this.deleteNote} type="button" aria-label="cancel draft" />
            : <button className="draft_option" type="button" id="delete_draft" aria-label="erase draft" onClick={this.cancelNote} />}
          <button
            className="draft_option"
            id="confirm_note"
            onClick={() => {
              if (note.exists) {
                this.fixMissingAttachments();
                confirmNoteChange();
              } else {
                this.fixMissingAttachments();
                note.exists = true;
                noteAdd(note);
                changeVisibility(false);
              }
            }}
            type="button"
            aria-label="confirm changes"
          />
        </div>

        <div id="note_properties">

          <TextEditor note={note} noteChanger={changer} language={language} />

          {note.reminders.length > 0 ? <h2>{text.reminders.title[language]}</h2> : false}

          <button type="button" onClick={this.newReminder}>{text.reminders.add[language]}</button>
          {note.reminders.map((reminderObject, _reminderIndex) => (
            <ReminderItem
              key={reminderObject.id}
              setReminder={this.setReminder}
              setReminderVisible={this.setReminderVisible}
              reminder={reminderObject}
              timeUnits={timeUnits}
              localTimeUnits={localTimeUnits}
              language={language}
            />
          ))}
        </div>
      </div>
    );
  }
}

const noteShape = {
  text: PropTypes.string,
  exists: PropTypes.bool,
  reminders: PropTypes.arrayOf(PropTypes.shape({
    time: PropTypes.string,
    unit: PropTypes.number,
    repeat_unit_amount: PropTypes.number,
    max_reminders: PropTypes.number,
    id: PropTypes.number,
  })),
  attached: PropTypes.arrayOf(PropTypes.string).isRequired,
  nextReminderID: PropTypes.number,
};

AddNote.propTypes = {
  changer: PropTypes.func.isRequired,
  confirmNoteChange: PropTypes.func.isRequired,
  changeVisibility: PropTypes.func.isRequired,
  noteAdd: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  defaultNote: PropTypes.shape(noteShape).isRequired,
  note: PropTypes.shape(noteShape).isRequired,
  timeUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
  localTimeUnits: PropTypes.arrayOf(PropTypes.shape({
    en: PropTypes.string,
    es: PropTypes.string,
  })).isRequired,
  language: PropTypes.string.isRequired,
};

export default AddNote;
