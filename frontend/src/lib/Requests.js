export class Requests {
    constructor(url = '', headers = { 'Content-Type': 'application/json' }){
        this.baseURL = url
        this.HEADERS = headers 
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
}