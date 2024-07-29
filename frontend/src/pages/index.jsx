import {useEffect, useState} from 'react'

import DefaultPage from '../components/Default'
import AsideNotes from '../components/AsideNotes'
import AsideUL from '../components/AsideUL'
import Editor from '../components/Editor'

import '../static/css/index.css'
import '../static/css/toolbox.css'
import '../static/css/markdown.css'

import {submitNewActiveNotebook, getActiveNotebook, getNotebooks} from '../lib/NotebookRequests'

function Index() {
  document.querySelector('main').classList.remove('main')

  const [leafs, setLeafs] = useState([])
  const [activeNotebook, setActiveNotebook] = useState(null)
  const [notebooks, setNotebooks] = useState([])

  const handleActiveNotebook = async() => {

    const newActiveNotebook = {
      ID: activeNotebook?.ID
    }

    const r = await submitNewActiveNotebook(null, newActiveNotebook)

    if(r['error']){
      alert(r['error'])
    } else {
      handleGetNotebooks()
    }
  }

  const _getActiveNotebook = async() => {
    const r = await getActiveNotebook(null, null)

    if(r['error']){
      alert(r['error'])
    } else {
      setActiveNotebook(r)
    }
  }

  const handleGetNotebooks = async () => {

    const Search = {
      title: ''
    }

    const r = await getNotebooks(null, Search)

    if(r['error']){
        alert(r['error'])
    } else {
        setNotebooks([...r])
        if(setLeafs) setLeafs(r['Leafs'] || [])
    }

} 

  useEffect(() => {
    _getActiveNotebook()
    handleGetNotebooks()
  }, []);

  useEffect(() => {if(activeNotebook)handleActiveNotebook()}, [activeNotebook])

  return (
    <DefaultPage>
        <section className='main-container'>
          
          <AsideUL notebooks={notebooks} setActiveNotebook={setActiveNotebook} handleGetNotebooks={handleGetNotebooks}/>

          <AsideNotes activeNotebook={activeNotebook}/>

          <Editor/>

        </section>
    </DefaultPage>
  )
}

export default Index