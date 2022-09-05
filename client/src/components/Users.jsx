import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const userService = require("../services/users")

function Users() {
  const [users, setUsers] = useState()
  const [search, setSearch] = useState("")


  useEffect(() => {
    userService.getUsers().then(res => {
      setUsers(res.data)
    })
  }, []) 

  function filterUsers() {
    if(!users){
      return users
    }
    const orderedUsers = users.sort((a,b) => {
      return b.blogs.length - a.blogs.length
    })
    return orderedUsers.filter(user => user.username.toLowerCase().includes(search))
  }

  const filteredUsers = filterUsers()

  return (
    <main>
      <input type="text" placeholder='search username' className="search-field" value={search} onChange={e => setSearch(e.target.value.toLowerCase())}/>
      {users && 
      <table>

        <thead>
          <tr>
            <th>Username</th>
            <th>Blogs</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => 
            <tr key={user.id}>
              <td className='clickable-td'><Link to={`/users/${user.id}`}>{user.username}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>)}
        </tbody>

      </table>
      }

    </main>
  )
}

export default Users