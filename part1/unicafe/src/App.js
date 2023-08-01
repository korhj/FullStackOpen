import { useState } from 'react'


const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({ text, value, symbol }) => {
  return (
    <tr>
      <td> {text} </td>
      <td> {value} {symbol} </td>
    </tr>

  )
}


const Statistics = ({ good, neutral, bad }) => {

  if((bad + neutral + good) > 0) {
    return (
      <div>
        
        <h1>statistics</h1>
        <table>
          <tbody>
            <StatisticLine text="good" value ={good} />
            <StatisticLine text="neutral" value ={neutral} />
            <StatisticLine text="bad" value ={bad} />
            <StatisticLine text="all" value ={bad + neutral + good} />
            <StatisticLine text="average" value ={((bad*-1  + good)/(bad + neutral + good)).toFixed(1)} />
            <StatisticLine text="positive" value ={((good)*100/(bad + neutral + good)).toFixed(1)} symbol="%" />
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <div>
      <h1>statistics</h1>
      No feedback given
    </div>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <h1>give feedback</h1>

      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />

      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
    
  )
}

export default App