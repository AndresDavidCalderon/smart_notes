import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AddNote from './AddNote';
import NoteList from "./NoteList"

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      notes:[],
      addingNote:false,
      currentNote:{
        text:"",
      },
      noteIndex:0,
    }
    this.addNote=this.addNote.bind(this)
  }
  addNote=(note)=>{
    note.id=this.state.noteIndex
    this.setState((prevState,props)=>{
      return ({
        notes:prevState.notes.concat([note]),
        id:this.state.noteIndex
      })
    })
  }
  showAddNote=(visible)=>{
    this.setState({addingNote:visible})
  }
  setEditingNote=(note)=>{
    this.setState({currentNote:note})
  }
  render(){
    return (
      <div>
        {this.state.addingNote ? <AddNote note={this.state.currentNote} noteAdd={this.addNote} visibilityChange={this.showAddNote} ></AddNote> : false}
        <NoteList showNote={this.showAddNote} setNote={this.setNote} notes={this.state.notes}></NoteList>
        <button id="add_button" onClick={()=> {this.showAddNote(true)}}>add a note</button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
