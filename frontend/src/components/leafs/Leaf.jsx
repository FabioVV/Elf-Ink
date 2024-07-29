import React from 'react'

function Leaf({leaf, handleFetch}) {

  return (
    <div className="note border-active">
        <h5>{leaf?.title}</h5>
        <span className="status-active">Active</span>
        <div>
            <span>Created at: {leaf?.CreatedAt}</span>
            <span>Updated at: {leaf?.UpdatedAt }</span>
        </div>
    </div>
  )
}

export default Leaf