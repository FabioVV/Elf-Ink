import React, {useEffect, useState} from 'react';

import Bus from '../../utils/Bus';

export const Flash = () => {
  
    let [visibility, setVisibility] = useState(false);
    let [message, setMessage] = useState('');
    let [type, setType] = useState('');

    useEffect(() => {
        Bus.addListener('flash', ({message, type}) => {
            setVisibility(true)

            setMessage(message)

            setType(type)

            setTimeout(() => {
                setVisibility(false)
            }, 4000)
        })
                

    }, [])

    const changeVisibility = () => {
        setVisibility(!visibility)
    }

    return (
        visibility && 
        <div className={`alert alert-${type}`}>
            <span onClick={changeVisibility} className="close"><strong>X</strong></span>
            <p>{message}</p>
        </div>
    )
}