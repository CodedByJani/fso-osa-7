import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNotification } from '../context/NotificationContext';

const Blog = ({ blog, updateBlog, user, removeBlog }) => {
  const [visible, setVisible] = useState(false);
  const { notify } = useNotification();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => setVisible(!visible);

  const handleLike = async () => {
    try {
      // Lähetetään blogi sellaisenaan App.jsx:n updateBlogLikes-funktiolle
      const returnedBlog = await updateBlog(blog);
      notify(`You liked '${returnedBlog.title}'`, 5000);
    } catch (error) {
      notify('Failed to like blog', 5000);
    }
  };

  const handleRemove = async () => {
    const ok = window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`);
    if (!ok) return;

    try {
      await removeBlog(blog);
      notify(`Deleted '${blog.title}'`, 5000);
    } catch (error) {
      notify('Failed to delete blog', 5000);
    }
  };

  return (
    <div style={blogStyle} data-testid={`blog-${blog.id}`}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div data-testid="likes">
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {user.username === blog.user?.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired,
};

export default Blog;
