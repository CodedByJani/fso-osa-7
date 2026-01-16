import { createContext, useReducer, useContext } from 'react';

// Alkuperäinen tila
const initialState = null;

// Reducer notifikaatioille
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

// Luodaan context
export const NotificationContext = createContext();

// Provider-komponentti
export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(
    notificationReducer,
    initialState,
  );

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook helpottamaan contextin käyttöä
export const useNotification = () => {
  return useContext(NotificationContext);
};
