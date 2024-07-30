function ExpiredLocalStorage(){

    let expiration_date = undefined

    if (localStorage.getItem("") != null) {
        expiration_date = JSON.parse(localStorage.getItem('mduser'))['expiration']
    } else {
        console.log('EXP_Error')
    }


    let now = new Date()
    if (expiration_date != undefined && now.getTime() > expiration_date){
        // Problably overkill
        removeCurrentUser()
        
        // Removes user and all of his data (cart etc) from localstorage
        clearLocalStorage()

    }

}

export function getCurrentUser(){
    try{
        // ExpiredLocalStorage()
        if (localStorage.getItem("mduser") != null) {
            return JSON.parse(localStorage.getItem('mduser'))
        }else {
            return null
        }

    } catch(error){
        console.log("Error retrieving user ->" + error)
    }
}

export function getCurrentUserToken(){
    try{
        // ExpiredLocalStorage()
        if (localStorage.getItem("mduser") != null) {
            return JSON.parse(localStorage.getItem('mduser'))['token']
        } else {
            return null
        }
        
    } catch(error){
        console.log("Error retrieving user ->" + error)
    }
}

export function setCurrentUser(user, token){
    try{
        // ExpiredLocalStorage()

        Object.assign(user, {token:token})

        //EXPIRATION TIME FOR LOCALSTORAGEDATA
        Object.assign(user, {expiration:new Date().getTime()+ (60000 * 60)})

        localStorage.setItem('mduser', JSON.stringify(user))

    } catch(error){
        console.log("Error setting user ->" + error)
    }
}


export function updateCurrentUser(user_new_data){
    try{
        // ExpiredLocalStorage()

        let user = getCurrentUser()
        
        Object.entries(user).forEach(([key, val]) => {
            if(user_new_data[key]){
                user[key] = user_new_data[key]
            }
        });

        removeCurrentUser()

        //EXPIRATION TIME FOR LOCALSTORAGEDATA
        // Object.assign(user, {expiration:new Date().getTime()+ (60000 * 30)})

        localStorage.setItem('mduser', JSON.stringify(user))


    } catch(error){
        console.log("Error updating user ->" + error)
    }
}

export function removeCurrentUser(){
    try{

        if (localStorage.getItem("mduser") != null) {
            localStorage.removeItem('mduser')
        }

    } catch(error){
        console.log("Error removing user ->" + error)
    }
}

export function clearLocalStorage(){
    try{
        
        localStorage.clear()

    } catch(error){
        console.log("Error clearing local storage ->" + error)
    }
}