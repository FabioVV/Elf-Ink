class Documenter extends HTMLElement {

    constructor() {
        super()
        this.contentDiv = null
        this.caretPos = null
        this.textHistoryManager = null
        this.inputHidden =  document.querySelector('#content_hidden')
    }

    connectedCallback() {
        this.setAttribute('role', "textbox")
        this.inputHidden =  document.querySelector('#content_hidden')

        this.contentDiv = document.createElement('div')
        this.contentDiv.classList.add("doc-menter-content")
        this.contentDiv.setAttribute('contenteditable', true)
        this.contentDiv.setAttribute('autofocus', true)
        this.appendChild(this.contentDiv)

        this.contentDiv.innerHTML = parseMarkdown(this.inputHidden.value)
        this.textHistoryManager = new History(this.contentDiv)

        // Specify the div ID to load the toolbox into
        insertToolbox('toolbox')

        this.contentDiv.addEventListener('keydown', this.handleTextHistory.bind(this))
        this.contentDiv.addEventListener('input', this.handleInput.bind(this))
        this.contentDiv.addEventListener('blur', this.handleBlur.bind(this))
        this.contentDiv.addEventListener('focus', this.handleFocus.bind(this))

        document.getElementById('markdown-file').addEventListener('change', this.uploadImage.bind(this))
        document.querySelector('.image.editor-button').addEventListener('click', this.handleClickOnFileField.bind(this))
        document.querySelector('.bold.editor-button').addEventListener('click', this.insertBold.bind(this))
        document.querySelector('.italic.editor-button').addEventListener('click', this.insertItalic.bind(this))
        document.querySelector('.header.editor-button').addEventListener('click', this.insertHeader.bind(this))
        document.querySelector('.listul.editor-button').addEventListener('click', this.insertUnorderedList.bind(this))
        document.querySelector('.listol.editor-button').addEventListener('click', this.insertOrderedList.bind(this))
        document.querySelector('.code.editor-button').addEventListener('click', this.insertCode.bind(this))
        document.querySelector('.task.editor-button').addEventListener('click', this.insertTask.bind(this))
        document.querySelector('.table.editor-button').addEventListener('click', this.insertTable.bind(this))
        document.querySelector('.link.editor-button').addEventListener('click', this.insertLink.bind(this))

    }

    disconnectedCallback(){
        this.#cleanEventListeners()
    }

    handleClickOnFileField(){
        document.getElementById('markdown-file').click()
    }

    handleMarkdown(){
        let contentElement = this.contentDiv

        const scrollPosition = window.scrollY || window.pageYOffset

        const content = contentElement.textContent
        const restore = this.textHistoryManager.saveCaretPosition(contentElement)
        const parsedContent = parseMarkdown(content)

        contentElement.innerHTML = parsedContent
        this.inputHidden.value = contentElement.innerHTML

        restore()
        
        window.scrollTo(0, scrollPosition)
    }

    handleInput(event) {
        event.preventDefault()
        this.handleMarkdown()
    }

    handleTextHistory(event){
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault()
            this.textHistoryManager.undo()

        } else if (event.ctrlKey && event.key === 'y') {
            event.preventDefault()
            this.textHistoryManager.redo()

        } else if (event.key === "Tab"){
            event.preventDefault()
            this.textHistoryManager.insertAtCaret('  ')
            this.handleMarkdown()

        } else if (event.key === 'Backspace' || event.key === "Delete"){
            event.preventDefault()

            let selection = window.getSelection()
            selection.deleteFromDocument()

            if(!selection.rangeCount){
                selection.deleteFromDocument()

            } else {        
                const range = selection.getRangeAt(0)
        
                if (!this.contentDiv.contains(range.commonAncestorContainer)) {
                    return
                }
        
                const currentNode = range.startContainer

                try{
                    range.setStart(currentNode, range.startOffset - 1);
                    range.deleteContents()
                } catch(error){}
            }

            this.textHistoryManager.saveState()

        } else if(event.key == 'Enter'){
            event.preventDefault()

            const selection = window.getSelection()
            if (selection.rangeCount === 0) return // Ensure there is a selection

            const range = selection.getRangeAt(0)
            const currentNode = range.startContainer
            const currentOffset = range.startOffset;

            // Get the text before the caret
            const textBeforeCaret = currentNode.textContent.substring(0, currentOffset)
            const linesBefore = textBeforeCaret.split('\n')
            const currentLine = linesBefore[linesBefore.length - 1]
        
            let newLine = '\n'

            if (currentLine.match(/^\d+\. /)) {
              newLine = `\n${parseInt(currentLine, 10) + 1}. `

            } else if (currentLine.match(/^- /)) {
              newLine = `\n- `
            } 

            if(newLine == '\n'){
                document.execCommand('InsertLineBreak')

            } else {

                const newTextNode = document.createTextNode(newLine)
                range.deleteContents() // Clear the selection (if any)
                range.insertNode(newTextNode)
                
                
                // Set the caret after the new line
                range.setStartAfter(newTextNode)
                range.collapse(true)
                selection.removeAllRanges()
                selection.addRange(range)
            }

        }

        this.handleMarkdown()
    }

    handleBlur() {
        this.saveCaret = this.textHistoryManager.saveCaretPosition(this.contentDiv)
        window.getSelection().removeAllRanges()
    }

    handleFocus() {
        if (this.saveCaret) {
            this.saveCaret()
        }
    }

    insertHeader() {
        this.textHistoryManager.insertAtCaret('# ')
        this.handleMarkdown()
    }

    insertBold() {
        this.textHistoryManager.insertAtCaret('****')
        this.handleMarkdown()

    }

    insertItalic() {
        this.textHistoryManager.insertAtCaret('**')
        this.handleMarkdown()

    }

    insertUnorderedList() {
        this.textHistoryManager.insertAtCaret('- ')
        this.handleMarkdown()

    }

    insertOrderedList() {
        this.textHistoryManager.insertAtCaret('1. ')
        this.handleMarkdown()

    }

    insertLink() {
        this.textHistoryManager.insertAtCaret(`[title](url)`)
        this.handleMarkdown()

    }

    insertCode(){
        const CODE = "\n```\n```"
        this.textHistoryManager.insertAtCaret(`${CODE}`)
        this.handleMarkdown()

    }

    
    insertTask(){
        this.textHistoryManager.insertAtCaret('- [x] First item \n- [x] Second item \n- [ ] ')
        this.handleMarkdown()

    }
    
    insertTable(){
        const TABLE = `
| Left-aligned | Center-aligned | Right-aligned |
| :---         |     :---:      |          ---: |
| git status   | git status     | git status    |
| git diff     | git diff       | git diff      |
        `
        this.textHistoryManager.insertAtCaret(`${TABLE}`)
        this.handleMarkdown()

    }

    insertImage(url, filename) {
        const markdownImage = `![${filename}](${url})`
        this.textHistoryManager.insertAtCaret(markdownImage)
        this.handleMarkdown()

    }

    async uploadImage(event) {
        const file = event.target.files[0]
    
        if (file) {
          const formData = new FormData()
          formData.append('image', file)
          
          const PAGE_SLUG = document.getElementById('markdown-file').dataset.id
          const BOOK_SLUG = document.getElementById('markdown-file').dataset.bookId

          try {
            const response = await fetch(`/books/${BOOK_SLUG}/pages/${PAGE_SLUG}/upload_markdown_image`, {
                method: 'POST',
                headers: {
                    // 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formData
            })
    
            if(response.ok){
              const { url, filename } = await response.json()
              this.insertImage(url, filename)

            } else {
              console.log('Image tag could not be generated.')
            }
    
          } catch (error) {
            console.log(`Error uploading image: ${error}`)
          }
    
        } else {
          return 
        }
    }

    #cleanEventListeners(){
        // this.contentDiv.removeEventListener('keydown', this.handleKeyDown.bind(this))
        this.contentDiv.removeEventListener('input', this.handleInput.bind(this))
        this.contentDiv.removeEventListener('blur', this.handleBlur.bind(this))
        this.contentDiv.removeEventListener('focus', this.handleFocus.bind(this))
        document.getElementById('markdown-file').removeEventListener('change', this.uploadImage.bind(this))
        document.querySelector('.image.editor-button').removeEventListener('click', this.handleClickOnFileField.bind(this))
        document.querySelector('.bold.editor-button').removeEventListener('click', this.insertBold.bind(this))
        document.querySelector('.italic.editor-button').removeEventListener('click', this.insertItalic.bind(this))
        document.querySelector('.header.editor-button').removeEventListener('click', this.insertHeader.bind(this))
        document.querySelector('.listul.editor-button').removeEventListener('click', this.insertUnorderedList.bind(this))
        document.querySelector('.listol.editor-button').removeEventListener('click', this.insertOrderedList.bind(this))
        document.querySelector('.code.editor-button').removeEventListener('click', this.insertCode.bind(this))
        document.querySelector('.link.editor-button').removeEventListener('click', this.insertLink.bind(this))
    }

}

class History {
    constructor(element) {
        this.element = element
        this.undoStack = []
        this.redoStack = []

        // this.saveState()

        this.element.addEventListener('input', () => {
            this.saveState()
        })
    }

    saveState(){
        this.undoStack.push({content: this.element.innerHTML, caretPosRestore: this.saveCaretPosition(this.element)})
        this.redoStack = []
    }

    undo(){
        if(this.undoStack.length > 0){
            const { content, caretPosRestore } = this.undoStack.pop();

            this.redoStack.push({content: this.element.innerHTML, caretPosRestore: this.saveCaretPosition(this.element)})
            this.element.innerHTML = content

            caretPosRestore()
        }
    }

    redo(){
        if(this.redoStack.length > 0){
            const { content, caretPosRestore } = this.redoStack.pop();

            this.undoStack.push({content: this.element.innerHTML, caretPosRestore: this.saveCaretPosition(this.element)})
            this.element.innerHTML = content
            
            caretPosRestore()
        }
    }

    saveCaretPosition(context){
        let selection = window.getSelection()

        let range = selection.getRangeAt(0)
        range.setStart(  context, 0 )
        let len = range.toString().length
    
        return function restore(){
            let pos = getTextNodeAtPosition(context, len)
            selection.removeAllRanges()
            let range = new Range()
            range.setStart(pos.node ,pos.position)
            selection.addRange(range)
    
        }
    }

    insertAtCaret(text){
        this.element.focus()

        const selection = window.getSelection()
        if (!selection.rangeCount) return

        const range = selection.getRangeAt(0)

        if (!this.element.contains(range.commonAncestorContainer)) {
            return
        }

        range.deleteContents()

        const textNode = document.createTextNode(text)
        range.insertNode(textNode)    

    }

}

// Helper of saveCaretPosition
function getTextNodeAtPosition(root, index){
    const NODE_TYPE = NodeFilter.SHOW_TEXT
    let treeWalker = document.createTreeWalker(root, NODE_TYPE, function next(elem) {
        if(index > elem.textContent.length){
            index -= elem.textContent.length
            return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT
    })
    let c = treeWalker.nextNode()

    return {
        node: c ? c : root,
        position: index
    }
}

function createButton(className, title, action, iconClass) {
    const button = document.createElement('div');
    button.className = `${className} editor-button`;
    button.title = title;
    button.setAttribute('data-action', action);

    const icon = document.createElement('i');
    icon.className = iconClass;
    button.appendChild(icon);

    return button;
}

function createIconButton(id, title, iconClass) {
    const button = document.createElement('div');
    const a = document.createElement('a');
    const icon = document.createElement('i');

    icon.id = id;
    icon.title = title;
    icon.className = iconClass;

    a.appendChild(icon);
    button.appendChild(a);

    return button;
}

function createSaveButton() {
    const button = document.createElement('div');
    const label = document.createElement('label');
    const icon = document.createElement('i');

    label.htmlFor = 'submit_page';
    icon.id = 'sub__';
    icon.title = 'Save page';
    icon.className = 'fa-solid fa-circle-check';

    label.appendChild(icon);
    button.appendChild(label);

    return button;
}

function createEditorModeToggle() {
    const changeEditorModeDiv = document.createElement('div');
    changeEditorModeDiv.className = 'change-editor-mode';

    const eyeSpan = document.createElement('span');
    const eyeIcon = document.createElement('i');
    eyeIcon.className = 'fa-solid fa-eye';
    eyeSpan.appendChild(eyeIcon);

    const toggleSpan = document.createElement('span');

    const toggleLabel = document.createElement('label');
    toggleLabel.className = 'switch';
    toggleLabel.htmlFor = 'editor-mode-toggle';

    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.id = 'editor-mode-toggle';

    const sliderSpan = document.createElement('span');
    sliderSpan.className = 'slider round';

    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(sliderSpan);
    toggleSpan.appendChild(toggleLabel);

    const penNibSpan = document.createElement('span');
    const penNibIcon = document.createElement('i');
    penNibIcon.className = 'fa-solid fa-pen-nib';
    penNibSpan.appendChild(penNibIcon);

    changeEditorModeDiv.appendChild(eyeSpan);
    changeEditorModeDiv.appendChild(toggleSpan);
    changeEditorModeDiv.appendChild(penNibSpan);

    return changeEditorModeDiv;
}

function insertToolbox(containerId) {
    const toolbox = document.createElement('div');
    const _toolbox = document.createElement('div');

    _toolbox.id = 'markdown-load-toolbox';
    toolbox.className = 'toolbox-edit-markdown';

    const buttons = [
        { className: 'header', title: 'Insert header', action: 'insertHeader', iconClass: 'fa-solid fa-heading' },
        { className: 'bold', title: 'Insert bold text', action: 'insertBold', iconClass: 'fa-solid fa-bold' },
        { className: 'italic', title: 'Insert italic text', action: 'insertItalic', iconClass: 'fa-solid fa-italic' },
        { className: 'listul', title: 'Insert unordered list', action: 'insertUnorderedList', iconClass: 'fa-solid fa-list-ul' },
        { className: 'listol', title: 'Insert ordered list', action: 'markdown#insertOrderedList', iconClass: 'fa-solid fa-list-ol' },
        { className: 'code', title: 'Insert code block', action: 'insertCode', iconClass: 'fa-solid fa-code' },

        { className: 'task', title: 'Insert task list', action: 'insertTask', iconClass: 'fa-solid fa-list-check' },
        { className: 'table', title: 'Insert table block', action: 'insertTable', iconClass: 'fa-solid fa-table' },

        { className: 'link', title: 'Insert link', action: 'insertLink', iconClass: 'fa-solid fa-link' },
        { className: 'image', title: 'Insert image', action: 'insertImage', iconClass: 'fa-solid fa-images' }
    ];

    const container = document.getElementById(containerId);
    if (container) {
        // Insert the "Change Editor Mode" section first
        const editorModeToggle = createEditorModeToggle();
        document.querySelector('#toolbox-change-modes').appendChild(editorModeToggle)

        container.appendChild(_toolbox);
        _toolbox.appendChild(toolbox);

        // Insert the buttons
        buttons.forEach(buttonInfo => {
            const button = createButton(buttonInfo.className, buttonInfo.title, buttonInfo.action, buttonInfo.iconClass);
            toolbox.appendChild(button);
        });

        // Create toolbox edit container
        const toolboxEditContainer = document.createElement('div');
        toolboxEditContainer.className = 'toolbox-edit-container';

        // Insert the "Delete Page" button
        // const deleteButton = createIconButton('del__', 'Delete leaf', 'fa-solid fa-delete-left');
        // deleteButton.className = 'delete-page-button';
        // toolboxEditContainer.appendChild(deleteButton);

        // Insert the "Save Page" button
        const saveButton = createSaveButton();
        saveButton.className = 'save-page-button';
        toolboxEditContainer.appendChild(saveButton);

        // Append toolboxEditContainer to _toolbox
        container.appendChild(toolboxEditContainer);

    } else {
        console.error(`Container with id '${containerId}' not found.`);
    }
}


const Markup = [
    { r: /^###### (.*)$/gm, replace: "<h6 class='h6'>###### $1</h6>" },
    { r: /^##### (.*)$/gm, replace: "<h5 class='h5'>##### $1</h5>" },
    { r: /^#### (.*)$/gm, replace: "<h4 class='h4'>#### $1</h4>" },
    { r: /^### (.*)$/gm, replace: "<h3 class='h3'>### $1</h3>" },
    { r: /^## (.*)$/gm, replace: "<h2 class='h2'>## $1</h2>" },
    { r: /^# (.*)$/gm, replace: "<h1 class='h1'># $1</h1>" },
    { r: /(?<!\*)\*\*([^*]+)\*\*(?!\*)/gm, replace: "<strong>**$1**</strong>" },
    { r: /(?<!_)__([^_]+)__(?!_)/gm, replace: "<strong>__$1__</strong>" },
    { r: /(?<!\*)\*([^*]+)\*(?!\*)/gm, replace: "<em>*$1*</em>" },
    { r: /(?<!_)_([^_]+)_(?!_)/gm, replace: "<em>_$1_</em>" },
    { r: /^```(.*?)```$/gms, replace: "<code>```$1```</code>" },
    // { r: /([^`])`([^`]+)`([^`])/gm, replace: "$1<code>`$2`</code>$3" },
    { r: /==(.*?)==/gm, replace: "<mark>==$1==</mark>" },
    { r: /~~(.*)?~~/gm, replace: "<s>~~$1~~</s>" },
    { r: /(?<!!)\[(.*?)\]\((.*?)\)/gm, replace: "[$1]<a href='$2'>($2)</a>" },
]


function parseMarkdown(content = ""){

    Markup.forEach(regex => {
        content = content.replaceAll(regex.r, regex.replace)
    })
    return content
}

customElements.define('doc-menter', Documenter)