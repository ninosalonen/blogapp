import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
const blogService = require('../services/blogs') 

function Blogs() {
  const [blogs, setBlogs] = useState()
  const [search, setSearch] = useState("")

  useEffect(() => {
    blogService.getBlogs().then(res => {
      setBlogs(res.data)
    })
  }, [])

  function filterBlogs() {
    if(!blogs){
      return blogs
    }
    return blogs.filter(blog => blog.author.toLowerCase().includes(search) || blog.title.toLowerCase().includes(search))
  }

  const filteredBlogs = filterBlogs()

  return (
    <main className='table-main'>
      <input type="text" placeholder='search title or author' className="search-field" value={search} onChange={e => setSearch(e.target.value.toLowerCase())}/>
      {blogs &&       
      <table>

        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Likes</th>
          </tr>
        </thead>

        <tbody>
        {filteredBlogs.map((blog) => 
            <tr key={blog.id}>
              <td className='clickable-td'>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
              <td className='clickable-td'>
                <Link to={`/users/${blog.user.id}`}>{blog.author}</Link>
              </td>
              <td>{blog.likes}</td>
            </tr>
        )}
        </tbody>

      </table>}

    </main>
  )
}

export default Blogs