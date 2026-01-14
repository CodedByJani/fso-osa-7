const Notification = ({ message }) => {
  if (!message) return null

  const style = {
    border: '1px solid green',
    padding: 10,
    margin: 10,
    color: 'green'
  }

  return <div style={style}>{message}</div>
}

export default Notification
