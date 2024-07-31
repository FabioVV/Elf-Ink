import React from 'react'

function Leaf({leaf, handleFetch, handleActiveLeaf, activeLeaf}) {

  const getClassByStatus = (statusName) => {
    switch (statusName) {
      case 'Active':
        return ['border-active', 'status-active']
      case 'Inactive':
        return ['border-not-active', 'status-not-active']
      case 'In Progress':
        return ['border-progress', 'status-progress']
      default:
        return ''
    }
  }
  
  const className = getClassByStatus(leaf?.Status?.name);

  function handleActiveButDifferentLeaf(){
    if(activeLeaf?.ID !== leaf?.ID){
      handleActiveLeaf(leaf)
    }
  }

  return (
    // <span onClick={()=>handleActiveNotebook(notebook)} className={notebook?.active == false ? "list-item": "list-item active-notebook"}>{notebook?.title} </span>

    <div onClick={()=>{handleActiveButDifferentLeaf()}} className={leaf?.active == false ? `note ${className[0]}`: `note ${className[0]} active-leaf`}>
        <h5>{leaf?.title}</h5>
        <span className={`${className[1]}`}>{leaf?.Status?.name}</span>
        <div>
            <span>Created at: {leaf?.created_at_human}</span>
            <span>Updated at: {leaf?.updated_at_human}</span>
        </div>
    </div>
  )
}

export default Leaf