import {useEffect, useState} from "react"

import Dialog from "./Dialog"
import Notebook from "./notebooks/Notebook"

import {submitNewNotebook} from "../lib/NotebookRequests"
import {getCurrentUser} from "../lib/UserLC"

function NotebooksList({data, HandleFetch, handleActiveNotebook}){
    return (
      <>
        {data?.map((notebook) => (
            <Notebook
              key={notebook?.ID}
              notebook={notebook}
              HandleFetch={HandleFetch}
              handleActiveNotebook={handleActiveNotebook}
            />
        ))}
      </>
    )
}

function AsideUL({setActiveNotebook, notebooks, handleGetNotebooks}) {

    const [notebookName, setNotebookName] = useState('')
    const [currentUser, setcurrentUser] = useState('')

    const handleNotebookName = (e) => {
        setNotebookName(e.target.value)
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
        }

    } 

    useEffect(()=>{
        if(!currentUser)setcurrentUser(getCurrentUser())
    },[])

    return (
        <div className='aside-ul'>

            <div className='user-aside'>
                <h6>{currentUser?.username}</h6>
                <button><i class="fa-solid fa-lightbulb"></i></button>
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
                    <NotebooksList data={notebooks} HandleFetch={null} handleActiveNotebook={setActiveNotebook}/>
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