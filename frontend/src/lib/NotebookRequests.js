import { Requests } from "./Requests"

const r = new Requests("http://127.0.0.1:8080/api/v1")

export async function getNotebooks(e, search){
    return r.GET(search, '/notebooks')
}

export async function submitNewNotebook(e, newNotebook){
    return r.POST(newNotebook, '/notebooks/new')
}

