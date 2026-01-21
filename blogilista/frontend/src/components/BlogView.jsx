// frontend/src/components/BlogView.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import blogService from '../services/blogs';
import { useNotification } from '../context/NotificationContext';

const BlogView = ({ updateBlog, removeBlog, user }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [newComment, setNewComment] = useState('');
  const { notify } = useNotification();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const allBlogs = await blogService.getAll();
        const found = allBlogs.find((b) => b.id === id);
        setBlog(found);
      } catch (error) {
        notify('Failed to load blog', 5000);
      }
    };
    fetchBlog();
  }, [id, notify]);

  if (!blog) {
    return null;
  }

  const handleLike = async () => {
    try {
      await updateBlog(blog);
      setBlog({ ...blog, likes: blog.likes + 1 });
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

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    try {
      const updatedBlog = await blogService.addComment(blog.id, {
        comment: newComment,
      });
      setBlog(updatedBlog);
      setNewComment('');
      notify('Comment added', 5000);
    } catch (error) {
      notify('Failed to add comment', 5000);
    }
  };

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>
        URL: <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        Likes: {blog.likes} <button onClick={handleLike}>like</button>
      </p>
      <p>Added by: {blog.user?.name}</p>
      {user.username === blog.user?.username && (
        <button onClick={handleRemove}>remove</button>
      )}

      <h3>Comments</h3>
      <ul>
        {blog.comments?.map((c, index) => (
          <li key={index}>{c}</li>
        ))}
      </ul>

      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={newComment}
          onChange={({ target }) => setNewComment(target.value)}
          placeholder="Add a comment"
          required
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default BlogView;
