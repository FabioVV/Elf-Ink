import {useNavigate} from 'react-router-dom'

function AsideBar() {
    const navigate = useNavigate();

    return (
        <div className='sidebar'>
            <div className='aside-actions'>
                <i className="fa-solid fa-plus"></i>
            </div>

            <div className='aside-data'>
                <div className='note-item'>
                    <h5>Notebook title title title title title</h5>
                   
                    
                </div>
                <div className='note-item'>
                    <h5>Notebook title</h5>
                   
                    
                </div>
                <div className='note-item'>
                    <h5>Notebook title</h5>
                   
                    
                </div>
                <div className='note-item'>
                    <h5>Notebook title</h5>
                   
                    
                </div>
            </div>
        </div>
    )
}

export default AsideBar