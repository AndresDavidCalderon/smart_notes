import React from 'react';
import "./AddNote.css"

class AddNote extends React.Component{
    onNoteTextChanged=(event)=>{
      this.props.changer({text:event.target.value})
    }
    render(){
      return <div>
        <div id="add_dialogue">
          <button id="add_note_close" onClick={()=>{this.props.changeVisibility(false)}}>close</button>
          <button id="note_add_confirm" onClick={()=>{
            if (this.props.note.exists){
              this.props.confirmNoteChange()
            }else{
              this.props.note.exists=true;
              this.props.noteAdd(this.props.note);
              this.props.changeVisibility(false);
            }
          }}> 
            {this.props.note.exists ? "save edits":"save"}
          </button>
          <h1>Note:</h1>
          <textarea onChange={this.onNoteTextChanged} value={this.props.note.text} id="note_edit"></textarea>
        </div>
      </div>
    }
  }

  export default AddNote