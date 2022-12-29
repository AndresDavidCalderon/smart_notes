import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AddNote from './add_note/AddNote';
import NoteList from './NoteList';
import About from './about_app/About';

const timeUnits = ['day', 'week', 'month', 'year'];
const localTimeUnits = [
  {
    en: 'day',
    es: 'dìa',
  },
  {
    en: 'week',
    es: 'semana',
  },
  {
    en: 'month',
    es: 'mes',
  },
  {
    en: 'year',
    es: 'año',
  },
];
function saveNotes(notes) {
  window.localStorage.setItem('notes', JSON.stringify(notes));
}

class App extends React.Component {
  defaultNote = {
    text: '',
    exists: false,
    id: 0,
    reminders: [],
    attached: [],
    nextReminderID: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      addingNote: false,
      currentNote: { ...this.defaultNote },
      noteIndex: 0,
      language: window.localStorage.getItem('language') === null ? navigator.language.substring(0, 2) : window.localStorage.getItem('language'),
    };
    this.addNote = this.addNote.bind(this);
  }

  componentDidMount() {
    if (window.localStorage.getItem('notes') != null) {
      this.setNotes(JSON.parse(window.localStorage.getItem('notes')));
      if (window.localStorage.getItem('next_id') !== null) {
        this.setState({ noteIndex: parseInt(window.localStorage.getItem('next_id'), 10) });
      }
    }
  }

  setNotes = (notes) => {
    this.setState({
      notes,
    });
    if (Object.hasOwn(window, 'api')) {
      window.api.setNotes(notes);
    }
  };

  changeNoteProperty = (newProperties) => {
    this.setState((prevState, _props) => ({
      currentNote: Object.assign(prevState.currentNote, newProperties),
    }));
  };

  addNote = (note, save = true) => {
    const SaveableNote = { ...note };
    const { noteIndex, notes } = this.state;
    SaveableNote.id = noteIndex;
    window.localStorage.setItem('next_id', noteIndex + 1);

    if (Object.hasOwn(window, 'api')) {
      window.api.addNote(SaveableNote);
    }
    if (save) {
      saveNotes([...notes, SaveableNote]);
    }
    this.setState((prevState, _props) => ({
      notes: prevState.notes.concat([SaveableNote]),
      noteIndex: prevState.noteIndex + 1,
      currentNote: { ...this.defaultNote },
      addingNote: false,
    }));
  };

  deleteNote = (note, save = true) => {
    const { notes } = this.state;
    const idx = notes.indexOf(note);
    notes.splice(idx, 1);
    if (save) {
      saveNotes(notes);
    }
    if (Object.hasOwn(window, 'api')) {
      window.api.deleteNote(note.id);
    }
    this.setState({
      notes: [...notes],
      addingNote: false,
      currentNote: { ...this.defaultNote },
    });
  };

  ConfirmNoteChange = () => {
    const { currentNote } = this.state;
    if (Object.hasOwn(window, 'api')) {
      window.api.deleteNote(currentNote.id);
      window.api.addNote(currentNote);
    }
    this.setState({
      addingNote: false,
      currentNote: { ...this.defaultNote },
    });
  };

  showAddNote = (visible) => {
    this.setState({ addingNote: visible });
  };

  setEditingNote = (note) => {
    this.setState({ currentNote: note });
  };

  setLanguage = (event) => {
    localStorage.setItem('language', event.target.selectedOptions[0].value);
    this.setState({
      language: event.target.selectedOptions[0].value,
    });
  };

  render() {
    const {
      addingNote, notes, currentNote, language,
    } = this.state;
    return (
      <div>
        <NoteList
          showNote={this.showAddNote}
          setNote={this.setEditingNote}
          notes={notes}
        />
        {addingNote ? (
          <AddNote
            changer={this.changeNoteProperty}
            note={currentNote}
            noteAdd={this.addNote}
            changeVisibility={this.showAddNote}
            confirmNoteChange={this.ConfirmNoteChange}
            deleteNote={this.deleteNote}
            timeUnits={timeUnits}
            localTimeUnits={localTimeUnits}
            defaultNote={this.defaultNote}
            language={language}
          />
        ) : false}
        <button type="button" aria-label="add note" id="add_button" onClick={() => { this.showAddNote(true); }} hidden={addingNote} />
        <About />
        <select id="language_selector" onChange={this.setLanguage} value={language}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
