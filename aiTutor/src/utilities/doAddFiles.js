async function addfiles(files, course){
    console.log("addfiles got course:");
    console.log(course);
    console.log("addfiles got files:");
    console.log(files);

    const formData = new FormData();
    formData.append("course", course);
    for(let i =0; i < files.files.length; i++) {
            formData.append("files", files.files[i]);
       }
    //const fileBlob = new Blob([content[0]]);
    //filesToUpload.append("file1Name", files[0]);
    //filesToUpload.append("file1Content", fileBlob, {filename: files[0], knownLength:sizes[0]});
    //filesToUpload.append("file1Content", fileBlob, {filename: files[0], knownLength:fileBlob.size});
    //filesToUpload.append("file1Content", fileBlob, files[0]);
    //filesToUpload.append("file1Content", content[0]);
    // console.log("doAddFiles filesToUpload: " + filesToUpload);
    // console.log("doAddFiles filesToUpload.course: " + filesToUpload.get("course"));
    // console.log("doAddFiles filesToUpload.file1Name: " + filesToUpload.get("file1Name"));
    // console.log("doAddFiles filesToUpload.file1Content: " + filesToUpload.get("file1Content"));
    // console.log("Form data:");
    // Display the key/value pairs
    console.log("addFiles, listing of FormData:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try{
        const response = await fetch('http://20.169.159.21:21960/addfiles', {
              method: "post",
              //headers: { 'Content-Type': 'multipart/form-data' }, 
                //headers: {
                 //   'Accept': 'application/json',
                  //  'Content-Type': 'application/json'
                //},

                //make sure to serialize your JSON body
                body: formData,
                })
        const data = await response.json();
        console.log("addfile got response: " + data);
        return data;
    } catch (error){
        console.log("Could not fetch: " + error);
        return [{file_name: "fail"}];
    }
}


export default addfiles;
