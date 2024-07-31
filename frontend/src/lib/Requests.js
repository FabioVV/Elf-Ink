export class Requests {
    constructor(url = '', headers = { 
        'Content-Type': 'application/json',
        }
    ){
        this.baseURL = url
        this.HEADERS = headers 
    }

    async POST(data = {}, path){
        try {
            const r = await fetch(`${this.baseURL}${path}`, {
                method: "POST",
                credentials: 'include',
                headers: this.HEADERS,
                body:JSON.stringify(data),
            })

            if(!r.ok){
                console.log("Request error: ", r.status)
            } 
            
            return await r.json()

        } catch (error) {
            console.log("POST error: ", error)
        } 
    }

    async PATCH(data = {}, path, ID){
        try {
            const r = await fetch(`${this.baseURL}${path}/${ID}`, {
                method: "PATCH",
                credentials: 'include',
                headers: this.HEADERS,
                body:JSON.stringify(data),
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
                credentials: 'include',
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