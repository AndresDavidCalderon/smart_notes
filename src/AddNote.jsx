import React from 'react';
import "./AddNote.css"

class AddNote extends React.Component{
    onNoteTextChanged=(event)=>{
      this.props.note.text=event.target.value;
    }
    render(){
      return <div>
        <div id="add_dialogue">
          <button id="add_note_close" onClick={()=>{this.changeVisibility(false)}}>close</button>
          <button id="note_add_confirm" onClick={()=>{this.props.noteAdd({
            text:this.props.note.text
          })
          this.props.visibilityChange(false);
          }}> add note</button>
          <h1>Note:</h1>
          <textarea onChange={this.onNoteTextChanged} value={this.props.note.text} id="note_edit"></textarea>
        </div>
      </div>
    }
  }

  export default AddNote