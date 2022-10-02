import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AddNote from './AddNote';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      notes:[]
    }
    this.addNote=this.addNote.bind(this)
  }
  addNote=(note)=>{
    this.setState((prevState,props)=>{
      return ({notes:prevState.notes.concat([note])})
    })
  }
  render(){
    return (
      <div>
        <AddNote noteAdd={this.addNote} ></AddNote>
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
