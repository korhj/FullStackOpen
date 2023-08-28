import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import blogService from './services/blogs'
import './App.css'


const Notification = ({ errorMessage }) => {
  if ( errorMessage === null) {
    return null
  }

  return (
    <div className={errorMessage.color}>
      {errorMessage.text}
    </div>
  )
}


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async(newBlog) => {
    try{
      const addedBlog = await blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      addedBlog.user = user
      const updatedBlogs = blogs.concat(addedBlog)
      const sortedBlogs = [...updatedBlogs].sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
      sendErrorMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'green')
    } catch(exception){
      console.log(exception)
      sendErrorMessage('adding a new blog failed', 'red')
    }

  }

  const updateLikes = async(newblog) => {
    try{
      const updatedBlog = await blogService.update(newblog)
      const updatedBlogs = blogs.map((blog) => blog.id === updatedBlog.id ? updatedBlog : blog)
      const sortedBlogs = [...updatedBlogs].sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    } catch(exception){
      console.log(exception)
      sendErrorMessage('Failed liking blog', 'red')
    }
  }

  const removeBlog = async(blogToDelete) => {
    if(window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)) {
      try{
        await blogService.deleteBlog(blogToDelete.id)
        const updatedBlogs = blogs.filter(blog => blog.id !== blogToDelete.id)
        setBlogs(updatedBlogs)
      } catch(exception){
        console.log(exception)
        sendErrorMessage('delete blog failed', 'red')
      }
    }
  }

  const blogList = () => {
    return (
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} updateBlogLikes={updateLikes} deleteBlog={removeBlog}/>
        )}
      </div>
    )
  }



  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      sendErrorMessage(`Logged in as ${user.name}`, 'green')
    } catch (exception) {
      sendErrorMessage('wrong username or password', 'red')
    }
  }

  const logout = () => {
    console.log('logout')
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    sendErrorMessage('Logged out succesfully', 'green')
  }

  const loginForm = () => (

    <div>
      <h3>Log in to application</h3>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const sendErrorMessage = (text, color) => {
    const errorObject = {
      text: text,
      color: color
    }
    setErrorMessage(errorObject)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const mainPage = () => (
    <div>
      <p>{user.name} logged in <button onClick={logout}>Logout</button></p>
      {blogForm()}
      {blogList()}
    </div>

  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <h2>blogs</h2>

      <Notification errorMessage={errorMessage} />

      {user === null ?
        loginForm() :
        mainPage()
      }

    </div>
  )
}

export default App