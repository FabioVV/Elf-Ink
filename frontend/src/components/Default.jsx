import React from 'react'

const DefaultPage = ({children}) => {
  return (
    <>
        <div id='background-filter'></div>

        <div>
            {children}
        </div>
        
    </>

  )
}

export default DefaultPage