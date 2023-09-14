import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        newNotification(state, action) {
            return action.payload
        },
        removeNotification(state, action) {
            return null
        },
    }
})

export const { newNotification, removeNotification } = notificationSlice.actions

export const setNotification = (text, time) => {
    return dispatch => {
        dispatch(newNotification(text))
        setTimeout(() => {
            dispatch(removeNotification())
        }, time * 1000)
    }
}

export default notificationSlice.reducer