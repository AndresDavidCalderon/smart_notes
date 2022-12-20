import PropTypes from 'prop-types';
import { marked } from 'marked';
import './MarkDownRender.css';

function MarkDownRender(props) {
  const { attached } = props;
  let { text } = props;
  attached.forEach((attachment, index) => {
    text = text.replaceAll(`[attachment #${index}]`, attachment);
  });
  return (
    // this text is user input,and it isnt loaded by any server.
    // eslint-disable-next-line react/no-danger
    <p dangerouslySetInnerHTML={{ __html: marked.parse(text) }} id="markdown_result" />
  );
}

export default MarkDownRender;

MarkDownRender.propTypes = {
  text: PropTypes.string.isRequired,
  attached: PropTypes.arrayOf(PropTypes.string),
};
MarkDownRender.defaultProps = {
  attached: [],
};
