import {getCurrentUserToken} from "./UserLC"


export class Requests {
    constructor(url = '', headers = { 
        'Content-Type': 'application/json',
        'Authorization': this.#getAuthorizationHeader()
        }
    ){
        this.baseURL = url
        this.HEADERS = headers 
    }

    #getAuthorizationHeader(){
        const TOKEN = getCurrentUserToken()
        return TOKEN ? `Bearer ${TOKEN}` : ''
    }

    async POST(data = {}, path){
        try {
            const r = await fetch(`${this.baseURL}${path}`, {
                method: "POST",
                headers: this.HEADERS,
                body:JSON.stringify(data)
            })

            if(!r.ok){
                console.log("Request error: ", r.status)
            } 
            
            return await r.json()

        } catch (error) {
            console.log("POST error: ", error)
        } 
    }

    async GET(data = {}, path){
        try {

            const PARAMS = new URLSearchParams(data).toString()

            const r = await fetch(`${this.baseURL}${path}?${PARAMS}`, {
                method: "GET",
                headers: this.HEADERS,
            })

            if(!r.ok){
                console.log("Request error: ", r.status)
            } 
            
            return await r.json()

        } catch (error) {
            console.log("GET error: ", error)
        } 
    }
}