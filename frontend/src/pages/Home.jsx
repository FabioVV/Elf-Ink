import {useEffect} from 'react'
import {Link} from 'react-router-dom'

import DefaultPage from '../components/Default'
import Login from '../components/Login'

import '../static/css/home.css'

import {getCSRF} from '../lib/UserRequests'

function Home() {

  const handleGetCSRF = async () => {
    const r = await getCSRF(null)
  } 
  useEffect(() => {
    document.querySelector('main').classList.add('main')
    handleGetCSRF()
  }, [])

  return (
    <DefaultPage>
      
      <Login />
      <hr />

      <Link to={`/register`}>Register</Link>
    </DefaultPage>
  )
}

export default Home