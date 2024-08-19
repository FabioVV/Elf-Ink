/* 
  I know. This sucks.
*/
import {useEffect, useState, useRef} from 'react'

import DefaultPage from '../components/Default'
import AsideLeafs from '../components/AsideLeafs'
import AsideUL from '../components/AsideUL'
import Editor from '../components/Editor'

import '../static/css/index.css'
import '../static/css/toolbox.css'
import '../static/css/markdown.css'
import '../static/css/flash.css'

import {submitNewActiveNotebook, 
  submitNewActiveLeaf, getActiveLeaf, 
  getActiveNotebook, getNotebooks, submitNewLeafStatus,
  getActiveNotebooksPinnedLeafs} from '../lib/NotebookRequests'

function Index() {
  const [searchNotebookTitle, setSearchNotebookTitle] = useState('')

  const [searchTitle, setSearchTitle] = useState('')
  const [searchInactive, setSearchInactive] = useState(true)
  const [searchActive, setSearchActive] = useState(true)
  const [searchImportant, setSearchImportant] = useState(true)

  const [selectedStatus, setSelectedStatus] = useState('')

  const [activeNotebook, setActiveNotebook] = useState(null)
  const [activeLeaf, setActiveLeaf] = useState('')

  const [notebooks, setNotebooks] = useState([])
  const [pinnedLeafs, setPinnedLeafs] = useState([])
  
  const [token] = useState(localStorage.getItem("token"))
  const [userData] = useState({
    username: localStorage.getItem("username"),
  })

  const timeoutRef = useRef(null)

  const handleActiveNotebook = async(e) => {
    if(!activeNotebook?.ID) return 

    const r = await submitNewActiveNotebook(e, token, activeNotebook?.ID)

    if(r['error']){
      window.flash(r['error'], 'error')
    } else {
      handleGetNotebooks(e)
      
    }
  }

  const _getActiveNotebook = async(e) => {
    const r = await getActiveNotebook(e, token, searchTitle, searchInactive, searchActive, searchImportant)
    
    if(r['error']){
      window.flash(r['error'], 'error')
    } else {
      setActiveNotebook(r)
      handleGetNotebooksPinnedLeafs()
    }
  }

  const handleActiveLeaf = async(leafID) => {
    if(!leafID) return 

    const r = await submitNewActiveLeaf(null, token, leafID)

    if(r['error']){
      window.flash(r['error'], 'error')
    } else {
      setActiveLeaf(r)
      setSelectedStatus(r['Status']['name'])
    }
  }

  const _getActiveLeaf = async(e) => {

    const r = await getActiveLeaf(e, token)

    if(r['Message'] ){

    } else {
      setActiveLeaf(r)
      setSelectedStatus(r?.Status?.name)
    }

  }

  const handleGetNotebooks = async (e) => {
    const r = await getNotebooks(e, token, searchNotebookTitle)

    if(r['error']){
      window.flash(r['error'], 'error')
    } else {
      if(r)setNotebooks(r)
    }

  }

  const handleGetNotebooksPinnedLeafs = async (e) => {
    const r = await getActiveNotebooksPinnedLeafs(e, token)
    
    if(r && r['error']){
      window.flash(r['error'], 'error')
    } else {
      if(r)setPinnedLeafs(r)
    }
  }
  
  // const handleUserData = async () => {

  //   const r = await getUserData(token)

  //   if(r['username']) {
  //     setUserData({ username: r['username'] })
  //   } else {
  //     navigate(`/`)
  //     alert('Error fetching data')
  //   }

  // } 

  const handleLeafStatus = async (e) => {
    if(!selectedStatus || ! activeLeaf?.ID) return 

    const newStatus = {
      name:selectedStatus,
      ID: activeLeaf?.ID
    }

    const r = await submitNewLeafStatus(e, token, newStatus)

    if(r['error']){
      window.flash(r['error'], 'error')
    } else {
      _getActiveNotebook()
      handleGetNotebooksPinnedLeafs()
    }

  } 

  useEffect(() => {
    document.querySelector('main').classList.remove('main')

    // if(!userData?.username)handleUserData()
    handleGetNotebooksPinnedLeafs()
    handleGetNotebooks()
    _getActiveNotebook()
    _getActiveLeaf()
  }, [])

  useEffect(() => {
    if(timeoutRef.current){
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(()=>{
      _getActiveNotebook()
    }, 400)

    return () => {
      clearTimeout(timeoutRef.current)
    }

  }, [searchTitle, searchActive, searchInactive, searchImportant])

  useEffect(() => {
    if(timeoutRef.current){
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(()=>{
      handleGetNotebooks(null)
    }, 400)

    return () => {
      clearTimeout(timeoutRef.current)
    }

  }, [searchNotebookTitle])

  useEffect(() => {
    if(activeNotebook){
      handleActiveNotebook()
    }
  }, [activeNotebook])

  useEffect(() => {if(activeLeaf)handleLeafStatus()}, [selectedStatus])
  useEffect(() => {if(activeLeaf)_getActiveNotebook()}, [activeLeaf])

  return (
    <DefaultPage>
        <section className='main-container'>
          
          <AsideUL 
            notebooks={notebooks} 
            userData={userData}
            activeNotebook={activeNotebook}
            searchNotebookTitle={searchNotebookTitle}
            token={token}

            setActiveNotebook={setActiveNotebook}
            handleGetNotebooks={handleGetNotebooks}
            setSearchNotebookTitle={setSearchNotebookTitle}
          />

          <AsideLeafs 
            leafs={activeNotebook?.Leafs} 
            activeNotebook={activeNotebook} 
            activeLeaf={activeLeaf}
            searchTitle={searchTitle}
            searchInactive={searchInactive}
            searchActive={searchActive}
            searchImportant={searchImportant}
            pinnedLeafs={pinnedLeafs}
            token={token}

            handleGetNotebooksPinnedLeafs={handleGetNotebooksPinnedLeafs}
            handleGetNotebooks={handleGetNotebooks}
            handleGetLeafs={_getActiveNotebook}
            setActiveLeaf={handleActiveLeaf}
            setSearchTitle={setSearchTitle}
            setSearchInactive={setSearchInactive}
            setSearchActive={setSearchActive}
            setSearchImportant={setSearchImportant}
          />

          <Editor 
            activeLeaf={activeLeaf} 
            selectedStatus={selectedStatus}
            token={token}

            setSelectedStatus={setSelectedStatus}
          />

        </section>
    </DefaultPage>
  )
}

export default Index