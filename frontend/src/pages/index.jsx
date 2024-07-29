import {useState} from 'react'

import DefaultPage from '../components/Default'
import AsideNotes from '../components/AsideNotes'
import AsideUL from '../components/AsideUL'
import Editor from '../components/Editor'

import '../static/css/index.css'
import '../static/css/toolbox.css'
import '../static/css/markdown.css'

function Index() {
  document.querySelector('main').classList.remove('main')

  const [leafs, setLeafs] = useState([])

  return (
    <DefaultPage>
        <section className='main-container'>
          
          <AsideUL setLeafs={setLeafs}/>

          <AsideNotes leafs={leafs}/>

          <Editor/>

        </section>
    </DefaultPage>
  )
}

export default Index