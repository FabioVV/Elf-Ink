import {useEffect, useState} from "react"

import {updateLeaf} from "../lib/NotebookRequests"

function Editor({activeLeaf}) {

    const [body, setBody] = useState('')

    const handleSubmitPage = async (e) => {
        e.preventDefault()

        const Leaf = {
            body: body
        }

        const r = await updateLeaf(e, Leaf, activeLeaf?.ID)

        if(r['error']){
            alert(r['error'])
        } else {  
        }
    }

    const onBodyChange = (e) => {
        setBody(e.target.innerHTML)
    }

    useEffect(() => {
        if (activeLeaf)setBody(activeLeaf?.body)

        const docMenterElement = document.querySelector('.doc-menter-content')

        if (docMenterElement) {
            docMenterElement.innerHTML = activeLeaf?.body
        }

    }, [activeLeaf])

    useEffect(()=>{
        const docMenterElement = document.querySelector('.doc-menter-content')

        if (docMenterElement) {
            docMenterElement.addEventListener('keyup', onBodyChange)
        }

        return () => {
            if (docMenterElement) {
                docMenterElement.removeEventListener('keyup', onBodyChange);
            }
        }
    }, [])

    return (
        <div>
            <div className="toolbox-container">
                <div id='toolbox-change-modes'></div>
                <div id='toolbox'></div>
            </div>

            <div className="leaf-tags">
                <label htmlFor="important" className="important">Important...</label>
                <input type="checkbox" id="important" style={{display:'none'}}/>

                <label htmlFor="todo-later" className="todo-later">Todo later...</label>
                <input type="checkbox" id="todo-later" style={{display:'none'}}/>
            </div>
            
            <div className="main-editor-container">
                <form onSubmit={handleSubmitPage} encType="multipart/form-data" acceptCharset="UTF-8"> 
                    <input type="hidden" name="content_hidden" id="content_hidden" value={body}/>
                    <input id="markdown-file" style={{display:'none'}} type="file"></input>
                    <doc-menter></doc-menter>
                    <input type="submit" style={{display:'none'}} id="submit_page"/>
                </form>
            </div>
        </div>
    )
}

export default Editor