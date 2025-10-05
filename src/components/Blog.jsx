const Blog = ({ blogs }) => {
  return (
    <table>
        <thead>
        <tr>
            <th>Blog Title</th>
            <th>Blog Author</th>
        </tr>
        </thead>
        <tbody className='basicInfo'>
            {blogs.map(blog => (
            <tr key={blog.id}>
                <td>{blog.title}</td>
                <td>{blog.author}</td>
            </tr>
        ))}
        </tbody>
    </table>
)
}

export default Blog
