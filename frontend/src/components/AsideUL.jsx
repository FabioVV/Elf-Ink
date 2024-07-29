import {useEffect, useState} from "react"

import Dialog from "./Dialog"
import {submitNewNotebook, getNotebooks} from "../lib/NotebookRequests"
import Notebook from "./notebooks/Notebook"

function NotebooksList({data, HandleFetch}){
    return (
      <>
        {data?.map((notebook) => (
            <Notebook
              key={notebook.id}
              notebook={notebook}
              HandleFetch={HandleFetch}
            />
        ))}
      </>
    )
  }

function AsideUL() {

    const [notebookName, setNotebookName] = useState('')
    const [notebooks, setNotebooks] = useState([])


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

    const handleGetNotebooks = async () => {

        const Search = {
            title: ''
        }

        const r = await getNotebooks(null, Search)

        if(r['error']){
            alert(r['error'])
        } else {
            setNotebooks(r)
        }

    } 

    useEffect(()=>{handleGetNotebooks()}, [])

    return (
        <div className='aside-ul'>

            <div className='user-aside'>
                <h6>Biofa</h6>
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
                    <NotebooksList data={notebooks} HandleFetch={null}/>
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