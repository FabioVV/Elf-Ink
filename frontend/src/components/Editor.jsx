function Editor() {
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
                <form encType="multipart/form-data" acceptCharset="UTF-8"> 
                    <input type="hidden" name="content_hidden" id="content_hidden"/>
                    <input id="markdown-file" style={{display:'none'}} type="file"></input>
                    <doc-menter></doc-menter>
                </form>
            </div>
        </div>
    )
}

export default Editor