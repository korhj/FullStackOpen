import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },

})

export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = id => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const anecdoteToChange = anecdotes.find(anecdote => anecdote.id === id) 
    const changedAnecdote = {
      ...anecdoteToChange, votes: anecdoteToChange.votes + 1
    }
    await anecdoteService.updateAnecdote(changedAnecdote)
    const updatedAnecdotes = anecdotes.map(anecdote => anecdote.id !== id ?  anecdote : changedAnecdote)
    dispatch(setAnecdotes(updatedAnecdotes))
  }
    
}

export default anecdoteSlice.reducer