import React from 'react'

function Leaf({leaf, handleFetch}) {

    const getClassByStatus = (statusName) => {
        switch (statusName) {
          case 'Active':
            return ['border-active', 'status-active']
          case 'Inactive':
            return ['border-not-active', 'status-not-active']
          case 'In Progress':
            return ['border-progress', 'status-progress']
          default:
            return ''
        }
    }
    const className = getClassByStatus(leaf?.Status?.name);

  return (
    <div className={`note ${className[0]}`}>
        <h5>{leaf?.title}</h5>
        <span className={`${className[1]}`}>{leaf?.Status?.name}</span>
        <div>
            <span>Created at: {leaf?.CreatedAt}</span>
            <span>Updated at: {leaf?.UpdatedAt}</span>
        </div>
    </div>
  )
}

export default Leaf