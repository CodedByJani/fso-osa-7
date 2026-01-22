// frontend/src/App.jsx
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import BlogView from './components/BlogView';
import Togglable from './components/Togglable';
import Users from './components/Users';
import User from './components/User';
import blogService from './services/blogs';
import loginService from './services/login';
import { useNotification } from './context/NotificationContext';
import { useUser } from './context/UserContext';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const blogFormRef = useRef();
  const { notify, notification } = useNotification();
  const { user, loginUser, logoutUser } = useUser();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      loginUser(user);
      setUsername('');
      setPassword('');
    } catch (error) {
      notify('wrong credentials', 5000);
    }
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      notify(
        `a new blog '${returnedBlog.title}' by ${returnedBlog.author} added`,
        5000,
      );
      blogFormRef.current.toggleVisibility();
    } catch (error) {
      notify('blog creation failed', 5000);
    }
  };

  const removeBlog = async (blog) => {
    await blogService.remove(blog.id);
    setBlogs(blogs.filter((b) => b.id !== blog.id));
  };

  const updateBlogLikes = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user,
    };

    const returnedBlog = await blogService.update(blog.id, updatedBlog);
    setBlogs(blogs.map((b) => (b.id !== returnedBlog.id ? b : returnedBlog)));
    return returnedBlog;
  };

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      {/* --- Navigointipalkki --- */}
      <nav>
        <div className="links">
          <Link to="/">Blogs</Link>
          <Link to="/users">Users</Link>
        </div>

        <div className="user-info">
          <span>{user.name} logged in</span>
          <button onClick={logoutUser}>logout</button>
        </div>
      </nav>

      <Notification message={notification} />

      <Routes>
        {/* Blogien lista */}
        <Route
          path="/"
          element={
            <div>
              <h2>Blogs</h2>

              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
              </Togglable>

              {[...blogs]
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                  <Blog key={blog.id} blog={blog} />
                ))}
            </div>
          }
        />

        {/* Käyttäjät */}
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />

        {/* Yksittäinen blogi */}
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              updateBlog={updateBlogLikes}
              removeBlog={removeBlog}
              user={user}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
