import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Footer from './components/Footer'


const App = () => {

  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const handleBlogDelete = (blogId) => {
  blogService
    .deleteBlog(blogId)
    .then(response => {
      console.log(response);
      showBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId))
    })
  }

  const [newTitle, setNewTitle] = useState('')
  const handleTitleChange = (event) => {
    console.log('handleAuthorChange Executed', event.target.value)
    setNewTitle(event.target.value)
  }

  const [newAuthor, setNewAuthor] = useState('')
  const handleAuthorChange = (event) => {
    console.log('handleAuthorChange Executed', event.target.value)
    setNewAuthor(event.target.value)
  }

  const [newUrl, setNewUrl] = useState('')
  const handleUrlChange = (event) => {
    console.log('handleUrlChange Executed', event.target.value)
    setNewUrl(event.target.value)
  }

  const [likes, setLikes] = useState('')
  const handleLikesChange = (event) => {
    console.log('handleLikesChange Executed', event.target.value)
    setLikes(event.target.value)
  }

  const [blogs, showBlogs]= useState([])
  useEffect(() => {
    blogService
    .getAllBlogs()
      .then(response => {
        showBlogs(response.data)
      })
  }, [])
  console.log('render', blogs.length, 'blogs')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleAddBlog = (event) => {
  event.preventDefault()
  const blogObject = {
    id: String(blogs.length + 1),
    title: newTitle, 
    author: newAuthor,
    url: newUrl,
    likes: likes
  }
  blogService
  .createBlog(blogObject)
    .then(response => {
      console.log(response)
      showBlogs(blogs.concat(response.data))
    })
  setNewTitle('')
  setNewAuthor('')
  setNewUrl('')
  setLikes('')
  setNotificationMessage(
    `Added blog title: '${newTitle}'`
  )
  console.log(notificationMessage)
  setTimeout(() => {
    setNotificationMessage(null)
  }, 5000)
  }

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const handleLogin = async event => {
    event.preventDefault()
    console.log('logging in with', username, password)
    
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)) 

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }}

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )   

  const blogForm = () => (
    <form onSubmit={handleAddBlog}>
      <div>Blog Title: <input value={newTitle} onChange={handleTitleChange}/></div>
      <div>Blog Author: <input value={newAuthor} onChange={handleAuthorChange} /></div>
      <div>Blog URL: <input value={newUrl} onChange={handleUrlChange} /></div>
      <div>Likes: <input value={likes} onChange={handleLikesChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
 
  return (
    <div>
      <h1>The Blog Listing</h1>
      <Notification message={errorMessage} className="error"/>
      <Notification message={notificationMessage} className="info" />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
        <h2> Add blog to database </h2>
        </div> )}
      {user && (
        <>
        {blogForm()}
      <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>URL</th>
            <th>Likes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>{blog.author}</td>
              <td> <a href={blog.url} target="_blank" rel="noopener noreferrer"> {blog.url} </a></td>
              <td>{blog.likes}</td>
              <td> <button onClick={() => handleBlogDelete(blog.id)}> Delete </button> </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </>)}
      <Footer />
      </div>
      )
}

export default App