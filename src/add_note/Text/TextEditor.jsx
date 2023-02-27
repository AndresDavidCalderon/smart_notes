import {
  useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import TextRenderer from './TextRenderer';
import * as rawMethods from './bbcodeMethods';
import * as renderedMethods from './renderedMethods';
import ImageAdder from './tool_bar/ImageAdder';
import EffectAdder from './tool_bar/EffectAdder';
import './TextEditor.css';

function TextEditor({ note, noteChanger }) {
  const textArea = useRef();

  const [selection, setSelection] = useState({ focus: 0, anchor: 0 });

  function getOrderedSelection() {
    const realSelection = [selection.focus, selection.anchor];
    return {
      start: Math.min(...realSelection),
      end: Math.max(...realSelection),
    };
  }

  function getRawSelection() {
    const orderedSelection = getOrderedSelection();
    return {
      start: rawMethods.getRawIndex(note.text, orderedSelection.start),
      end: rawMethods.getRawIndex(note.text, orderedSelection.end),
    };
  }
  const handleSelection = () => {
    const newSelection = renderedMethods.getSelectionRange(textArea.current);
    if (JSON.stringify(newSelection) !== JSON.stringify(selection) && newSelection !== null) {
      setSelection(newSelection);
    }
  };
  useEffect(() => {
    if (textArea.current !== undefined) {
      renderedMethods.applySelection(selection.anchor, selection.focus, textArea.current);
    }
  }, [selection]);
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => { document.removeEventListener('selectionchange', handleSelection); };
  });
  const insertTextOnSelection = (text) => {
    const rawOrderedSelection = getRawSelection();
    noteChanger({ text: `${note.text.substring(0, rawOrderedSelection.start)}${text}${note.text.substring(rawOrderedSelection.end)}` });
    setSelection({ anchor: selection.anchor + text.length, focus: selection.anchor + text.length });
  };

  const toggleEffect = (tag) => {
    const rawSelection = getRawSelection();
    if (rawMethods.isAreaBetween(
      tag,
      rawMethods.getEnd(tag),
      note.text,

      rawSelection.start,
      rawSelection.end,
    )) {
      noteChanger({
        text: rawMethods.removeTagFromArea(
          note.text,
          rawSelection.start,
          rawSelection.end,

          tag,
          rawMethods.getEnd(tag),
        ).text,
      });
    } else {
      noteChanger({
        text: rawMethods.giveEffectToArea(
          note.text,
          rawSelection.start,
          rawSelection.end,

          tag,
          rawMethods.getEnd(tag),
        ),
      });
    }
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
        setSelection({ anchor: selection.start - 1, focus: selection.start - 1 });
        break;
      }
      case 'formatBold': {
        toggleEffect('[b]');
        break;
      }
      case 'formatItalic': {
        toggleEffect('[i]');
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
      <div id="toolbar">

        <ImageAdder
          note={note}
          noteChanger={noteChanger}
          selection={getRawSelection()}
        />
        <EffectAdder
          buttonContent={<b>B</b>}
          text={note.text}
          tag="[b]"
          noteChanger={noteChanger}
          rawSelection={getRawSelection()}
        />
        <EffectAdder
          buttonContent={<b>I</b>}
          text={note.text}
          tag="[i]"
          noteChanger={noteChanger}
          rawSelection={getRawSelection()}
        />
      </div>
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
