import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/NavBar'
import UserView from './components/UserView'
import BlogView from './components/BlogView'
import Blogs from './components/Blogs'
import Users from './components/Users'
import Login from './components/Login'
import Home from './components/Home'
import NotFound from './components/_404'
import { UserProvider } from './contexts/userContext'
import './index.css'

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/users" element={<Users />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </Router>
  )
}

export default App
