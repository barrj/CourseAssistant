async function updateProfile(newProfile){
    try{
        const response = await fetch('http://20.169.159.21:21960/update', {
              method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify(newProfile)
        });
        const data = await response.json();
        console.log("updateProfile received from server: " + data);
        console.log("updateProfile received value from server: " + data.serverStatus);
        return data;
    } catch (error){
        console.log("Could not fetch: " + error);
        return [{full_name: "fail"}];
    }
}


export default updateProfile;
