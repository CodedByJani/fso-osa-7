import { useState, useEffect, useRef, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';
import { NotificationContext } from './context/NotificationContext.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const blogFormRef = useRef();
  const { notification, dispatch } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  // Haetaan blogit
  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  });

  // Mutation uuden blogin luomiseen
  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      dispatch({
        type: 'SET',
        payload: `A new blog '${newBlog.title}' by ${newBlog.author} added`,
      });
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000);
      blogFormRef.current.toggleVisibility();
    },
    onError: () => {
      dispatch({ type: 'SET', payload: 'Blog creation failed' });
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000);
    },
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

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
      dispatch({ type: 'SET', payload: 'Wrong credentials' });
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogUser');
    blogService.setToken(null);
  };

  const addBlog = async (blogObject) => {
    createBlogMutation.mutate(blogObject);
  };

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
            updateBlog={(updatedBlog) => {
              queryClient.setQueryData(['blogs'], (old) =>
                old.map((b) => (b.id !== updatedBlog.id ? b : updatedBlog)),
              );
            }}
            removeBlog={(removedBlog) => {
              if (
                !window.confirm(
                  `Remove blog '${removedBlog.title}' by ${removedBlog.author}?`,
                )
              )
                return;
              blogService.remove(removedBlog.id).then(() => {
                queryClient.setQueryData(['blogs'], (old) =>
                  old.filter((b) => b.id !== removedBlog.id),
                );
                dispatch({
                  type: 'SET',
                  payload: `Deleted '${removedBlog.title}'`,
                });
                setTimeout(() => dispatch({ type: 'CLEAR' }), 5000);
              });
            }}
          />
        ))}
    </div>
  );
};

export default App;
