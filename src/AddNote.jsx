import React from 'react';
import "./AddNote.css"

class AddNote extends React.Component{
    constructor(props){
      super(props)
      this.state={
        visible:false
      }
    }
    changeVisibility=(visible)=>{
      this.setState({
        visible:visible
      })
    }
    render(){
      return <div>
        {this.state.visible ? <div id="add_dialogue">
          <button id="add_note_close" onClick={()=>{this.changeVisibility(false)}}>close</button>
          <button id="note_add_confirm" onClick={()=>{this.props.AddNote({
            text:this.text
          })}}> add note</button>
          <h1>Note:</h1>
          <textarea id="note_edit"></textarea>
        </div>:false}
        <button id="add_button" onClick={()=> {this.changeVisibility(true)}}>add a note</button>
      </div>
    }
  }

  export default AddNote