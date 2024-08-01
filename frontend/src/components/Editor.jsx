import {useEffect, useState} from "react"

import '../static/css/editor.css'

import {updateLeaf} from "../lib/NotebookRequests"

function Editor({activeLeaf, setSelectedStatus, selectedStatus}) {
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

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value)
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

            <div className="leaf-tags">
            <label htmlFor="important" className={`important-tag ${selectedStatus === 'Important' ? 'checked' : ''}`}>
                Important
            </label>
            <input
                type="radio"
                id="important"
                name="status"
                value="important"
                style={{ display: 'none' }}
                onChange={handleStatusChange}
                checked={selectedStatus === 'Important'}
            />

            <label htmlFor="active" className={`active-tag ${selectedStatus === 'Active' ? 'checked' : ''}`}>
                Active
            </label>
            <input
                type="radio"
                id="active"
                name="status"
                value="active"
                style={{ display: 'none' }}
                onChange={handleStatusChange}
                checked={selectedStatus === 'Active'}
            />

            <label htmlFor="inactive" className={`inactive-tag ${selectedStatus === 'Inactive' ? 'checked' : ''}`}>
                Inactive
            </label>
            <input
                type="radio"
                id="inactive"
                name="status"
                value="inactive"
                style={{ display: 'none' }}
                onChange={handleStatusChange}
                checked={selectedStatus === 'Inactive'}
            />
            </div>
            
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