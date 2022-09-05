import React, { useEffect } from 'react'
import { NavLink, useNavigate,  useLocation } from "react-router-dom";
import {useUserContext} from '../contexts/userContext'
const userService = require("../services/users")

function Navbar() {
  const navigate = useNavigate()
  const [user] = useUserContext()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return (
    <nav>
      <ul className='nav'>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav__link--active' : '') + " nav__link"}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/blogs" className={({ isActive }) => (isActive ? 'nav__link--active' : '') + " nav__link"}>Blogs</NavLink>
        </li>
        <li>
          <NavLink to="/users" className={({ isActive }) => (isActive ? 'nav__link--active' : '') + " nav__link"}>Users</NavLink>
        </li>
        <li> 
          {user.token ? <button onClick={() => {
            navigate("/")
            userService.logout()
          }} className="nav__link">Logout</button> : <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav__link--active' : '') + " nav__link"}>Login</NavLink>}
        </li>
      </ul>
    </nav>
  )
}

export default Navbar