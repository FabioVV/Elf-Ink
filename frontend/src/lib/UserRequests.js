import {RegisterUser, LoginUser, LogoutUser, ValidateSession} from "/wailsjs/go/main/App";

export async function submitNewUser(e, newUser){
    return await RegisterUser(newUser)
}

export async function loginUser(e, user){
    return await LoginUser(user)
}

export async function logoutUser(e, token){
    return await LogoutUser(token)
}

export async function getUserData(token){
    return await ValidateSession(token)
}
