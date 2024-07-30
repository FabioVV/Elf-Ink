import { Requests } from "./Requests"

const r = new Requests("http://127.0.0.1:8080/api/v1")

export async function getNotebooks(e, search){
    return r.GET(search, '/notebooks')
}

export async function getLeafs(e, search){
    return r.GET(search, '/leafs')
}

export async function getActiveNotebook(e, search){
    return r.GET(search, '/notebooks/active/get')
}

export async function getActiveNotebookLeafs(e, search){
    return r.GET(search, '/notebooks/active/leafs/get')
}

export async function submitNewNotebook(e, newNotebook){
    return r.POST(newNotebook, '/notebooks/new')
}

export async function submitNewActiveNotebook(e, newActiveNotebook){
    return r.POST(newActiveNotebook, '/notebooks/active')
}

export async function submitNewLeaf(e, newLeaf){
    return r.POST(newLeaf, '/leafs/new')
}