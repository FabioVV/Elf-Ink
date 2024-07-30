import {useState} from "react"

function Notebook({notebook, handleFetch, handleActiveNotebook}) {

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

  return (
    <>
      <li title={notebook?.title}>
        <span onClick={openNotebookOptions} className='list-options'>
          <i className={classFont}></i>
        </span>
        <span onClick={()=>handleActiveNotebook(notebook)} className={notebook?.active == false ? "list-item": "list-item active-notebook"}>{notebook?.title} </span>
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