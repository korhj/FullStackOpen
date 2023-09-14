import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'


const Anecdote = ({ anecdote, handleclick }) => {
    return(
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={handleclick}>vote</button>
          </div>
        </div>
    )

}

const AnecdoteList = () => {
    const anecdotes = useSelector(({ anecdotes, filter}) => {
        const filteredAnecdotes = anecdotes.filter((anecdote) => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
        return filteredAnecdotes.sort((a, b) => b.votes - a.votes)
    })
    const dispatch = useDispatch()
    
    return(
        <ul>
            {anecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleclick={ async () => {
                            dispatch(vote(anecdote.id))
                            dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
                        }
                    }
                />
            )}
        </ul>
    )
}

export default AnecdoteList
