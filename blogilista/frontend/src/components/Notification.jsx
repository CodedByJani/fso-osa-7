import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (message === null) return null

  const isError = message === 'wrong credentials'

  const style = {
    color: isError ? 'red' : 'white',
    background: isError ? 'lightgray' : 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  }

  return (
    <div className={isError ? 'error' : undefined} style={style}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string
}

export default Notification
