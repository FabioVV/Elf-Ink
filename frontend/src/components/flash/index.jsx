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
            }, 5000)
        })
                

    }, [])

    const changeVisibility = () => {
        setVisibility(!visibility)
    }

    return (
        visibility && 
        <div onClick={changeVisibility} className={`alert alert-${type}`}>
            <p>{message}</p>
        </div>
    )
}