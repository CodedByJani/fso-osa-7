import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Blog = ({ blog }) => {
  return (
    <div
      style={{
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
      }}
    >
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default Blog;
