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
    // if(activeLeaf?.ID !== leaf?.ID){
    //   handleActiveLeaf(leaf)
    // }
    handleActiveLeaf(leaf?.ID)

  }

  function changeToInput(){
    const leaf_title_field = document.getElementById(`leaf_title_${leaf?.ID}`)

    leaf_title_field.innerHTML = `
      <input autofocus id='new_leaf_title' type='text' value='${leaf?.title}'>
      <br>
      <i id="delete_leaf" 
      title='Delete leaf' 
      style='color:red; font-size:18px; z-index:100;' 
      class="fa-solid fa-trash-can"
      align="center"
      ></i>
    `

    document.getElementById('delete_leaf').addEventListener('click', (e) => {
      alert('delete leaf')
      document.getElementById(`leaf_${leaf?.ID}`).remove()
    })

    leaf_title_field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        alert('submit new leaft name')

        let val = document.getElementById('new_leaf_title').value

        leaf_title_field.innerHTML = `
          ${val}
        `
      }
    })

  }

  return (
    <div onDoubleClick={changeToInput} id={`leaf_${leaf?.ID}`} onClick={()=>{handleActiveButDifferentLeaf()}} 
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
      <h5 id={`leaf_title_${leaf?.ID}`}>{leaf?.title}</h5>
      <span className={`${className[1]}`}>{leaf?.Status?.name}</span>
      <div>
          <span>Created at: {leaf?.created_at_human}</span>
          <span>Updated at: {leaf?.updated_at_human}</span>
          <span>Words: {leaf?.word_count}</span>
      </div>
    </div>
  )
}

export default Leaf