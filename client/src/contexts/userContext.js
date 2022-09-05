import { createContext, useContext, useEffect, useState } from 'react'

export const UserContext = createContext()

export const useUserContext = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ token: null, username: null })

  useEffect(() => {
    const token = window.localStorage.getItem('token')
    const username = window.localStorage.getItem('username')
    setUser({ token, username })
  }, [])

  return <UserContext.Provider value={[user]}>{children}</UserContext.Provider>
}
