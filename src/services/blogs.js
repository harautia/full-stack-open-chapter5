import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAllBlogs = () => {
  return axios.get(baseUrl)
}

const createBlog = newObject => {
  const config = {
  headers: { Authorization: token }
  }
  
  return axios.post(baseUrl, newObject, config)
  //const response = await axios.post(baseUrl, newObject, config)
  //return response.data
}

const deleteBlog = blogId => {
  console.log(blogId)
  return axios.delete(`${baseUrl}/${blogId}`)
}

export default { 
  getAllBlogs: getAllBlogs, 
  createBlog: createBlog,
  deleteBlog: deleteBlog,
  setToken: setToken
}