import {useEffect, useState, useRef} from "react"

import '../static/css/editor.css'

import {updateLeaf} from "../lib/NotebookRequests"

function Editor({activeLeaf, setSelectedStatus, selectedStatus}) {
    const [body, setBody] = useState('')
    const [markedBody, setMarkedBody] = useState('')
    const [editorStatus, setEditorStatus] = useState(false)

    const saveTimeout = useRef(null)

    const token = localStorage.getItem("token")

    const handleSubmitPage = async (e) => {
        // e.preventDefault()

        if(!activeLeaf?.ID){
            return false 
        }

        const r = await updateLeaf(e, token, body, activeLeaf?.ID)

        if(r['error']){
            window.flash("There was an error updating your leaf", 'error')
            return false 

        } else {  
            setMarkedBody(r)
            return true
        }
    }

    const onBodyChange = (e) => {
        setBody(e.target.innerHTML)
    }

    const onEditorChange = (e) => {
        
        const editor_mode = document.getElementById('editor-mode-toggle')

        if (editor_mode && activeLeaf?.ID !== 0) {
            setEditorStatus(e.target.checked)
        } else {
            window.flash("Select a leaf to use the editor", 'error')
            editor_mode.checked = false

        }

        // setEditorStatus(e.target.checked)

    }

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value)
    }

    useEffect(()=>{
        setBody(activeLeaf?.body ? activeLeaf?.body : "")
        setMarkedBody(activeLeaf?.marked_body ? activeLeaf?.marked_body : "")

        const docMenterElement = document.querySelector('.doc-menter-content')
        const showPageElement = document.getElementById('show_page')
        const slider = document.querySelector('.slider.round')

        if (docMenterElement) {
            docMenterElement.innerHTML = activeLeaf?.body ? activeLeaf?.body : ""
        }

        if(showPageElement){
            showPageElement.innerHTML = activeLeaf?.marked_body ? activeLeaf?.marked_body : ""
        }

        if (slider && activeLeaf) {
            slider.style.backgroundColor = "grey"
        }

    }, [activeLeaf])

    useEffect(()=>{
        const showPageElement = document.getElementById('show_page')
        if(showPageElement){
            showPageElement.innerHTML = markedBody
        }
    }, [markedBody])

    // I decided agains throttling the autosave because yes
    // also i kept the color changing here, but decided to ultimately hide save button
    // since its saving at basically every input
    // for this small, lightweight app i think it works very well
    useEffect(()=>{
        const saveIcon = document.querySelector('#sub__')

        if(saveIcon){
            saveIcon.style.color = "red"
        }

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }

        saveTimeout.current = setTimeout(async () => {
            if (await handleSubmitPage(null) === true) {
                if (saveIcon) {
                    saveIcon.style.color = "rgb(67, 241, 67)";
                }
            }
        }); 

        return () => {
            clearTimeout(saveTimeout.current)
        }

    }, [body])

    useEffect(()=>{
        const editor_mode = document.getElementById('editor-mode-toggle')
        const docMenterElement = document.querySelector('.doc-menter-content')
        const slider = document.querySelector('.slider.round')
        const toolbox_container =  document.querySelector('.toolbox-edit-container')

        if(toolbox_container){
            toolbox_container.style.display = 'none'
        }

        if (editor_mode) {
            editor_mode.addEventListener('change', onEditorChange)
            editor_mode.checked = false

            if(!activeLeaf){
                slider.style.backgroundColor = "dimgrey"
            }
        }


        if (docMenterElement) {
            docMenterElement.addEventListener('keyup', onBodyChange)
        }

        return () => {
            if (editor_mode) {
                editor_mode.removeEventListener('change', onEditorChange);
            }

            if (docMenterElement) {
                docMenterElement.removeEventListener('keyup', onBodyChange);
            }
        }
    }, [])

    return (
        <div className="editor">
            <div className="toolbox-container">
                <div id='toolbox-change-modes'></div>
                <div style={{display: !editorStatus ? "none" : "flex"}} id='toolbox'></div>
            </div>

            <div style={{display: !editorStatus ? "none" : "flex"}} className="leaf-tags">
                <label htmlFor="important" className={`important-tag ${selectedStatus === 'Important' ? 'checked' : ''}`}>
                    Important
                </label>
                <input
                    type="radio"
                    id="important"
                    name="status"
                    value="Important"
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
                    value="Active"
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
                    value="Inactive"
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