import axios from 'axios'
const baseUrl = 'api/persons'

const getAll = async() => {
    return await axios.get(baseUrl)
}
  
const create = async (newObject) => {
    return await axios.post(baseUrl, newObject)
}
  
const update = async (id, newObject) => {
    return await axios.put(`${baseUrl}/${id}`, newObject)
}

const deletePerson = async (id) => {
    return await axios.delete(`${baseUrl}/${id}`)
}




export default { getAll, create, update, deletePerson }