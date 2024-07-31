import {useState} from "react"

import Dialog from "./Dialog"
import Notebook from "./notebooks/Notebook"

import {submitNewNotebook} from "../lib/NotebookRequests"

import {changeTheme} from "../lib/theme"

function NotebooksList({data, HandleFetch, handleActiveNotebook, activeNotebook}){
    return (
      <>
        {data?.map((notebook) => (
            <Notebook
              key={notebook?.ID}
              notebook={notebook}
              HandleFetch={HandleFetch}
              handleActiveNotebook={handleActiveNotebook}
              activeNotebook={activeNotebook}
            />
        ))}
      </>
    )
}

function AsideUL({setActiveNotebook, notebooks, handleGetNotebooks, userData, activeNotebook}) {

    const [notebookName, setNotebookName] = useState('')
    const [theme, setTheme] = useState('fa-solid fa-lightbulb')

    const handleNotebookName = (e) => {
        setNotebookName(e.target.value)
    }   

    const handleThemeChange = (e) => {
        if(theme == 'fa-solid fa-lightbulb'){
            setTheme('fa-regular fa-lightbulb')
            changeTheme()
        } else {
            setTheme('fa-solid fa-lightbulb')
            changeTheme()
        }
    }   

    const handleSubmit = async (e) => {
        e.preventDefault()

        const Notebook = {
            title: notebookName
        }

        const r = await submitNewNotebook(e, Notebook)

        if(r['error']){
            alert(r['error'])
        } else {
            document.getElementById('create-notebook').close()
            handleGetNotebooks()
            setNotebookName('')
        }

    } 

    return (
        <div className='aside-ul'>

            <div className='user-aside'>
                <h6>{userData?.username}</h6>
                <button onClick={handleThemeChange}><i className={`${theme}`}></i></button>
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
                    <NotebooksList data={notebooks} HandleFetch={null} handleActiveNotebook={setActiveNotebook} activeNotebook={activeNotebook}/>
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