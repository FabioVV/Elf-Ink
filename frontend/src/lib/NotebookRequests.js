
import {GetNotebooks, GetActiveNotebookLeafs, GetActiveNotebook, 
    GetActiveLeaf, SetNewActiveNotebook, SetNewActiveLeaf,
    CreateNewNotebook, CreateNewLeaf, SetNewStatusLeaf, UpdateLeaf} from "/wailsjs/go/main/App";

export async function getNotebooks(e, token){
    return await GetNotebooks(token)
}

export async function getActiveNotebook(e, token, searchTitle){
    return await GetActiveNotebook(token, searchTitle)
}

export async function getActiveNotebookLeafs(e, token, search){
    return await GetActiveNotebookLeafs(token, search)
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
