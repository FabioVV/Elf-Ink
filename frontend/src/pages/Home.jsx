import {useEffect} from 'react'
import {Link} from 'react-router-dom'

import DefaultPage from '../components/Default'
import Login from '../components/Login'

import '../static/css/home.css'

import {getCSRF} from '../lib/UserRequests'
import {applyTheme} from '../lib/theme'

function Home() {

  const handleGetCSRF = async () => {await getCSRF(null)} 
  
  useEffect(() => {
    document.querySelector('main').classList.add('main')
    applyTheme()
    handleGetCSRF()
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