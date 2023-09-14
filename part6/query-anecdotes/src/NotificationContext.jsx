import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
      case "VOTE":
          return `Voted '${action.payload}'`
      case "CREATE":
          return `Created anecdote '${action.payload}'`
      case "ERROR":
          return action.payload
      case "RESET":
          return null
      default:
          return state
    }
  }

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, null)

    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )

}

export default NotificationContext