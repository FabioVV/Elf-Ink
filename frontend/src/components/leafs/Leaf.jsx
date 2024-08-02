import React, {useState} from 'react'

function Leaf({leaf, handleFetch, handleActiveLeaf, activeLeaf}) {
  const [hoverColor, setHoverColor] = useState([])

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
  }

  const handleMouseOut = () => {
    setHoverColor([])
  }

  function handleActiveButDifferentLeaf(){
    if(activeLeaf?.ID !== leaf?.ID){
      handleActiveLeaf(leaf)
    }
  }

  return (
    <div onClick={()=>{handleActiveButDifferentLeaf()}} 
      className={leaf?.active == false ? `note ${className[0]}`: `note ${className[0]} active-leaf`}

      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}

      style={{
        cursor: 'pointer',
        boxShadow: hoverColor.length > 0
          ? `${hoverColor[0]} -5px 5px, ${hoverColor[1]} -10px 10px, ${hoverColor[2]} -15px 15px, ${hoverColor[3]} -20px 20px, ${hoverColor[4]} -25px 25px`
          : '',
        transition: 'box-shadow 0.3s ease-in-out',
      }}

    >
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