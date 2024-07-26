import React, { useState } from 'react'
import {Link} from 'react-router-dom'

import DefaultPage from './Default'
import { submitNewUser } from '../lib/UserRequests'

function Register() {

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

        const r = await submitNewUser(e, User)

        if(r['error']){
            alert(r['error'])
        } else {
            console.log(r)
        }

    } 

    return (
        <DefaultPage>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input required value={username} onChange={handleUsername} type="text" name="username" id="username" placeholder="Username"/>
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input required value={password} onChange={handlePassword} type="password" name="password" id="password" placeholder="********"/>
                </div>

                <input type="submit" value="Create account"/>
            </form>
            <Link to={`/`}>Back to login</Link>
        </DefaultPage>
    )
}

export default Register