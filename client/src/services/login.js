import axios from 'axios'

const baseUrl = '/api/login'

export const login = async (username, password) => {
  try {
    const res = await axios.post(baseUrl, { username, password })
    window.localStorage.setItem('token', res.data.token)
    window.localStorage.setItem('username', res.data.username)
    window.localStorage.setItem('likedBlogs', res.data.likedBlogs)
    window.localStorage.setItem('id', res.data.id)
    return res
  } catch (e) {
    return e
  }
}
