import {useState} from "react"

function Notebook({notebook, handleFetch}) {

  const [display, setDisplay] = useState('none')

  function openNotebookOptions(){
    display == 'none' ? setDisplay('block') : setDisplay('none')
  }

  return (
    <>
      <li>
          <span onClick={openNotebookOptions} className='list-options'><i className="fa-solid fa-list-ul"></i></span>
          <span title={notebook?.title} className='list-item'>{notebook?.title} <span>{notebook?.leaf_count}</span></span> 
      </li>

      <span style={{display:`${display}`}} className='list-subitem'>
          <ul>
              <li><button>Edit notebook</button></li>
              <li><button>Delete notebook</button></li>
          </ul>
      </span>
    </>
  )
}

export default Notebook