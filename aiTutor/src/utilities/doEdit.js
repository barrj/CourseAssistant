async function getAttributes(course){
    try{
        //console.log("getAttributes received " + course);
        const response = await fetch('http://20.169.159.21:21960/attributes', {
              method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    course: course,
                })
        });
        const data = await response.json();
        //console.log("getAttributes received from server: " + data);
        //console.log("getAttributes received name from server: " + data[0].name);
        return data;
    } catch (error){
        console.log("Count not fetch: " + error);
        return [{name: "fail"}];
    }
}


export default getAttributes;
