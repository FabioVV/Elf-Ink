import {useState} from "react"

function Notebook({notebook, handleFetch, handleActiveNotebook}) {

  const [display, setDisplay] = useState(false)

  function openNotebookOptions(){
    setDisplay(prevDisplay => !prevDisplay);
  }

  return (
    <>
      <li title={notebook?.title}>
        <span onClick={openNotebookOptions} className='list-options'><i className="fa-solid fa-list-ul"></i></span>
        <span onClick={()=>handleActiveNotebook(notebook)} className={notebook?.active == false ? "list-item": "list-item active-notebook"}>{notebook?.title} </span>
        <span className="">{notebook?.leaf_count}</span> 
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