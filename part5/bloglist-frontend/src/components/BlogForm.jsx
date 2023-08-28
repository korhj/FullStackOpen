import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    createBlog(blogObject)

  }


  return(
    <div>
      <h2>Create new</h2>

      <form onSubmit={addBlog}>
        title:<input
          value={newTitle}
          onChange={event => setTitle(event.target.value)}
          id='titleInput'
        /><br/>
        author:<input
          value={newAuthor}
          onChange={event => setAuthor(event.target.value)}
          id='authorInput'
        /><br/>
        url:<input
          value={newUrl}
          onChange={event => setUrl(event.target.value)}
          id='urlInput'
        /><br/>
        <button type="submit">create</button>
      </form>
    </div>

  )
}

export default BlogForm