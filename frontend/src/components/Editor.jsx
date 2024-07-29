function Editor() {
    return (
        <div>
            <div id='toolbox'></div>

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