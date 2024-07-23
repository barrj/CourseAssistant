async function makeAuth(name, pass){
    try{
        const response = await fetch('http://20.169.159.21:21960/auth', {
              method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    account: name,
                    pass: pass
                })
        });
        const data = await response.json();
        //console.log("doAuth received from server: " + data);
        return data;
    } catch (error){
        console.log("Count not fetch: " + error);
        return [{full_name: "fail"}];
    }
}


export default makeAuth;
