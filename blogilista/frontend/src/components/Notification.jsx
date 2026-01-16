import { useNotification } from '../context/NotificationContext.jsx';

const Notification = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  // Esimerkkinä oletetaan, että virheilmoitus on "wrong credentials"
  const isError = notification === 'wrong credentials';

  const style = {
    color: isError ? 'red' : 'white',
    background: isError ? 'lightgray' : 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  };

  return (
    <div className={isError ? 'error' : undefined} style={style}>
      {notification}
    </div>
  );
};

export default Notification;
