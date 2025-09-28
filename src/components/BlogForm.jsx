  const BlogForm = ({newTitle, newAuthor, newUrl, likes, handleAddBlog,
        handleTitleChange, handleAuthorChange, handleUrlChange, handleLikesChange}) =>  {
    return (
    <div>
    <h2> Add blog to database </h2>
    <form onSubmit={handleAddBlog}>
      <div>Blog Title: <input value={newTitle} onChange={handleTitleChange}/></div>
      <div>Blog Author: <input value={newAuthor} onChange={handleAuthorChange} /></div>
      <div>Blog URL: <input value={newUrl} onChange={handleUrlChange} /></div>
      <div>Likes: <input value={likes} onChange={handleLikesChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
    </div>
    )
}
export default BlogForm