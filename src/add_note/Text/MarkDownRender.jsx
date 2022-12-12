import PropTypes from 'prop-types';

const tags = ['**', '__'];

function MarkDownRender(props) {
  const { text } = props;
  return (
    <div id="markdown_render_background">
      {
        () => {
          const children = [];
          indexes = tags.map((tag) => {

          });
        }
      }
    </div>
  );
}

export default MarkDownRender;

MarkDownRender.propTypes = {
  text: PropTypes.string.isRequired,
};
