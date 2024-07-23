async function updateAttributes(newAttributes){
    // console.log("updateAttribues receives:");
    // console.log(newAttributes);
    try{
        const response = await fetch('http://20.169.159.21:21960/updateattributes', {
              method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify(newAttributes)
        });
        const data = await response.json();
        // console.log("updateAttributes received from server: " + data);
        // console.log("updateAttributes received value from server: " + data[0]);
        // console.log("updateAttributes received value from server: " + data[0].rslt);
        return data;
    } catch (error){
        console.log("Could not fetch: " + error);
        return [{name: "fail"}];
    }
}

export default updateAttributes;
