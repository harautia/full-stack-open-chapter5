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
  const [, setLog] = useState('')

  const handleBlogDelete = (blogId) => {
    if (window.confirm('Do you want to delete the blog?')) {
      blogService
        .deleteBlog(blogId)
        .then(response => {
          console.log(response)
          showBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId))
        })
    }
    else {
      setLog('Action discarded')
    }
  }

  const handleAddLike = (blogId, likes) => {
    console.log(blogId)
    console.log(likes)
    const content = {
      likes: likes + 1
    }
    blogService
      .addLikes(blogId, content)
      .then(response => {
        console.log(response)
        showBlogs(blogs.map(blog => blog.id === blogId ? { ...blog, likes: likes + 1 } : blog
        ))
      })
  }

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [likes, setLikes] = useState('')

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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    window.localStorage.clear()
    setUser(null)
  }

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
  const sortedBlogs = blogs.sort((a, b) => a.likes - b.likes)

  const blogDetailsForm = () => (
    <Togglable buttonLabel="show details" ref={blogFormRef}>
      <div>
        <h3> Blog Details</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>URL</th>
              <th>Likes</th>
              <th>Add One Like</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedBlogs.map(blog => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
                <td>{blog.author}</td>
                <td> <a href={blog.url} target="_blank" rel="noopener noreferrer"> {blog.url} </a></td>
                <td>{blog.likes}</td>
                <td> <button onClick={() => handleAddLike(blog.id, blog.likes)}> Add Like </button> </td>
                <td> <button id="windowButton" onClick={() => handleBlogDelete(blog.id)}> Delete </button> </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
          <p>{user.name} logged in <button onClick={() => handleLogout(user)}> Logout</button> </p>
          {blogForm()}
        </div>
      )}
      {user && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Blog Titles</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td>{blog.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {user && blogDetailsForm()}
      <Footer />
    </div>
  )
}

export default App