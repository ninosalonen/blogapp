import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useUserContext } from '../contexts/userContext'

import { v4 as uuidv4 } from 'uuid';
const blogService = require('../services/blogs')

function BlogView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user] = useUserContext()

  const [error, setError] = useState("")
  const [comment, setComment] = useState("")
  const [blog, setBlog] = useState()
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [userId, setUserId] = useState()

  useEffect(() => {
    blogService.getBlog(id).then(res => {

      if(res.error === "notfound"){
        setError(`Blog with id ${id} not found :( `)
        return
      }
      
      if(!res.data){
        setError("This blog doesn't exist :(")
        return
      };

      setBlog(res.data)
      setLikes(res.data.likes)
      setUserId(res.data.user)

      const liked = window.localStorage
        .getItem("likedBlogs").split(",")
        .filter(blog => blog === res.data.id)

      if(liked.length > 0){
        setLiked(true)
      }
    })}, [id])

  if (error.length > 1) return <main><h1>{error}</h1><Link to='/'><span className='inline-link'>back to home</span></Link></main>
  if (!blog) return <main></main>
  return (
    <main className='blogview-box'>
      <div className="blogview-box">
        <h1>{blog.title}</h1>
        <h2><Link to={`/users/${userId}`}>by: <span className='inline-link'>{blog.author}</span></Link></h2>
        <p className='blog-text'>{blog.content}</p>
        <div>Likes: {likes}</div>

        <div>
          {(user.token && user.username) && <button disabled={liked} className="btn like-btn" onClick={() => {
            blogService.like(user.token, blog.id).then(_res => {
              setLikes(likes + 1)
              setLiked(true)
              const likedBlogs = window.localStorage.getItem("likedBlogs")
              window.localStorage.setItem("likedBlogs", [likedBlogs, blog.id])
            })
          }}>{liked ? "Liked" : "Like"}</button>}

          {user.username === blog.author && <button className="btn delete-btn" onClick={() => {
            blogService.deleteBlog(user.token, blog.id).then(_res => {
              navigate(`/users/${userId}`)
            })
          }}>Delete</button>}

          {(user.token && user.username) && 
          <div className="comment-post-box">
            <h2>Post a comment</h2>
            <textarea type="text" className='comment-post-field' value={comment} onChange={e => setComment(e.target.value)}></textarea>
            <button className="btn comment-btn" onClick={() => {

              if(comment.length < 1){
                return
              }

              blogService.postComment(user.token, id, comment).then(res => {
                setBlog(res.data)
                setComment("")
              })

            }}>comment</button>
          </div>}
        </div>
        <div className='comment-post-box'>
          <h2>Comments</h2>
          {blog.comments.map(comment => <p className="comment" key={uuidv4()}>{comment}</p>)}
        </div>
      </div>
    
    </main>
  )
}

export default BlogView