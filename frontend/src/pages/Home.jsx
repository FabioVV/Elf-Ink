import {useEffect} from 'react'
import {Link} from 'react-router-dom'

import DefaultPage from '../components/Default'
import Login from '../components/Login'

import '../static/css/home.css'

import {applyTheme} from '../lib/theme'

function Home() {

  useEffect(() => {
    document.querySelector('main').classList.add('main')
    applyTheme()
    window.flash('Welcome', 'error')

  }, [])

  return (
    <DefaultPage>
      
      <h1>Welcome to Elf Ink!</h1>

      <Login />
      <hr />

      <Link to={`/register`}>Register</Link>
    </DefaultPage>
  )
}

export default Home