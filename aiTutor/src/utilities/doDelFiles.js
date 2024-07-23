async function delfiles(course, files){
    try{
        const response = await fetch('http://20.169.159.21:21960/deletefiles', {
              method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    course: course,
                    filesToDel: files
                })
        });
        const data = await response.json();
        return data;
    } catch (error){
        console.log("Could not fetch: " + error);
        return [{file_name: "fail"}];
    }
}


export default delfiles;
