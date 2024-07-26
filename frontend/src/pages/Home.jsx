import React from 'react'
import DefaultPage from '../components/Default'
import '../static/css/home.css'

const Home = () => {
  return (
    <DefaultPage>
            <form>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" placeholder="Username"/>
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="********"/>
                </div>

                <input type="submit" value="Login"/>
            </form>
    </DefaultPage>
  )
}

export default Home