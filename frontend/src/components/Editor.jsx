import {useEffect, useState} from "react"

import '../static/css/editor.css'

import {updateLeaf} from "../lib/NotebookRequests"

function Editor({activeLeaf}) {

    const [body, setBody] = useState('')
    const [markedBody, setMarkedBody] = useState('')
    const [editorStatus, setEditorStatus] = useState(false)

    const handleSubmitPage = async (e) => {
        e.preventDefault()

        const Leaf = {
            body: body
        }

        const r = await updateLeaf(e, Leaf, activeLeaf?.ID)

        if(r['error']){
            alert(r['error'])
        } else {  
            setMarkedBody(r)
        }
    }

    const onBodyChange = (e) => {
        setBody(e.target.innerHTML)
    }

    const onEditorChange = (e) => {
        setEditorStatus(e.target.checked)
    }

    useEffect(() => {

        if(activeLeaf){
            setBody(activeLeaf?.body)
            setMarkedBody(activeLeaf?.marked_body)

            const docMenterElement = document.querySelector('.doc-menter-content')
            const showPageElement = document.getElementById('show_page')
    
            if (docMenterElement) {
                docMenterElement.innerHTML = activeLeaf?.body
            }
    
            if(showPageElement){
                showPageElement.innerHTML = activeLeaf?.marked_body
            }
        }

    }, [activeLeaf])

    useEffect(()=>{
        const showPageElement = document.getElementById('show_page')
        if(showPageElement){
            showPageElement.innerHTML = markedBody
        }
    }, [markedBody])

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

    useEffect(()=>{
        const editor_mode = document.getElementById('editor-mode-toggle')

        if (editor_mode) {
            editor_mode.addEventListener('change', onEditorChange)
            editor_mode.checked = false
        }

        return () => {
            if (editor_mode) {
                editor_mode.removeEventListener('change', onEditorChange);
            }
        }
    }, [])

    return (
        <div className="editor">
            <div className="toolbox-container">
                <div id='toolbox-change-modes'></div>
                <div id='toolbox'></div>
            </div>

            {/* <div className="leaf-tags">
                <label htmlFor="important" className="important">Important...</label>
                <input type="checkbox" id="important" style={{display:'none'}}/>

                <label htmlFor="todo-later" className="todo-later">Todo later...</label>
                <input type="checkbox" id="todo-later" style={{display:'none'}}/>
            </div> */}

            <div className="main-editor-container" style={{display: !editorStatus ? "none" : "block"}}>
                <form onSubmit={handleSubmitPage} encType="multipart/form-data" acceptCharset="UTF-8"> 
                    <input type="hidden" name="content_hidden" id="content_hidden" value={body}/>
                    <input id="markdown-file" style={{display:'none'}} type="file"></input>
                    <doc-menter></doc-menter>
                    <input type="submit" style={{display:'none'}} id="submit_page"/>
                </form>
            </div>
        
            <div className="main-editor-container show" id="show_page" 
            style={{display: !editorStatus ? "block" : "none"}}>
            </div>
        </div>
    )
}

export default Editor