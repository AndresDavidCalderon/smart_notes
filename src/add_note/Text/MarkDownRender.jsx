import PropTypes from 'prop-types';
import { marked } from 'marked';

function MarkDownRender(props) {
  const { text } = props;
  return (
    // this text is user input,and it isnt loaded by any server.
    // eslint-disable-next-line react/no-danger
    <p dangerouslySetInnerHTML={{ __html: marked.parse(text) }} />
  );
}

export default MarkDownRender;

MarkDownRender.propTypes = {
  text: PropTypes.string.isRequired,
};
