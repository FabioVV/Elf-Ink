import React, {useEffect} from 'react'

const DefaultPage = ({children}) => {

  // useEffect(() => {
  //   const script_bindings = document.createElement('script')
  //   const script_runtime = document.createElement('script')

  //   script_bindings.src = '/wails/ipc.js'
  //   script_runtime.src = '/wails/runtime.js'

  //   document.head.appendChild(script_bindings)
  //   document.head.appendChild(script_runtime)

  // }, [])

  return (
    <>
      <div id='background-filter'></div>
      {children}
    </>
  )
}

export default DefaultPage