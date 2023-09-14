import { useSelector } from 'react-redux'



const Notification = () => {

  const notification = useSelector(({ notification }) => notification)
  console.log(notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div>
      {notification !== null ? (
        <div style={style}>
          {notification}
        </div>
      ) : null}
    </div>
  )
}

export default Notification