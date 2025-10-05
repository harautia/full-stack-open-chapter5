import { render, screen } from '@testing-library/react'
import BlogDetails from './BlogDetails'
import Blog from './Blog'

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

