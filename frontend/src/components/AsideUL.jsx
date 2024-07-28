
function AsideUL() {

    return (
        <div className='aside-ul'>

            <div className='user-aside'>
                <h6>Biofa</h6>
            </div>

            <div className='notebook-actions'>
                <div className='create-notebook'>
                    <span>
                        <i className="fa-solid fa-circle-plus"></i>
                    </span>
                </div>
            </div>

            <div className='aside'>
                <ul>
                    <li>
                        <span className='list-options'><i className="fa-solid fa-list-ul"></i></span>
                        <span className='list-item'>Notebook <span>101</span></span> 
                    </li>

                    <span className='list-subitem'>
                        <ul>
                            <li>item 1</li>
                            <li>item 2</li>
                            <li>Delete notebook</li>
                        </ul>
                    </span>

                    <li>
                        <span className='list-options'><i className="fa-solid fa-list-ul"></i></span>
                        <span className='list-item'>Notebook <span>101</span></span> 
                    </li>

                    <li>
                        <span className='list-options'><i className="fa-solid fa-list-ul"></i></span>
                        <span className='list-item'>Notebook <span>101</span></span> 
                    </li>
                </ul>
            </div>
           
        </div>
    )
}

export default AsideUL