import React from 'react'

const DefaultPage = ({children}) => {
  return (
    <>
      <div id='background-filter'></div>

      {children}
    </>

  )
}

export default DefaultPage