import React from 'react';
import "./AddNote.css"

class AddNote extends React.Component {
  onNoteTextChanged = (event) => {
    this.props.changer({ text: event.target.value })
  }
  render() {
    return <div id="add_dialogue">
      {this.props.note.exists ? false:<button id="add_note_close" onClick={() => { this.props.changeVisibility(false) }}>close</button>}
      <button id="note_add_confirm" onClick={() => {
        if (this.props.note.exists) {
          this.props.confirmNoteChange()
        } else {
          this.props.note.exists = true;
          this.props.noteAdd(this.props.note);
          this.props.changeVisibility(false);
        }
      }}>
        {this.props.note.exists ? "save edits" : "save"}
      </button>
      <div id="note_properties">
        <h1>Note:</h1>
        <textarea onChange={this.onNoteTextChanged} value={this.props.note.text} id="note_edit"></textarea>
        {this.props.note.exists ? <button onClick={()=>{this.props.deleteNote(this.props.note)}}>delete</button> : false}
      </div>
    </div>
  }
}

export default AddNote