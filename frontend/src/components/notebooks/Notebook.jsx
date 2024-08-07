import Dialog from "../Dialog";

import {deleteNotebook, patchNotebookName} from "../../lib/NotebookRequests";

const token = localStorage.getItem('token')

function Notebook({notebook, HandleFetch, handleActiveNotebook, activeNotebook}) {

  function handleActiveButDifferentNotebook(){
    if(activeNotebook?.ID !== notebook?.ID){
      handleActiveNotebook(notebook)
    }
  }

  const handleDeleteNotebook = async (e) => {
    if(!activeNotebook?.ID) return 

    const r = await deleteNotebook(e, token, activeNotebook?.ID)
    document.getElementById('delete-notebook').close()

    if(r['success']){
      HandleFetch()

    } else if (r['error']){
      window.flash(r['error'], 'error')

    }

  } 

  const handlePatchTitleNotebook = async (e, new_name, notebook_title_field) => {
    if(!activeNotebook?.ID) return 

    const r = await patchNotebookName(e, token, activeNotebook?.ID, new_name)
    document.getElementById('delete-notebook').close()

    if(r['success']){
      notebook_title_field.innerHTML = `${new_name}`

    } else if (r['error']){
      window.flash(r['error'], 'error')

    }
  } 

  function changeToInput(){
    const notebook_title_field = document.getElementById(notebook?.ID)

    notebook_title_field.innerHTML = `
      <input autofocus id='new_notebook_title' type='text' value='${notebook?.title}'>
      <br>
      <i id="delete_notebook" 
      title='Delete notebook' 
      style='color:red; font-size:18px; z-index:100;' 
      class="fa-solid fa-trash-can"
      align="center"
      ></i>
    `

    document.getElementById('delete_notebook').addEventListener('click', (e) => {
      document.getElementById('delete-notebook').showModal()
    })

    notebook_title_field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        
        const new_name = document.getElementById('new_notebook_title').value
        handlePatchTitleNotebook(e, new_name, notebook_title_field)

      }
    })

  }


  return (
    <>
      <li id={`notebook_${notebook?.ID}`} title={notebook?.title}>
        <span id={notebook?.ID} onDoubleClick={changeToInput} onClick={()=>handleActiveButDifferentNotebook()} className={notebook?.active == false ? "list-item": "list-item active-notebook"}>{notebook?.title} </span>
        <span className="stick-right">{notebook?.leaf_count}</span> 
      </li>

      <Dialog title={`Delete notebook`} id={`delete-notebook`}>
        <form acceptCharset="UTF-8">
            <div className="field">
                <h3>Are you sure? This action is irreversible.</h3>
            </div>
            <div className="submit-arrow">
                <button type="button" onClick={handleDeleteNotebook} style={{backgroundColor:'red', borderColor:'transparent'}}><i className="fa-solid fa-arrow-right"></i></button>
            </div>
        </form>
      </Dialog>
    </>
  )
}

export default Notebook