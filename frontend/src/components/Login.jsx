import {useState} from 'react'
import {loginUser} from '../lib/UserRequests'
import {useNavigate} from 'react-router-dom'

function Login() {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

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
            alert(r['error'])
        } else {
            navigate(`/index`)
            console.log(r)
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