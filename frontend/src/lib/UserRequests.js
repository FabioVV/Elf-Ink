import { Requests } from "./Requests"

const r = new Requests("http://127.0.0.1:8080/api/v1")

export async function submitNewUser(e, newUser){
    return r.POST(newUser, '/user/register')
}

export async function loginUser(e, user){
    return r.POST(user, '/user/login')
}

export async function logoutUser(e){
    return r.POST({}, '/user/logout')
}

export async function getCSRF(e){
    return r.GET({}, '/csrf')
}