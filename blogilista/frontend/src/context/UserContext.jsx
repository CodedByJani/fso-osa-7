import { createContext, useContext, useReducer, useEffect } from 'react';
import blogService from '../services/blogs';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null);

  // localStorage → context
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch({ type: 'LOGIN', payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const loginUser = (user) => {
    window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));
    blogService.setToken(user.token);
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logoutUser = () => {
    window.localStorage.removeItem('loggedBlogUser');
    blogService.setToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
