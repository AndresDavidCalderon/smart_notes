import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AddNote from './add_note/AddNote';
import NoteList from './NoteList';

const timeUnits = ['day', 'week', 'month', 'year'];

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

  changeNoteProperty = (newProperties) => {
    this.setState((prevState, _props) => ({
      currentNote: Object.assign(prevState.currentNote, newProperties),
    }));
  };

  addNote = (note) => {
    const SaveableNote = { ...note };
    const { noteIndex } = this.state;
    SaveableNote.id = noteIndex;
    this.setState((prevState, _props) => ({
      notes: prevState.notes.concat([SaveableNote]),
      noteIndex: prevState.noteIndex + 1,
      currentNote: { ...this.defaultNote },
    }));
  };

  deleteNote = (note) => {
    const { notes } = this.state;
    const idx = notes.indexOf(note);
    notes.splice(idx, 1);
    this.setState({
      notes: [...notes],
      addingNote: false,
      currentNote: { ...this.defaultNote },
    });
  };

  ConfirmNoteChange = () => {
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
