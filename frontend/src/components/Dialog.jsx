import '../static/css/dialog.css'

function Dialog({title, id, children, notebookName}) {
    return (
        <dialog id={id}>
            <h1>{title}</h1>
            {notebookName ? 
                <h4>{notebookName}</h4>
                :
                ""
            }

            {children}

            <form id="close-dialog" method="dialog">
                <button>Close</button>
            </form>
        </dialog>
    )

}

export default Dialog