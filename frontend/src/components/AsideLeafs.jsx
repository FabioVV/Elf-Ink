import {useState} from "react"

import Leaf from "./leafs/Leaf"
import Dialog from "./Dialog"

import {submitNewLeaf} from "../lib/NotebookRequests"


function LeafsList({data, HandleFetch, handleActiveLeaf, activeLeaf, handleGetNotebooksPinnedLeafs, token}){
    return (
      <>
        {data?.map((leaf) => (
            <Leaf
              key={leaf.ID}
              leaf={leaf}
              HandleFetch={HandleFetch}
              handleActiveLeaf={handleActiveLeaf}
              activeLeaf={activeLeaf}
              handleGetNotebooksPinnedLeafs={handleGetNotebooksPinnedLeafs}
              token={token}
              
            />
        ))}
      </>
    )
}

function AsideLeafs({leafs, activeNotebook, handleGetNotebooks, handleGetLeafs, handleGetNotebooksPinnedLeafs, searchTitle, pinnedLeafs, searchActive, searchInactive, searchImportant, setSearchTitle, setSearchActive, setSearchInactive, setSearchImportant, setActiveLeaf, activeLeaf, token}) {

    const [leaftTitle, setLeafTitle] = useState('')

    const handleLeafTitle = (e) => {
        setLeafTitle(e.target.value)
    }   

    const handleSubmit = async (e) => {
        e.preventDefault()

        const Leaf = {
            title: leaftTitle,
            notebook_id: activeNotebook?.ID,
        }

        const r = await submitNewLeaf(e, token, Leaf)
        document.getElementById('create-leaf').close()

        if(r['error']){
            window.flash(r['error'], 'error')
        } else {
            window.flash("Leaf created", 'success')
            handleGetNotebooks()
            handleGetLeafs()
            setLeafTitle('')
        }

    } 

    return (
        <div className='notes-section'>
            <div className='notes-filter'>
                <div className="notes-search">
                    <input type="search" placeholder="Search notes..." value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)}/>
                </div>
                <div className="notes-situation">
                    <label className={`sit-progress ${searchImportant ? 'checked' : ''}`} htmlFor="in_progress" >
                        Important
                        <input type="checkbox" style={{display:'none'}} checked={searchImportant} onChange={(e) => setSearchImportant(e.target.checked)} name="in_progress" id="in_progress"/>
                    </label>

                    <label className={`sit-not ${searchInactive ? 'checked' : ''}`} htmlFor="not_active">
                        Not active
                        <input type="checkbox" style={{display:'none'}} checked={searchInactive} onChange={(e) => setSearchInactive(e.target.checked)} name="not_active" id="not_active"/>
                    </label>

                    <label className={`sit-active ${searchActive ? 'checked' : ''}`} htmlFor="_active">
                        Active
                        <input type="checkbox" style={{display:'none'}} checked={searchActive} onChange={(e) => setSearchActive(e.target.checked)} name="_active" id="_active"/>
                    </label>
                </div>
            </div>
            
            {activeNotebook?.ID !== 0 ? 
                <div className="notes-action">
                    <div className='create-leaf'>
                        <span onClick={()=>document.getElementById('create-leaf').showModal()}>
                            <i className="fa-solid fa-circle-plus"></i>
                        </span>
                    </div>            
                </div>
            :
                ""
            }

            <div className="notes pinned">
                <LeafsList token={token} data={pinnedLeafs} handleGetNotebooksPinnedLeafs={handleGetNotebooksPinnedLeafs} HandleFetch={handleGetLeafs} handleActiveLeaf={setActiveLeaf} activeLeaf={activeLeaf}/>
            </div>

            <div className="notes">
                <LeafsList token={token} handleGetNotebooksPinnedLeafs={handleGetNotebooksPinnedLeafs} data={leafs} HandleFetch={handleGetLeafs} handleActiveLeaf={setActiveLeaf} activeLeaf={activeLeaf}/>
            </div>


            <Dialog title={`Create a new Leaf for...`} id={`create-leaf`} notebookName={`${activeNotebook?.title}`}>
                <form onSubmit={handleSubmit} acceptCharset="UTF-8">
                    <div className="field">
                        <input required onChange={handleLeafTitle} value={leaftTitle} type="text" placeholder="Title..." name="title" id="title"/>
                    </div>
                    <div className="submit-arrow">
                        <button><i className="fa-solid fa-arrow-right"></i></button>
                    </div>
                </form>
           </Dialog>
        </div>
    )
}

export default AsideLeafs