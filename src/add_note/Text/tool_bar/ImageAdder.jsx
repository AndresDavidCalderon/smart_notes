import { useRef } from 'react';
import { PropTypes } from 'prop-types';
import './ImageAdder.css';

function ImageAdder({ note, noteChanger, selection }) {
  const fileInput = useRef();

  // Used to hide the file input
  const triggerFile = () => {
    fileInput.current.click();
  };
  const addImage = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const textToInsert = `@${note.attachments.length}`;
      noteChanger({
        attachments: [...note.attachments, `[img]${fileReader.result}[/img]`],
        text: `${note.text.substring(0, selection.start)}${textToInsert}${note.text.substring(selection.end)}`,
      });
    };
    fileReader.readAsDataURL(file);
  };
  const submitImages = async (event) => {
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
