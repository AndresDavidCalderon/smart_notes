import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AddNote from './add_note/AddNote';
import NoteList from './NoteList';

const timeUnits = ['day', 'week', 'month', 'year'];

function saveNotes(notes) {
  window.localStorage.setItem('notes', JSON.stringify(notes));
}

class App extends React.Component {
  defaultNote = {
    text: '',
    exists: false,
    id: 0,
    reminders: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      addingNote: false,
      currentNote: { ...this.defaultNote },
      noteIndex: 0,
    };
    this.addNote = this.addNote.bind(this);
  }

  componentDidMount() {
    if (window.localStorage.getItem('notes') != null) {
      this.setNotes(JSON.parse(window.localStorage.getItem('notes')));
      if (window.localStorage.getItem('next_id') !== null) {
        this.setState({ noteIndex: window.localStorage.getItem('next_id') });
      }
    }
  }

  componentWillUnmount() {
    const { noteIndex } = this.state;
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
      window.api.addNote(note);
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
      window.api.deleteReminder(notes.id);
    }
    this.setState({
      notes: [...notes],
      addingNote: false,
      currentNote: { ...this.defaultNote },
    });
  };

  ConfirmNoteChange = () => {
    const { currentNote } = this.state;
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

  render() {
    const { addingNote, notes, currentNote } = this.state;
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
          />
        ) : false}
        <button type="button" id="add_button" onClick={() => { this.showAddNote(true); }}>add a note</button>
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
