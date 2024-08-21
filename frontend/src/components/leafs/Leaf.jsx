import React, {useState, useEffect} from 'react'

import Dialog from '../Dialog'

import {deleteLeaf, patchLeafName, submitNewPinnedLeaf, submitRemovedPinnedLeaf} from '../../lib/NotebookRequests'

function Leaf({leaf, HandleFetch, handleActiveLeaf, handleGetNotebooksPinnedLeafs, activeLeaf, token}) {
  const [hoverColor, setHoverColor] = useState([])
  const [completeHoverColor, setCompleteHoverColor] = useState('')

  const getClassByStatus = (statusName) => {
    switch (statusName) {
      case 'Active':
        return ['border-active', 'status-active']
      case 'Inactive':
        return ['border-not-active', 'status-not-active']
      case 'Important':
        return ['border-important', 'status-important']
      default:
        return ''
    }
  }
  
  const className = getClassByStatus(leaf?.Status?.name)

  const handleMouseOver = () => {
    //rgba(240, 46, 170, 0.4) the og one

    let color = ""
    switch(className[1]){
      case 'status-active':
        color = "173, 255, 47"
        break;
      case 'status-not-active':
        color = "17, 17, 17"
        break;
      case 'status-important':
        color = "255, 0, 0"
        break;
    } 

    setHoverColor(
      [`rgba(${color}, 0.4)`, 
      `rgba(${color}, 0.3)`, 
      `rgba(${color}, 0.2)`, 
      `rgba(${color}, 0.1)`, 
      `rgba(${color}, 0.05)`,
      ]
    )

    setCompleteHoverColor(`${hoverColor[0]} -5px 5px, ${hoverColor[1]} -10px 10px, ${hoverColor[2]} -15px 15px, ${hoverColor[3]} -20px 20px, ${hoverColor[4]} -25px 25px`)
  }

  const handleMouseOut = () => {
    setHoverColor([])
  }

  function handleActiveButDifferentLeaf(){
    if(activeLeaf?.ID !== leaf?.ID){
      handleActiveLeaf(leaf?.ID)
      HandleFetch()
    }
  }

  const handleDeleteLeaf = async (e) => {
    if(!activeLeaf?.ID) return 

    const r = await deleteLeaf(e, token, activeLeaf?.ID)
    document.getElementById('delete-leaf').close()

    if(r['success']){
      HandleFetch()
      handleGetNotebooksPinnedLeafs()
      handleActiveLeaf('')

    } else if (r['error']){
      window.flash(r['error'], 'error')

    }
  } 

  const handlePatchTitleLeaf = async (e, new_name, leaf_title_field) => {
    if(!activeLeaf?.ID) return 

    const r = await patchLeafName(e, token, activeLeaf?.ID, new_name)
    document.getElementById('delete-leaf').close()

    if(r['success']){
      leaf_title_field.innerHTML = `${new_name}`
      HandleFetch()
      handleGetNotebooksPinnedLeafs()

    } else if (r['error']){
      window.flash(r['error'], 'error')

    }
  } 

  const handleSubmitNewPinnedLeaf = async (e) => {
    if(!activeLeaf?.ID) return 

    const r = await submitNewPinnedLeaf(e, token, activeLeaf?.ID)

    if(r['success']){
      HandleFetch()
      handleGetNotebooksPinnedLeafs()

    } else if (r['error']){
      window.flash(r['error'], 'error')

    }
  }
  
  const handleSubmitRemovePinnedLeaf = async (e) => {
    if(!activeLeaf?.ID) return 

    const r = await submitRemovedPinnedLeaf(e, token, activeLeaf?.ID)

    if(r['success']){
      HandleFetch()
      handleGetNotebooksPinnedLeafs()

    } else if (r['error']){
      window.flash(r['error'], 'error')

    }
  } 


  function changeToInput(){
    const leaf_title_field = document.getElementById(`leaf_title_${leaf?.ID}`)

    leaf_title_field.innerHTML = `
      <input autofocus id='new_leaf_title' type='text' value='${leaf?.title}'>
      <br>

      <i id="delete_leaf" 
      title='Delete leaf' 
      class="fa-solid fa-trash-can"
      align="center"></i>
      
      <button id='pin_leaf'>Pin this leaf</button>
    `
    if(leaf?.pinned){
      leaf_title_field.innerHTML = `
        <input autofocus id='new_leaf_title' type='text' value='${leaf?.title}'>
        <br>

        <i id="delete_leaf" 
        title='Delete leaf' 
        class="fa-solid fa-trash-can"
        align="center"></i>

        <button id='unpin_leaf'>Unpin this leaf</button>
      `

      document.getElementById('unpin_leaf').addEventListener('click', (e) => {
        handleSubmitRemovePinnedLeaf()
      })
    } else {
      document.getElementById('pin_leaf').addEventListener('click', (e) => {
        handleSubmitNewPinnedLeaf()
      })

    }

    document.getElementById('delete_leaf').addEventListener('click', (e) => {
      document.getElementById('delete-leaf').showModal()
    })

    leaf_title_field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const new_name = document.getElementById('new_leaf_title').value
        handlePatchTitleLeaf(e, new_name, leaf_title_field)

      }
    })

  }

  useEffect(()=>{
    handleMouseOver() // To initialize the hover colors, since its colors are being used to denote which leaf is active on component load
  },[])

  return (
    <div onDoubleClick={changeToInput} id={`leaf_${leaf?.ID}`} onClick={()=>{handleActiveButDifferentLeaf()}} 
      className={!leaf?.active ? `note ${className[0]}`: `note ${className[0]} ${completeHoverColor}`} // the class for active leafs is active-leaf, but i changed to the hoverColor, to see how it goes

      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}

      style={{
        cursor: 'pointer',
        boxShadow:  leaf?.active
          ? `${hoverColor[0]} -5px 5px, ${hoverColor[1]} -10px 10px, ${hoverColor[2]} -15px 15px, ${hoverColor[3]} -20px 20px, ${hoverColor[4]} -25px 25px`
          : '',
        transition: 'box-shadow 0.3s ease-in-out',
      }}

    >
      
      {leaf?.pinned ? 
        <span className='pin-container'><i className="fa-solid fa-map-pin"></i></span>
        :
        ""
      }
      
      <h5 id={`leaf_title_${leaf?.ID}`}>{leaf?.title}</h5> 
      <span className={`${className[1]}`}>{leaf?.Status?.name}</span>
      <div>
          <span>Created at: {leaf?.created_at_human}</span>
          <span>Updated at: {leaf?.updated_at_human}</span>
          <span>Words: {leaf?.word_count}</span>
      </div>

      <Dialog title={`Delete leaf`} id={`delete-leaf`}>
        <form acceptCharset="UTF-8">
            <div className="field">
                <h3>Are you sure? This action is irreversible.</h3>
            </div>
            <div className="submit-arrow">
                <button type="button" onClick={handleDeleteLeaf} style={{backgroundColor:'red', borderColor:'transparent'}}><i className="fa-solid fa-arrow-right"></i></button>
            </div>
        </form>
      </Dialog>
      
    </div>
  )
}

export default Leaf
