import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from "../contexts/userContext"

const blogService = require("../services/blogs")
const utils = require("../utils")

function Homepage() {
  const [user] = useUserContext()
  const navigate = useNavigate()

  const [error, setError] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    if(title.length < 1 || content.length < 1){
      utils.newErrorMsg(setError, "Please provide some content first")
      return
    }
    blogService.postBlog(user.token, title, user.username, content).then(res => {
      setContent("")
      setTitle("")
      navigate(`/blogs/${res.data.id}`)
    })
  }

  if(user.token){
    return (
      <main>
        <h1>Welcome {user.username}</h1>
        <Link to={`/users/${window.localStorage.getItem("id")}`}><button className='btn'>Go to profile</button></Link>
        <h1>New blog</h1>
        <form>
          <div>
            <label htmlFor="title">Title</label>
            <input className="short-field" id="title" required type="text" value={title} onChange={e => {setTitle(e.target.value)}}></input>
          </div>
          <div>
            <label htmlFor="content">Content</label>
            <textarea id="content" required type="text" rows={15} cols={50} value={content} onChange={e => {setContent(e.target.value)}}></textarea>
          </div>
          <button className="btn" type="submit" onClick={handleSubmit}>Post</button>
          {error.length > 1 && <div className='error-msg'>{error}</div>}
        </form>

      </main>
    )

  } else {
    return (
      <main>
        <div className='logged-out-home'>
          <h1>Welcome to Blogapp</h1>
          <h2>You need to be a registered user to post blogs, like blogs or comment on blogs</h2>
          <Link to="/login"><button className="btn">Register or login</button></Link>
          <p>Feel free to check out the <Link to="/blogs"><span className='inline-link'>blogs</span></Link> section or the <Link to="/users"><span className='inline-link'>users</span></Link> section!</p>
        </div>
      </main>
    )
  }
}

export default Homepage