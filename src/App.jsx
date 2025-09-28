import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'


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

  const handleAddBlog = event => {
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
      console.log(user)
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

  const blogFormRef = useRef()
  const [loginVisible, setLoginVisible] = useState(false)
  
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm
        newTitle={newTitle}
        newAuthor={newAuthor}
        newUrl={newUrl}
        likes={likes}
        handleTitleChange={({ target }) => setNewTitle(target.value)}
        handleAuthorChange={({ target }) => setNewAuthor(target.value)}
        handleUrlChange={({ target }) => setNewUrl(target.value)}
        handleLikesChange={({ target }) => setLikes(target.value)}
        handleAddBlog={handleAddBlog}
      />
    </Togglable>
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
          {blogForm()}
        </div>
      )}

      {user && (
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
      )}
      <Footer />
      </div>
      )
}

export default App