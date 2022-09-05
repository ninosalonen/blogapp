import axios from 'axios'

const baseUrl = '/api/blogs'

export const getBlogs = async () => {
  try {
    const res = await axios.get(baseUrl)
    return res
  } catch (e) {
    return e
  }
}

export const getBlog = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/${id}`)
    return res
  } catch {
    return { error: 'notfound' }
  }
}

export const like = async (token, id) => {
  try {
    const res = await axios.put(
      `${baseUrl}/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return res
  } catch (e) {
    return e
  }
}

export const postBlog = async (token, title, author, content) => {
  try {
    const res = await axios.post(
      baseUrl,
      { title, author, content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return res
  } catch (e) {
    return e
  }
}

export const postComment = async (token, id, comment) => {
  try {
    const res = await axios.post(
      `${baseUrl}/${id}/comments`,
      { comment },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return res
  } catch (e) {
    return e
  }
}

export const deleteBlog = async (token, id) => {
  try {
    const res = await axios.delete(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (e) {
    return e
  }
}
