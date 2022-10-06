import React from "react";
import "./NoteList.css"


class ListItem extends React.Component{
    constructor(props){
        super(props);
        this.state={
            contextMenu:false,
        }
    }
    showNote=()=>{
        this.props.showNote(true);
        this.props.setNote(this.props.note);
    }
    render(){
        return(
        <button
            onContextMenu={this.contextMenu} onClick={this.showNote} id="note_item">{this.props.note.text}
        </button>
        )
    }
}

function NoteList(props){
    return (<div id="note_list">
        {
            props.notes.map((note,index)=>{
            return(<ListItem setNote={props.setNote} showNote={props.showNote} note={note} key={note.id} ></ListItem>)
        })
        }
    </div>)
}

export default NoteList