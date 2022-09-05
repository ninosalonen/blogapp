import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
const userService = require("../services/users")

function UserView() {
  const { id } = useParams()

  const [error, setError] = useState("")
  const [user, setUser] = useState()

  useEffect(() => {
    userService.getUser(id).then(res => {
      if(res.error === "notfound"){
        setError(`User with the id ${id} not found :/`)
        return
      }
      setUser(res.data)
    })
  }, [id])

  if (error.length > 1) return <main><h1>{error}</h1><Link to='/'><span className='inline-link'>back to home</span></Link></main>
  if (!user) return <main></main>
  
  return (
    <main>

      <h1>{user.username}</h1>

      <div className='userview-flex'>
        <div className='userview-box'>
          <h2>Blogs</h2>
          {user.blogs.map(blog => 
            <Link to={`/blogs/${blog.id}`} key={blog.id}>
              <div className="blog-card" key={blog.id}>
                <h2>{blog.title}</h2>
                <p>Likes: {blog.likes}</p>
              </div>
            </Link>
          )}
          {user.blogs.length === 0 && <div>This user has no blogs</div>}
        </div>

        <div className='userview-box'>
          <h2>Liked blogs</h2>
          {user.likedBlogs.map(blog => 
            <Link key={blog.id} to={`/blogs/${blog.id}`}>
              <div className="blog-card" key={blog.id}>
                <h2>{blog.title}</h2>
              </div>
            </Link>
          )}
          {user.likedBlogs.length === 0 && <div>This user hasn't liked any blogs</div>}
        </div>
      </div>


    </main>
  )


}

export default UserView