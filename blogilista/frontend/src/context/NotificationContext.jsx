import { createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'CLEAR':
      return null;
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null);

  const notify = (message, timeout = 5000) => {
    dispatch({ type: 'SET', payload: message });
    setTimeout(() => dispatch({ type: 'CLEAR' }), timeout);
  };

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook helpottamaan contextin käyttöä
export const useNotification = () => useContext(NotificationContext);
