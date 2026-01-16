import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, user, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }
    updateBlog(updatedBlog)
  }

  return (
  <div style={blogStyle} data-testid={`blog-${blog.id}`}>
    <div>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>
        {visible ? 'hide' : 'view'}
      </button>
    </div>

    {visible && (
      <div>
        <div>{blog.url}</div>
        <div data-testid="likes">
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user?.name}</div>
        {user.username === blog.user?.username && (
          <button onClick={() => removeBlog(blog)}>remove</button>
        )}
      </div>
    )}
  </div>
)

}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired,
}

export default Blog
