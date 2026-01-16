// frontend/src/App.jsx
import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import { useNotification } from './context/NotificationContext';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const blogFormRef = useRef();
  const { notify, notification } = useNotification();

  // Hae blogit backendistä
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // Tarkista, onko käyttäjä kirjautuneena
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Kirjautuminen
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      notify('wrong credentials', 5000);
    }
  };

  // Kirjautuminen ulos
  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogUser');
    blogService.setToken(null);
  };

  // Lisää uusi blogi
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

  // Poista blogi
  const removeBlog = async (blog) => {
    const ok = window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`);
    if (!ok) return;

    try {
      await blogService.remove(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      notify(`Deleted '${blog.title}'`, 5000);
    } catch (error) {
      notify('Failed to delete blog', 5000);
    }
  };

  // Päivitä blogin likes
  const updateBlogLikes = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user,
    };
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      setBlogs(blogs.map((b) => (b.id !== returnedBlog.id ? b : returnedBlog)));
      return returnedBlog; // <-- palauta blogi handleLike:lle
    } catch (error) {
      notify('Failed to like blog');
      throw error; // <-- niin handleLike tietää että virhe tapahtui
    }
  };

  // Jos käyttäjä ei ole kirjautuneena
  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              id="username"
              type="text"
              value={username}
              name="username"
              onChange={({ target }) => setUsername(target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              name="password"
              onChange={({ target }) => setPassword(target.value)}
              required
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  // Näytetään blogit
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            updateBlog={updateBlogLikes} // likes päivitys
            removeBlog={removeBlog}
          />
        ))}
    </div>
  );
};

export default App;
