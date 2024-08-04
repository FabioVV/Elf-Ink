import {useEffect} from 'react'
import {Link} from 'react-router-dom'

import DefaultPage from '../components/Default'
import Login from '../components/Login'

import '../static/css/home.css'

import {applyTheme} from '../lib/theme'

import {Greet} from "/wailsjs/go/main/App";


function Home() {

  async function doGreeting(name) {
    const r =  await Greet('Fábio')
    alert(r)
  }
  
  useEffect(() => {
    document.querySelector('main').classList.add('main')
    applyTheme()
  }, [])

  return (
    <DefaultPage>
      
      <h1>Welcome to Elf Ink!</h1>
      <h1 onClick={doGreeting}>Click me </h1>

      <Login />
      <hr />

      <Link to={`/register`}>Register</Link>
    </DefaultPage>
  )
}

export default Home