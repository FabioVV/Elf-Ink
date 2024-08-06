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
  getActiveNotebook, getNotebooks, submitNewLeafStatus} from '../lib/NotebookRequests'
import {getUserData} from '../lib/UserRequests'


function Index() {
  const [searchTitle, setSearchTitle] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const [activeNotebook, setActiveNotebook] = useState(null)
  const [activeLeaf, setActiveLeaf] = useState('')

  const [notebooks, setNotebooks] = useState([])

  const [userData, setUserData] = useState({
    username: localStorage.getItem("username"),
  })

  const timeoutRef = useRef(null)
  const token = localStorage.getItem("token")

  const handleActiveNotebook = async(e) => {
    if(!activeNotebook?.ID) return 

    const r = await submitNewActiveNotebook(e, token, activeNotebook?.ID)

    if(r['error']){
      alert(r['error'])
    } else {
      handleGetNotebooks(e)
      
    }
  }

  // const handleActiveNotebookLeafs = async(e) => {
  //   if(!activeNotebook?.ID) return 

  //   const r = await getActiveNotebookLeafs(e, token, searchTitle)

  //   if(r['error']){
  //     alert(r['error'])
  //   } else {
  //     setLeafs(Array.isArray(r) ? r : [])
  //   }
  // }

  const _getActiveNotebook = async(e) => {
    const r = await getActiveNotebook(e, token, searchTitle)
    
    if(r['error']){
      alert(r['error'])
    } else {
      setActiveNotebook(r)
    }
  }

  const handleActiveLeaf = async(e) => {
    if(!activeLeaf?.ID) return 

    const r = await submitNewActiveLeaf(e, token, activeLeaf?.ID)

    if(r['error']){
      alert(r['error'])
    } else {
      // _getActiveNotebook()
      setSelectedStatus(r['Status']['name'])
    }
  }

  const _getActiveLeaf = async(e) => {

    const r = await getActiveLeaf(e, token)

    if(r['Message'] ){
      console.log(r)

    } else {
      setActiveLeaf(r)
      setSelectedStatus(r?.Status?.name)
    }

  }

  const handleGetNotebooks = async (e) => {
    const r = await getNotebooks(e, token)

    if(r['error']){
      alert(r['error'])
    } else {
      if(Array.isArray(r))setNotebooks(r)
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
      alert(r['error'])
    } else {
      _getActiveNotebook()
    }

  } 

  useEffect(() => {
    document.querySelector('main').classList.remove('main')

    // if(!userData?.username)handleUserData()

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

  }, [searchTitle])

  useEffect(() => {
    if(activeNotebook){
      handleActiveNotebook()
    }
  }, [activeNotebook])

  useEffect(() => {handleActiveLeaf()}, [activeLeaf])
  useEffect(() => {if(activeLeaf)handleLeafStatus()}, [selectedStatus])

  return (
    <DefaultPage>
        <section className='main-container'>
          
          <AsideUL 
            notebooks={notebooks} 
            userData={userData}
            activeNotebook={activeNotebook}

            setActiveNotebook={setActiveNotebook}
            handleGetNotebooks={handleGetNotebooks}

          />

          <AsideLeafs 
            leafs={activeNotebook?.Leafs} 
            activeNotebook={activeNotebook} 
            activeLeaf={activeLeaf}
            searchTitle={searchTitle}

            handleGetNotebooks={handleGetNotebooks}
            handleGetLeafs={_getActiveNotebook}
            setActiveLeaf={setActiveLeaf}
            setSearchTitle={setSearchTitle}

          />

          <Editor 
            activeLeaf={activeLeaf} 
            selectedStatus={selectedStatus}

            setSelectedStatus={setSelectedStatus}
          />

        </section>
    </DefaultPage>
  )
}

export default Index