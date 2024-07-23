async function getfiles(folderName){
    try{
        const response = await fetch('http://20.169.159.21:21960/getfiles', {
              method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    course: folderName,
                })
        });
        const data = await response.json();
        return data;
    } catch (error){
        console.log("Could not fetch: " + error);
        return [{file_name: "fail"}];
    }
}


export default getfiles;
