import PropTypes from 'prop-types';
import { marked } from 'marked';
import './MarkDownRender.css';

function MarkDownRender(props) {
  const { attached, placeholders, color } = props;
  let { text } = props;
  attached.forEach((attachment, index) => {
    text = text.replaceAll(`[attachment #${index}]`, attachment);
  });
  Object.keys(placeholders).forEach((placeholder) => {
    text = text.replaceAll(`[${placeholder}]`, placeholders[placeholder]);
  });
  return (
    // this text is user input,and it isnt loaded by any server.
    // eslint-disable-next-line react/no-danger
    <div dangerouslySetInnerHTML={{ __html: marked.parse(text) }} id="markdown_result_area" style={{ backgroundColor: color }} />
  );
}

export default MarkDownRender;

MarkDownRender.propTypes = {
  text: PropTypes.string.isRequired,
  attached: PropTypes.arrayOf(PropTypes.string),
  placeholders: PropTypes.objectOf(PropTypes.string),
  color: PropTypes.string,
};
MarkDownRender.defaultProps = {
  attached: [],
  placeholders: [],
  color: 'beige',
};
