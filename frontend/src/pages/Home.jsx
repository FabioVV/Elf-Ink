import React from 'react'
import {Link} from 'react-router-dom'

import DefaultPage from '../components/Default'
import Login from '../components/Login'
import '../static/css/home.css'

function Home() {

  document.querySelector('main').classList.add('main')
  return (
    <DefaultPage>
      
      <Login />
      <hr />

      <Link to={`/register`}>Register</Link>
    </DefaultPage>
  )
}

export default Home