import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const PersonForm = ({ onSubmit, name, number, onNameChange, onNumberChange }) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>name: <input value={name} onChange={onNameChange} /></div>
        <div>number: <input value={number} onChange={onNumberChange} /></div>
        <div><button type="submit">add</button></div>
      </form> 
    </div>
  )
}


const Persons = ({ persons, deletePerson, text }) => (
  <ul>
    {persons.map(person => <SinglePerson key={person.id} person={person} deletePerson={() => deletePerson(person)} text={text} /> )}
  </ul>
)


const SinglePerson = ({ person, deletePerson, text }) => (
  <li>
    {person.name} {person.number} <button onClick={deletePerson}>{text}</button>
  </li>
)

const Filter = ({ filter, onFilterChange }) => {
  return (
        <div>filter shown with <input value={filter} onChange={onFilterChange} /></div>
  )
}

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={style}>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [filter, setFilter] = useState(persons)
  const [notification, setNotificatio] = useState(null)
  const [notificationStyle, setNotificatioStyle] = useState(null)

  useEffect(() => {
    const fetchData = async() => {
      const response = await personService.getAll()
      setPersons(response.data)
      setFilter(response.data)
    }
    fetchData()
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const filterInput = event.target.value
    setNewFilter(filterInput)
    setFilter(persons.filter(person => person.name.toLowerCase().includes(filterInput.toLowerCase())))

  }

  const addPerson = async (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)

    const personObject = {
      name: newName,
      number: newNumber
    }

    if(names.includes(newName)){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        console.log(persons.find(person => person.name === newName).id)
        try {
          const response = await personService.update(persons.find(person => person.name === newName).id, personObject)
          setPersons(persons.map(person => person.name === response.data.name ? response.data: person))
          setFilter(persons.map(person => person.name === response.data.name ? response.data: person))
        } catch (error) {
          console.log("error");
          sendNotification(`Information of ${newName} has already been removed from server`, "error")
        }
        
      }
      setNewName('')
      setNewNumber('')

      return
    }

    const response = await personService.create(personObject)
    setPersons(persons.concat(response.data))
    setFilter(persons.concat(response.data).filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase())))
    setNewName('')
    setNewNumber('')
    sendNotification(`Added ${personObject.name}`, "success")
  }

  const deletePersonById = async (person) => {
    if(window.confirm(`Delete ${person.name}?`)){
      console.log("delete");
      await personService.deletePerson(person.id)
      setPersons(persons.filter(curr => curr.id !== person.id))
      setFilter(persons.filter(curr => curr.id !== person.id))
    } else {
      console.log("cancel");
    }
    
  }

  const sendNotification = (text, style) => {
    setNotificatio(text)
    setNotificatioStyle(style)
    setTimeout(() => {
      setNotificatio(null)
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} style={notificationStyle} />

      <Filter 
        filter={newFilter} 
        onFilterChange={(event) => handleFilterChange(event)}
      />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={(event) => addPerson(event)} 
        name={newName} 
        number={newNumber}
        onNameChange={(event) => handleNameChange(event)}
        onNumberChange={(event) => handleNumberChange(event)}
      />
        
      <h2>Numbers</h2>

      <Persons persons={filter} deletePerson={deletePersonById} text="delete" />
    </div>
  )
}

export default App