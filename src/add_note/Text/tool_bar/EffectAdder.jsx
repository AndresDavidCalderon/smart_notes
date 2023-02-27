import { PropTypes } from 'prop-types';
import {
  giveEffectToArea, getEnd, isAreaBetween, removeTagFromArea,
} from '../bbcodeMethods';
import './EffectAdder.css';

function EffectAdder({
  buttonContent, text, tag, noteChanger, rawSelection,
}) {
  const addEffect = () => {
    if (isAreaBetween(tag, getEnd(tag), text, rawSelection.start, rawSelection.end)) {
      noteChanger({
        text: removeTagFromArea(
          text,
          rawSelection.start,
          rawSelection.end,
          tag,
          getEnd(tag),
        ).text,
      });
    } else {
      noteChanger({
        text: giveEffectToArea(
          text,
          rawSelection.start,
          rawSelection.end,
          tag,
          getEnd(tag),
        ),
      });
    }
  };
  return <button id="effect_adder" type="button" onClick={addEffect}>{buttonContent}</button>;
}

EffectAdder.propTypes = {
  buttonContent: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  noteChanger: PropTypes.func.isRequired,
  rawSelection: PropTypes.shape({ start: PropTypes.number, end: PropTypes.number }).isRequired,
};

export default EffectAdder;
