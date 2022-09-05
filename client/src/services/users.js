import axios from 'axios'
const loginService = require('./login')
const baseUrl = '/api/users'

export const getUsers = async () => {
  try {
    const res = await axios.get(baseUrl)
    return res
  } catch (e) {
    return e
  }
}

export const getUser = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/${id}`)
    return res
  } catch {
    return { error: 'notfound' }
  }
}

export const registerUser = async (username, password) => {
  try {
    await axios.post(baseUrl, { username, password })
    const res = await loginService.login(username, password)
    return res
  } catch (e) {
    return e
  }
}

export const logout = () => {
  window.localStorage.clear()
  window.location.reload(false)
}
