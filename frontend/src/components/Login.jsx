import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {loginUser} from '../lib/UserRequests'

function Login() {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }   

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const User = {
            username: username,
            password: password,
        }

        const r = await loginUser(e, User)

        if(r['error']){
            window.flash(r['error'], 'error')
        } else {
            localStorage.setItem("token", r['token']);
            localStorage.setItem("username", r['username']);

            navigate(`/index`)
        }

    } 

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="username">Username</label>
            <input required value={username} onChange={handleUsername} type="text" name="username" id="username" placeholder="Username"/>
        </div>

        <div>
            <label htmlFor="password">Password</label>
            <input required value={password} onChange={handlePassword} type="password" name="password" id="password" placeholder="********"/>
        </div>

          <input type="submit" value="Login"/>
    </form>
  )
}

export default Login