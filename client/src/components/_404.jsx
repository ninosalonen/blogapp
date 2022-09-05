import React from 'react'
import {Link} from 'react-router-dom'

function NotFound() {
  return (
    <main>
      <h1>Page not found :(</h1>
      <Link to="/"><span className='inline-link'>back to home</span></Link>
    </main>
  )
}

export default NotFound