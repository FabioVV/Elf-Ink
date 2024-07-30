import React, {useEffect} from 'react'

const DefaultPage = ({children}) => {

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     localStorage.clear();
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  return (
    <>
      <div id='background-filter'></div>

      {children}
    </>

  )
}

export default DefaultPage