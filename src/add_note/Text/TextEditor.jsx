import {
  useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import TextRenderer from './TextRenderer';
import * as rawMethods from './bbcodeMethods';
import * as renderedMethods from './renderedMethods';
import ImageAdder from './tool_bar/ImageAdder';
import './TextEditor.css';

function TextEditor({ note, noteChanger }) {
  const textArea = useRef();

  const [selection, setSelection] = useState({ start: 0, end: 0 });

  function getRawSelection() {
    return {
      start: rawMethods.getRawIndex(note.text, selection.start),
      end: rawMethods.getRawIndex(note.text, selection.end),
    };
  }
  const setSelectionSafe = (start, end) => {
    if (start < 0) {
      throw Error('Invalid selection start, index must be greater than 0');
    }
    if (end > note.text.length - 1) {
      throw Error('Invalid selection end, index must be inside text.');
    }
    setSelection(start, end);
  };

  const handleSelection = () => {
    const newSelection = renderedMethods.getSelectionRange(textArea.current);
    if (JSON.stringify(newSelection) !== JSON.stringify(selection) && newSelection !== null) {
      setSelection(newSelection);
    }
  };
  useEffect(() => {
    if (textArea.current !== undefined) {
      renderedMethods.SelectFromTo(selection.start, selection.end, textArea.current);
    }
  }, [selection]);
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => { document.removeEventListener('selectionchange', handleSelection); };
  });
  const insertTextOnSelection = (text) => {
    noteChanger({ text: `${note.text.substring(0, rawMethods.getRawIndex(note.text, selection.start))}${text}${note.text.substring(rawMethods.getRawIndex(note.text, selection.end))}` });
    setSelectionSafe({ start: selection.start + text.length, end: selection.start + text.length });
  };

  const manageInput = async (event) => {
    switch (event.nativeEvent.inputType) {
      case 'insertText': {
        insertTextOnSelection(event.nativeEvent.data);
        break;
      }
      case 'insertFromPaste': {
        const clipboardText = await navigator.clipboard.readText();
        insertTextOnSelection(clipboardText);
        break;
      }
      case 'deleteContentBackward': {
        const rawSelection = getRawSelection();
        if (selection.end === selection.start) {
          if (selection.start !== 0) {
            noteChanger({
              text: rawMethods.removeSubstringSafe(
                rawSelection.start - 1,
                rawSelection.end,
                note.text,
              ),
            });
          }
        } else {
          noteChanger({
            text: rawMethods.removeSubstringSafe(
              rawSelection.start,
              rawSelection.end,
              note.text,
            ),
          });
        }
        setSelection({ start: selection.start - 1, end: selection.start - 1 });
        break;
      }
      case 'formatBold': {
        const rawSelection = getRawSelection();
        noteChanger({ text: rawMethods.giveEffectToArea(note.text, rawSelection.start, rawSelection.end, '[b]', '[/b]') });
        break;
      }
      case 'formatItalic': {
        const rawSelection = getRawSelection();
        noteChanger({ text: rawMethods.giveEffectToArea(note.text, rawSelection.start, rawSelection.end, '[i]', '[/i]') });
        break;
      }
      case 'insertParagraph': {
        insertTextOnSelection('\n');
        break;
      }
      // no default
    }
    event.preventDefault();
  };

  const managePaste = (event) => {
    insertTextOnSelection(event.clipboardData.getData('text/plain'));
    event.preventDefault();
  };

  return (
    <>
      <ImageAdder
        note={note}
        noteChanger={noteChanger}
        selection={{
          start: rawMethods.getRawIndex(selection.start),
          end: rawMethods.getRawIndex(selection.end),
        }}
      />
      <div id="content_editor_container">
        <TextRenderer note={note} editable ref={textArea} pasteManager={managePaste} inputManager={manageInput} width="90%" height="300px" />
      </div>
    </>
  );
}
TextEditor.defaultProps = {
  noteChanger: (_newProperties) => {},
};

TextEditor.propTypes = {
  note: PropTypes.shape({
    text: PropTypes.string,
    attachments: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  noteChanger: PropTypes.func,
};

export default TextEditor;
