async function getProfile(account){
    try{
        const response = await fetch('http://20.169.159.21:21959/profile', {
              method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    account: account,
                })
        });
        const data = await response.json();
        console.log("getProfile received from server: " + data);
        console.log("getProfile received name from server: " + data[0].full_name);
        return data;
    } catch (error){
        console.log("Count not fetch: " + error);
        return [{full_name: "fail"}];
    }
}


export default getProfile;
