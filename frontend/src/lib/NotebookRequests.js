
import {GetNotebooks, GetActiveNotebook, 
    GetActiveLeaf, SetNewActiveNotebook, SetNewActiveLeaf,
    CreateNewNotebook, CreateNewLeaf, SetNewStatusLeaf, 
    UpdateLeaf, DeleteNotebook, PatchNotebookName,
    DeleteLeaf, PatchLeafName, GetActiveNotebookPinnedLeafs,
    SubmitNewPinnedLeaf, SubmitRemovedPinnedLeaf} from "/wailsjs/go/main/App"

export async function getNotebooks(e, token, searchTitle){
    return await GetNotebooks(token, searchTitle)
}

export async function getActiveNotebook(e, token, searchTitle, searchInactive, searchActive, searchImportant){
    if(searchActive == true){
        searchActive = "true"
    } else {
        searchActive = "false"
    }   

    if(searchInactive == true){
        searchInactive = "true"
    } else {
        searchInactive = "false"
    }

    if(searchImportant == true){
        searchImportant = "true"
    } else {
        searchImportant = "false"
    }

    return await GetActiveNotebook(token, searchTitle, searchInactive, searchActive, searchImportant)
}


export async function getActiveNotebooksPinnedLeafs(e, token){
    return await GetActiveNotebookPinnedLeafs(token)
}

export async function submitNewNotebook(e, token, newNotebook){
    return await CreateNewNotebook(token, newNotebook)
}

export async function submitNewActiveNotebook(e, token, newActiveNotebookID){
    return await SetNewActiveNotebook(token, newActiveNotebookID)
}

export async function submitNewActiveLeaf(e, token, newActiveLeafID){
    return await SetNewActiveLeaf(token, newActiveLeafID)
}

export async function submitNewPinnedLeaf(e, token, leaf_id){
    return await SubmitNewPinnedLeaf(token, leaf_id)
}

export async function submitRemovedPinnedLeaf(e, token, leaf_id){
    return await SubmitRemovedPinnedLeaf(token, leaf_id)
}

export async function updateLeaf(e, token, leafBody, ID){
    return await UpdateLeaf(token, leafBody, ID)
}

export async function getActiveLeaf(e, token){
    return await GetActiveLeaf(token)
}

export async function submitNewLeaf(e, token, newLeaf){
    return await CreateNewLeaf(token, newLeaf)
}

export async function submitNewLeafStatus(e, token, newStatus) {
    return await SetNewStatusLeaf(token, newStatus)
}

export async function deleteLeaf(e, token, leafID) {
    return await DeleteLeaf(token, leafID)
}

export async function patchLeafName(e, token, leafID, newName){
    return await PatchLeafName(token, leafID, newName)

}

export async function deleteNotebook(e, token, notebookID) {
    return await DeleteNotebook(token, notebookID)
}

export async function patchNotebookName(e, token, notebookID, newName){
    return await PatchNotebookName(token, notebookID, newName)

}


