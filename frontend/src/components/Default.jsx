import React from 'react'

import {Flash} from './flash'

const DefaultPage = ({children}) => {

  return (
    <>
      <Flash/>
      <div id='background-filter'></div>
      {children}
    </>
  )
}

export default DefaultPage