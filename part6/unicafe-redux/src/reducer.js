const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const goodIncrementedState = {...state, good: state.good + 1} 
      return goodIncrementedState
    case 'OK':
      const okdIncrementedState = {...state, ok: state.ok + 1}
      return okdIncrementedState
    case 'BAD':
      const badIncrementedState = {...state, bad: state.bad + 1} 
      return badIncrementedState
    case 'ZERO':
      return initialState
    default: return state
  }
  
}

export default counterReducer
