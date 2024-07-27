import React from 'react'
import {Navigate} from 'react-router-dom'

import DefaultPage from '../components/Default'
import AsideBar from '../components/AsideBar'
import AsideUL from '../components/AsideUL'
import Editor from '../components/Editor'
import '../static/css/index.css'

function Index() {
  return (
    <DefaultPage>
        <section className='main-container'>
            <AsideUL/>
            <AsideBar/>

            <Editor/>
        </section>
    </DefaultPage>
  )
}

export default Index