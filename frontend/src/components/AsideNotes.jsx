import {useState} from "react"

import Leaf from "./leafs/Leaf"
import Dialog from "./Dialog"

import {submitNewLeaf} from "../lib/NotebookRequests"


function LeafsList({data, HandleFetch}){
    return (
      <>
        {data?.map((leaf) => (
            <Leaf
              key={leaf.ID}
              leaf={leaf}
              HandleFetch={HandleFetch}
            />
        ))}
      </>
    )
}


function AsideNotes({leafs, activeNotebook}) {

    const [leaftTitle, setLeafTitle] = useState('')

    const handleLeafTitle = (e) => {
        setLeafTitle(e.target.value)
    }   

    const handleSubmit = async (e) => {
        e.preventDefault()

        const Leaf = {
            title: leaftTitle,
            notebook_id: activeNotebook.ID,
        }

        const r = await submitNewLeaf(e, Leaf)

        if(r['error']){
            alert(r['error'])
        } else {
            document.getElementById('create-leaf').close()
        }

    } 

    return (
        <div className='notes-section'>
            <div className='notes-filter'>
                <div className="notes-search">
                    <input type="search" placeholder="Search notes..." />
                </div>
                <div className="notes-situation">
                    <span className="sit-progress">In progress</span>
                    <span className="sit-not">Not active</span>
                    <span className="sit-active">Active</span>
                </div>
            </div>

            {activeNotebook ? 
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


            <div className="notes">
                <LeafsList data={leafs} HandleFetch={null}/>
            </div>


            <Dialog title={`Create a new Leaf for ${activeNotebook?.title}`} id={`create-leaf`}>
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

export default AsideNotes