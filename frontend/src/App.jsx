import {useState} from 'react';

function App() {

    async function test() {
        const r = await fetch('http://127.0.0.1:8080/api/v1/test',{
            method:'POST'
        })
        
        const data = await r.text()
        
        if(data){
            document.getElementById('h1').innerHTML = data
        }
    }

    return (
        <>
            <h1 id='h1' onClick={test}>Testing</h1>
        </>
    )
}

export default App
