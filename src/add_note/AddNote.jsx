import React from 'react';
import './AddNote.css';
import PropTypes from 'prop-types';
import ReminderDialogue from './AddReminder';
import ReminderItem from './ReminderItem';
import TextEditor from './Text/TextEditor';

const text = {
  title: {
    en: 'Note:',
    es: 'Nota:',
  },
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

  getConfirmationText() {
    const { language, note } = this.props;
    switch (language) {
      case 'en':
        return note.exists ? 'save edits' : 'save';
      case 'es':
        return note.exists ? 'terminar edición' : 'guardar';
      default:
        return 'save';
    }
  }

  getCancelText() {
    const { language, note } = this.props;
    switch (language) {
      case 'en':
        return note.exists ? 'delete' : 'erase draft';
      case 'es':
        return note.exists ? 'eliminar' : 'borrar borrador';
      default:
        return 'save';
    }
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
      deleteNote, changer, note, defaultNote, changeVisibility,
    } = this.props;
    if (note.exists) {
      deleteNote(note);
      changeVisibility(false);
    } else {
      changer(defaultNote);
      changeVisibility(false);
    }
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
          <button className="draft_option" onClick={this.cancelNote} type="button">{this.getCancelText()}</button>
          <button
            className="draft_option"
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
          >
            {this.getConfirmationText()}
          </button>
        </div>

        <div id="note_properties">
          <h1>{text.title[language]}</h1>

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
