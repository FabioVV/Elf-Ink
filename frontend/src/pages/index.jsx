import {useEffect, useState} from 'react'

import DefaultPage from '../components/Default'
import AsideNotes from '../components/AsideNotes'
import AsideUL from '../components/AsideUL'
import Editor from '../components/Editor'

import '../static/css/index.css'
import '../static/css/toolbox.css'
import '../static/css/markdown.css'

import {submitNewActiveNotebook, getActiveNotebook, getNotebooks, getActiveNotebookLeafs} from '../lib/NotebookRequests'

function Index() {
  document.querySelector('main').classList.remove('main')

  const [searchTitle, setSearchTitle] = useState('')
  const [searchActive, setSearchActive] = useState(false)
  const [searchInactive, setSearchInactive] = useState(false)
  const [searchInProgress, setSearchInProgress] = useState(false)

  const [activeNotebook, setActiveNotebook] = useState(null)
  const [notebooks, setNotebooks] = useState([])

  const handleActiveNotebook = async() => {
    if(!activeNotebook?.ID) return 

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

    const Search = {
      title: searchTitle,
      active: searchActive,
      inactive: searchInactive,
      in_progress: searchInProgress,
    }

    const r = await getActiveNotebook(null, Search)

    if(r['error']){
      alert(r['error'])
    } else {
      setActiveNotebook(r)
    }
  }

  const handleGetNotebooks = async () => {
    const r = await getNotebooks(null, null)

    if(r['error']){
      alert(r['error'])
    } else {
      setNotebooks([...r])
    }

  } 

  useEffect(() => {
    handleGetNotebooks()
    _getActiveNotebook()
  }, [])

  useEffect(() => {if(activeNotebook)handleActiveNotebook()}, [activeNotebook])

  return (
    <DefaultPage>
        <section className='main-container'>
          
          <AsideUL 
            notebooks={notebooks} 
            setActiveNotebook={setActiveNotebook}
            handleGetNotebooks={handleGetNotebooks}
          />

          <AsideNotes 
            leafs={activeNotebook?.Leafs} 
            activeNotebook={activeNotebook} 
            handleGetNotebooks={handleGetNotebooks}
            handleGetLeafs={_getActiveNotebook}

            searchTitle={searchTitle}
            searchActive={searchActive}
            searchInactive={searchInactive}
            searchInProgress={searchInProgress}

            setSearchTitle={setSearchTitle}
            setSearchActive={setSearchActive}
            setSearchInactive={setSearchInactive}
            setSearchInProgress={setSearchInProgress}
          />

          <Editor/>

        </section>
    </DefaultPage>
  )
}

export default Index