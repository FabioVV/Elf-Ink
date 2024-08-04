import { Requests } from "./Requests"

const r = new Requests("http://127.0.0.1:8080/api/v1")

import {RegisterUser} from "/wailsjs/go/main/App";

export async function submitNewUser(e, newUser){
    return await RegisterUser(newUser)
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

export async function getUserData(e){
    return r.GET({}, '/user/get')
}
