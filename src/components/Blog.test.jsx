import { render, screen } from '@testing-library/react'
import BlogDetails from './BlogDetails'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'



test('Basic Blog content', () => {
  const blogs = [{
    id:1,
    title: 'Testing Title',
    author: 'Test Author'
  }]
  
  render(<Blog blogs={blogs}/>)

  const titleTest = screen.getByText('Testing Title')
  const authorTest = screen.getByText('Test Author')

  expect(titleTest).toBeDefined()
  expect(authorTest).toBeDefined()
})

test('Detailed Blog content', () => {
  const blogs = [{
    id:1,
    title: 'Testing Title',
    author: 'Test Author',
    url: 'Test URL',
    likes: 1
  }]
  
  const handleAddLike = vi.fn()
  const handleBlogDelete = vi.fn()

  render(<BlogDetails blogs={blogs} handleAddLike={handleAddLike} handleBlogDelete={handleBlogDelete} />)

  const titleTest = screen.getByText('Testing Title')
  const authorTest = screen.getByText('Test Author')
  const urlTest = screen.getByText('Test URL')
  const likesTest = screen.getByText('1')

  expect(titleTest).toBeDefined()
  expect(authorTest).toBeDefined()
  expect(urlTest).toBeDefined()
  expect(likesTest).toBeDefined()
})

test('clicking the like button twice', async () => {
  const blogs = [{
    id:1,
    title: 'Testing Title',
    author: 'Test Author',
    url: 'Test URL',
    likes: 1
  }]

  const mockHandler = vi.fn()
  const handleBlogDelete = vi.fn()

  render(<BlogDetails blogs={blogs} handleAddLike={mockHandler} handleBlogDelete={handleBlogDelete} />)

  const user = userEvent.setup()
  const button = screen.getByText('Add Like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
/*
test('Verify the blogform component', async () => {
  const blogs = [{
    newTitle: 'New Title',
    newAuthor: 'New Author',
    newUrl: 'New URL',
    likes: 1000
  }]

  const mockHandler = vi.fn()
  const handleAddLike = vi.fn()
  const handleBlogDelete = vi.fn()


  render(<BlogForm newTitle={blogs.newTitle} newAuthor={blogs.newAuthor} newUrl={blogs.newUrl} likes={blogs.likes} />)

  const user = userEvent.setup()
  const button = screen.getByText('New Title')
//  await user.click(button)

//  expect(mockHandler.mock.calls).toHaveLength(2)
})
*/