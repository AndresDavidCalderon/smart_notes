import React from "react";
import "./NoteList.css"

function ListItem(props){
    return(
        <div id="note_item">{props.note.text}</div>
    )
}

function NoteList(props){
    return (<div id="note_list">
        {
            props.notes.map((note,index)=>{
            return(<ListItem note={note} key={note.text+note.id} ></ListItem>)
        })
        }
    </div>)
}

export default NoteList