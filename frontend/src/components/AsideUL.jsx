import {useState} from "react"
import {useNavigate} from "react-router-dom"

import Dialog from "./Dialog"
import Notebook from "./notebooks/Notebook"

import {submitNewNotebook} from "../lib/NotebookRequests"
import {logoutUser} from "../lib/UserRequests"
import {changeTheme} from "../lib/theme"

function NotebooksList({data, HandleFetch, handleActiveNotebook, activeNotebook, token}){
    return (
      <>
        {data?.map((notebook) => (
            <Notebook
              key={notebook?.ID}
              notebook={notebook}
              HandleFetch={HandleFetch}
              handleActiveNotebook={handleActiveNotebook}
              activeNotebook={activeNotebook}
              token={token}
            />
        ))}
      </>
    )
}

function AsideUL({setActiveNotebook, notebooks, handleGetNotebooks, userData, activeNotebook, searchNotebookTitle, setSearchNotebookTitle, token}) {

    const [notebookName, setNotebookName] = useState('')
    const [theme, setTheme] = useState('fa-solid fa-lightbulb')

    const navigate = useNavigate()

    const handleNotebookName = (e) => {
        setNotebookName(e.target.value)
    }   

    const handleThemeChange = () => {
        if(theme == 'fa-solid fa-lightbulb'){
            setTheme('fa-regular fa-lightbulb')
            changeTheme()
        } else {
            setTheme('fa-solid fa-lightbulb')
            changeTheme()
        }
    }   

    const handleLogout = async(e) => {
        e.preventDefault()

        const r = await logoutUser(e, token)

        if(r['success']){
            navigate(`/`)
            localStorage.clear()
        } 

    }   

    const handleSubmit = async (e) => {
        e.preventDefault()

        const Notebook = {
            title: notebookName
        }

        const r = await submitNewNotebook(e, token, Notebook)

        if(r['error']){
            window.flash(r['error'], 'error')
        } else {
            document.getElementById('create-notebook').close()
            handleGetNotebooks()
            setNotebookName('')
            window.flash("Notebook created", 'success')

        }

    } 

    return (
        <div className='aside-ul'>

            <div className='user-aside'>
                <h6 title="Your handle">{userData?.username}</h6>
                <button title="Change color theme" onClick={handleThemeChange}><i className={`${theme}`}></i></button>
                <button title="Logout" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
            </div>

            <div className='notebooks-filter'>
                <div className="notebooks-search">
                    <input type="search" placeholder="Search notebooks..." value={searchNotebookTitle} onChange={(e) => setSearchNotebookTitle(e.target.value)}/>
                </div>
            </div>

            <div className='notebook-actions'>
                <div className='create-notebook'>
                    <span onClick={()=>document.getElementById('create-notebook').showModal()}>
                        <i className="fa-solid fa-circle-plus"></i>
                    </span>
                </div>
            </div>

            <div className='aside'>
                <ul>
                    <NotebooksList token={token} data={notebooks} HandleFetch={handleGetNotebooks} handleActiveNotebook={setActiveNotebook} activeNotebook={activeNotebook}/>
                </ul>
            </div>


           <Dialog title={`Create a new notebook`} id={`create-notebook`}>
                <form onSubmit={handleSubmit} acceptCharset="UTF-8">
                    <div className="field">
                        <input required onChange={handleNotebookName} value={notebookName} type="text" placeholder="Name" name="title" id="title"/>
                    </div>
                    <div className="submit-arrow">
                        <button><i className="fa-solid fa-arrow-right"></i></button>
                    </div>
                </form>
           </Dialog>
           
        </div>
    )
}

export default AsideUL