import React from 'react'
import {Link} from 'react-router-dom'

import DefaultPage from '../components/Default'
import Login from '../components/Login'
import '../static/css/home.css'


function Home() {
  return (
    <DefaultPage>
      <h1>Welcome</h1>
      
      <Login/>
      <hr />

      <Link to={`/register`}>Register</Link>
    </DefaultPage>
  )
}

export default Home