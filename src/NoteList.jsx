import React from "react";
import "./NoteList.css"

class ListItem extends React.Component{
    showNote=()=>{
        this.props.showNote(true)
        this.props.setNote(this.props.note)
    }
    render(){
        return(
        <button onClick={this.showNote} id="note_item">{this.props.note.text}</button>
        )
    }
}

function NoteList(props){
    return (<div id="note_list">
        {
            props.notes.map((note,index)=>{
            return(<ListItem setNote={props.setNote} showNote={props.showNote} note={note} key={note.text+note.id} ></ListItem>)
        })
        }
    </div>)
}

export default NoteList