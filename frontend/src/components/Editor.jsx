
function Editor() {
    return (
        <div>
            <div id='toolbox'></div>

            <input type="hidden" name="content_hidden" id="content_hidden"/>
            <input id="markdown-file" style={{display:'none'}} type="file"></input>

            <doc-menter></doc-menter>
        </div>
    )
}

export default Editor