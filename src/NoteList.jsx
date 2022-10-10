import React from 'react';
import './NoteList.css';
import PropTypes from 'prop-types';

class ListItem extends React.Component {
  showNote = () => {
    const { showNote, setNote, note } = this.props;
    showNote(true);
    setNote(note);
  };

  render() {
    const { note } = this.props;
    return (
      <button
        type="button"
        onClick={this.showNote}
        id="note_item"
      >
        {note.text}
      </button>
    );
  }
}

ListItem.propTypes = {
  showNote: PropTypes.func.isRequired,
  setNote: PropTypes.func.isRequired,
  note: PropTypes.shape({
    text: PropTypes.string,
    id: PropTypes.number,
    exists: PropTypes.bool,
  }).isRequired,
};

function NoteList(props) {
  const {
    setNote, showNote, notes,
  } = props;
  return (
    <div id="note_list">
      {
        notes.map((note, _index) => (
          <ListItem
            setNote={setNote}
            showNote={showNote}
            note={note}
            key={note.id}
          />
        ))
      }
    </div>
  );
}

const NoteShape = {
  text: PropTypes.string,
  id: PropTypes.number,
};

NoteList.propTypes = {
  setNote: PropTypes.func.isRequired,
  showNote: PropTypes.func.isRequired,
  notes: PropTypes.arrayOf(PropTypes.shape(NoteShape)).isRequired,
};

export default NoteList;
