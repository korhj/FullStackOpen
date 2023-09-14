import { useContext } from 'react'
import NotificationContext from '../NotificationContext'



const Notification = () => {

  const [notification, dispatch] = useContext(NotificationContext)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (notification == null) {
    return null
  } else {
    setTimeout(() => {
      dispatch({ type: 'RESET'})
  }, 5000)
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
