
function AsideNotes({leafs}) {

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

            <div className="notes">
                <div className="note border-active">
                    <h5>Note title ##$$%%</h5>
                    <span className="status-active">Active</span>
                    <div>
                        <span>Created at: 0000-00-00 00:00:00</span>
                        <span>Updated at: 0000-00-00 00:00:00</span>
                    </div>

                </div>

                <div className="note border-not-active">
                    <h5>Note title ##$$%%</h5>
                    <span className="status-not-active">Not Active</span>
                    <div>
                        <span>Created at: 0000-00-00 00:00:00</span>
                        <span>Updated at: 0000-00-00 00:00:00</span>
                    </div>

                </div>

                <div className="note border-progress">
                    <h5>Note title ##$$%%</h5>
                    <span className="status-progress">In Progress</span>
                    <div>
                        <span>Created at: 0000-00-00 00:00:00</span>
                        <span>Updated at: 0000-00-00 00:00:00</span>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default AsideNotes