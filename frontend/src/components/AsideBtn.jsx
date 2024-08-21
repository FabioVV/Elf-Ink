import React from 'react'

function AsideBtn({visible, setVisible}) {

    const handleVisible = () => {
        setVisible(!visible)
    }

    return (
        <div onClick={handleVisible} className='aside-btn'>
            {visible ?
                <>
                    <span>&lt;</span>
                    <span>&lt;</span>
                </>
            :
                <>
                    <span>&gt;</span>
                    <span>&gt;</span>
                </>
            }
        </div>
    )
}

export default AsideBtn