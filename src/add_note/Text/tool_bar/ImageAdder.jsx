import { useRef, useState } from 'react';
import { PropTypes } from 'prop-types';
import './ImageAdder.css';

function ImageAdder({ note, noteChanger, selection }) {
  const fileInput = useRef();

  const [insertionRange, setInsertionRange] = useState({ start: 0, end: 0 });
  // Used to hide the file input
  const triggerFile = () => {
    setInsertionRange(selection);
    fileInput.current.click();
  };
  const addImage = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const textToInsert = `@${note.attachments.length}`;
      noteChanger({
        attachments: [...note.attachments, `[img]ESCAPE START${fileReader.result}ESCAPE END[/img]`],
        text: `${note.text.substring(0, insertionRange.start)}${textToInsert}${note.text.substring(insertionRange.end)}`,
      });
    };
    fileReader.readAsDataURL(file);
  };

  const submitImages = (event) => {
    Array(event.target.files).forEach((_file, index) => { addImage(event.target.files[index]); });
  };
  return (
    <button type="button" onClick={triggerFile} id="image_add_button">
      <input hidden multiple type="file" accept="image/*" capture="environment" ref={fileInput} onChange={submitImages} />
    </button>
  );
}

ImageAdder.propTypes = {
  note: PropTypes.shape({
    text: PropTypes.string,
    attachments: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  noteChanger: PropTypes.func.isRequired,
  selection: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
  }).isRequired,
};

export default ImageAdder;
