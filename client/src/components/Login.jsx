import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
const loginService = require("../services/login")
const userService = require("../services/users")
const utils = require("../utils")

function Login() {
  const navigate = useNavigate()
  
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showLogin, setShowLogin] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    const res = await loginService.login(username, password)

    if (res.status < 400){
      setUsername("")
      setPassword("")
      navigate("/")
      window.location.reload(false)
    } else {
      utils.newErrorMsg(setLoginError, "Invalid username or password")
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    if(newUsername.length < 4 || newPassword.length < 4){
      utils.newErrorMsg(setRegisterError, "Username or password is too short, min length is 4")
    }

    const res = await userService.registerUser(newUsername, newPassword)

    if (res.response && res.response.data.error === "taken"){
      utils.newErrorMsg(setRegisterError, "Username is already taken")
    } else if (res.response && res.response.data.error === "tooshort") {
      utils.newErrorMsg(setRegisterError, "Username or password is too short, min length is 4")
    }

    if(res.status && res.status === 200){
      setNewUsername("")
      setNewPassword("")
      navigate("/")
      window.location.reload(false)
    }
  }

  return (
    <main>

      <form>
        <h1>Login</h1>
        <div>
          <label htmlFor="username">Username </label>
          <input className="short-field" id="username" type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password </label>
          <input className="short-field" id="password" type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <button className="btn" type="submit" onClick={handleLogin}>Login</button>
        </div>
      </form>

      {loginError.length > 3 && <div className='error-msg'>{loginError}</div>}


      <h2 className='register-btn'>Not a user?</h2>
      <button className="btn" onClick={() => setShowLogin(!showLogin)}>{showLogin ? "close" : "Register now"}</button>
      {showLogin && 
      <form>
        <h1>Register</h1>
        <div>
          <label htmlFor="newusername">Username </label>
          <input className="short-field" id='newusername' type="text" name="newusername"value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor='newpassword'>Password </label>
          <input className="short-field" id='newpassword' type="password" name="newpassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </div>
        <div>
          <button className="btn" type='submit' onClick={handleRegister}>Register</button>
        </div>
      </form>}
      
      {registerError.length > 3 && <div className='error-msg'>{registerError}</div>}

  </main>
  )
}

export default Login