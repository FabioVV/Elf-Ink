import {useState} from "react"

function Notebook({notebook, handleFetch, handleActiveNotebook, activeNotebook}) {

  const [display, setDisplay] = useState(false)
  const [classFont, setClassFont] = useState('fa-solid fa-chevron-right')

  function openNotebookOptions(){
    setDisplay(prevDisplay => !prevDisplay);
    if(classFont == 'fa-solid fa-chevron-right'){
      setClassFont('fa-solid fa-angle-down')
    } else {
      setClassFont('fa-solid fa-chevron-right')
    }
  }

  function handleActiveButDifferentNotebook(){
    if(activeNotebook?.ID !== notebook?.ID){
      handleActiveNotebook(notebook)
    }
  }

  function changeToInput(){
    const notebook_title_field = document.getElementById('notebook_title')

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
      alert('delete notebook')
      document.getElementById(`${notebook?.ID}`).remove()
    })

    notebook_title_field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        alert('submit new notebook name')

        let val = document.getElementById('new_notebook_title').value

        notebook_title_field.innerHTML = `
          ${val}
        `
      }
    })

  }


  return (
    <>
      <li id={notebook?.ID} title={notebook?.title}>
        <span onClick={openNotebookOptions} className='list-options'>
          <i className={classFont}></i>
        </span>
        <span id="notebook_title" onDoubleClick={changeToInput} onClick={()=>handleActiveButDifferentNotebook()} className={notebook?.active == false ? "list-item": "list-item active-notebook"}>{notebook?.title} </span>
        <span className="stick-right">{notebook?.leaf_count}</span> 
      </li>

      <span className={`list-subitem ${display ? 'show' : ''}`}>
        <ul>
          <li><button>Edit notebook</button></li>
          <li><button>Delete notebook</button></li>
        </ul>
      </span>
    </>
  )
}

export default Notebook