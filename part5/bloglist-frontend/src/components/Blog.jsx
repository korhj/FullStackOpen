import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, updateBlogLikes, deleteBlog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const updateLikes = () => {
    blog.likes = blog.likes + 1
    updateBlogLikes(blog)
  }

  return(
    <div style={blogStyle}>
      <div style={hideWhenVisible} className='compact'>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible} className='expanded'>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(false)}>hide</button><br/>
        {blog.url}<br/>
        likes {blog.likes} <button onClick={updateLikes} className='likeButton'>like</button><br/>
        {blog.user.name}<br/>
        {user.username === blog.user.username ?
          <div><button onClick={() => deleteBlog(blog)}>remove</button><br/></div>
          : ''
        }
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  updateBlogLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}



export default Blog