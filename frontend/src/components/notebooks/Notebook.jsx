
function Notebook({notebook, handleFetch}) {
  return (
    <>
        <li>
            <span className='list-options'><i className="fa-solid fa-list-ul"></i></span>
            <span className='list-item'>{notebook?.title} <span>{notebook?.leaf_count}</span></span> 
        </li>

        <span className='list-subitem'>
            <ul>
                <li>item 1</li>
                <li>item 2</li>
                <li>Delete notebook</li>
            </ul>
        </span>
    </>
  )
}

export default Notebook