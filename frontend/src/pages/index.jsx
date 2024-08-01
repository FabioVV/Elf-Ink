import {useEffect, useState, useRef} from 'react'

import DefaultPage from '../components/Default'
import AsideLeafs from '../components/AsideLeafs'
import AsideUL from '../components/AsideUL'
import Editor from '../components/Editor'

import '../static/css/index.css'
import '../static/css/toolbox.css'
import '../static/css/markdown.css'

import {submitNewActiveNotebook, submitNewActiveLeaf, getActiveLeaf,getActiveNotebook, getNotebooks, getActiveNotebookLeafs} from '../lib/NotebookRequests'
import {getUserData} from '../lib/UserRequests'
import {applyTheme} from '../lib/theme'

function Index() {
  const [searchTitle, setSearchTitle] = useState('')
  const [searchActive, setSearchActive] = useState(false)
  const [searchInactive, setSearchInactive] = useState(false)
  const [searchInProgress, setSearchInProgress] = useState(false)

  const [activeNotebook, setActiveNotebook] = useState(null)
  const [activeLeaf, setActiveLeaf] = useState(null)

  const [notebooks, setNotebooks] = useState([])
  const [leafs, setLeafs] = useState([])

  const [userData, setUserData] = useState({
    username: '',
  })

  const timeoutRef = useRef(null);

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

  const handleActiveNotebookLeafs = async() => {
    if(!activeNotebook?.ID) return 

    const Search = {
      title: searchTitle,
      active: searchActive,
      inactive: searchInactive,
      in_progress: searchInProgress,
      ID: activeNotebook?.ID
    }

    const r = await getActiveNotebookLeafs(null, Search)

    if(r['error']){
      alert(r['error'])
    } else {
      setLeafs(Array.isArray(r) ? r : [])
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

  const handleActiveLeaf = async() => {
    if(!activeLeaf?.ID) return 

    const newActiveLeaf = {
      ID: activeLeaf?.ID
    }

    const r = await submitNewActiveLeaf(null, newActiveLeaf)

    if(r['error']){
      alert(r['error'])
    } else {
      // handleGetNotebooks()
      _getActiveNotebook()
    }
  }

  const _getActiveLeaf = async() => {

    const r = await getActiveLeaf(null, null)

    if(r['error']){
      alert(r['error'])
    } else {
      setActiveLeaf(r)
    }
  }

  const handleGetNotebooks = async () => {
    const r = await getNotebooks(null, null)

    if(r['error']){
      alert(r['error'])
    } else {
      if(Array.isArray(r))setNotebooks([...r])
    }

  }
  
  const handleUserData = async () => {
    const r = await getUserData(null)

    if(r['error']){
      alert(r['error'])
    } else {
      setUserData({ username: r['username'] })
    }

  } 

  useEffect(() => {
    document.querySelector('main').classList.remove('main')
    applyTheme()

    if(!userData?.username)handleUserData()

    handleGetNotebooks()
    handleActiveNotebookLeafs()
    _getActiveNotebook()
    _getActiveLeaf()
  }, [])

  useEffect(() => {
    if(timeoutRef.current){
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(()=>{
      handleActiveNotebookLeafs()
    }, 400)

    return () => {
      clearTimeout(timeoutRef.current)
    }

  }, [searchActive, searchInProgress, searchInactive, searchTitle])


  useEffect(() => {if(activeNotebook)handleActiveNotebook()}, [activeNotebook])
  useEffect(() => {if(activeNotebook)handleActiveNotebookLeafs()}, [activeNotebook])
  useEffect(() => {if(activeLeaf)handleActiveLeaf()}, [activeLeaf])
    
    
  return (
    <DefaultPage>
        <section className='main-container'>
          
          <AsideUL 
            notebooks={notebooks} 
            userData={userData}
            setActiveNotebook={setActiveNotebook}
            activeNotebook={activeNotebook}
            handleGetNotebooks={handleGetNotebooks}
          />

          <AsideLeafs 
            leafs={leafs} 
            activeNotebook={activeNotebook} 
            setActiveLeaf={setActiveLeaf}
            activeLeaf={activeLeaf}
            
            handleGetNotebooks={handleGetNotebooks}
            handleGetLeafs={getActiveNotebookLeafs}

            searchTitle={searchTitle}
            searchActive={searchActive}
            searchInactive={searchInactive}
            searchInProgress={searchInProgress}

            setSearchTitle={setSearchTitle}
            setSearchActive={setSearchActive}
            setSearchInactive={setSearchInactive}
            setSearchInProgress={setSearchInProgress}
          />

          <Editor activeLeaf={activeLeaf}/>

        </section>
    </DefaultPage>
  )
}

export default Index