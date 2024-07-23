import { useState, useEffect} from "react";
import getAttributes from "../utilities/doEdit";
import getfiles from "../utilities/doFiles";
import delfiles from "../utilities/doDelFiles";
import updateAttributes from "../utilities/doUpdateAttr";
import addfiles from "../utilities/doAddFiles";

// Categories
const Edit = ( {account, course} ) => {
  const [data, setData] = useState({});
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState({});
  const [delRslt, setDelRslt] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editAttr, setEditAttr] = useState(false);
  const [editFiles, setEditFiles] = useState(false);
  const [addedFiles, setAddedFiles] = useState([]);
  const [addedFilesError, setAddedFilesError] = useState(false);
  //const [addedContent, setAddedContent] = useState([]);
  //const [addedSize, setAddedSize] = useState([]);
  const [oldName, setOldName] = useState("none");
  const [invalidAN, setInvalidAN] = useState(false);
  const [invalidSN, setInvalidSN] = useState(false);
  const [invalidM, setInvalidM] = useState(false);
  const [invalidT, setInvalidT] = useState(false);
  const [invalidMT, setInvalidMT] = useState(false);
  const [invalidMM, setInvalidMM] = useState(false);
  const [invalidI, setInvalidI] = useState(false);

  const update = async () => {
    var select = document.getElementById("model");
    let newAttributes = {
          aname: document.getElementById('name').value, 
          sname: document.getElementById('store').value, 
          model: select.value,
          temp: document.getElementById('temp').value, 
          maxT: document.getElementById('maxT').value, 
          maxM: document.getElementById('maxM').value, 
          instr: document.getElementById('instr').value, 
          course: course,
          oldAssist: oldName
    }
    /* This is a regular expression that matches if a string */
    /* is NOT a lower/upper case letter or a number */
      //console.log("newAttributes is:");
      //console.log(newAttributes);
    // const validLett = /^[a-zA-Z" "]+$/;
    const validBoth = /^[a-zA-Z0-9]+$/;
    const validNum = /^[0-9]+$/;
    if (!validBoth.test(newAttributes.name)){
        setInvalidAN(true);
        console.log("Found invalid name or account");
    }
    else if (!validBoth.test(newAttributes.store)){
        setInvalidSN(true);
        console.log("Found invalid major");
    }
    else if (newAttributes.model !== 'gpt-4o' && newAttributes.model !== "gpt-4-turbo" 
        && newAttributes.model !== 'gpt-4' && newAttributes.model !== "gpt-3.5-turbo") {
        setInvalidM(true);
        console.log("Found invalid model ");
    }
    else if (parseInt(newAttributes.temp) < 0 || parseInt(newAttributes.temp) > 1){
        setInvalidT(true);
        console.log("Found invalid temp");
    }
    else if (!validNum.test(newAttributes.maxT)){
        setInvalidMT(true);
        console.log("Found invalid grad year ");
    }
    else if (!validNum.test(newAttributes.maxM)){
        setInvalidMM(true);
        console.log("Found invalid age ");
    }
    else{
      //console.log("Edit is sending new attributes:");
      //console.log(newAttributes);
      let rslt = await updateAttributes(newAttributes);
      //console.log("Edit received from server: " + rslt[0]);
      setResult(rslt[0]);
    }
  }
    // function to get a list of files used in the assistant
    async function getAllFiles(){
       let rslt  = await getfiles(course);
       setFiles(rslt);
    };

  useEffect( () => {
    var pdata;
    setInvalidAN(false);
    setInvalidSN(false);
    setInvalidM(false);
    setInvalidT(false);
    setInvalidMT(false);
    setInvalidMM(false);
    setInvalidI(false);
    setDelRslt(false);
    setAddedFilesError(false);
    async function getData(){
       pdata  = await getAttributes(course);
       setOldName(pdata[0].name);
       setData(pdata[0]);
    };
    getData();

    getAllFiles();
      //console.log(files);
  }, []);

    const deleteFiles = async () => {
        //console.log("Will delete " + selectedFiles);
        let rslt = await delfiles(course, selectedFiles);
        //console.log("Deleted files " + rslt);
        if (rslt === "success"){
           setDelRslt(true);
           getAllFiles();
        };
    }

    const addToSelected = (fileName) => {
        let item = document.getElementById(fileName);
        if (item.checked){
           let temp = selectedFiles.slice();
           temp.push(fileName);
           setSelectedFiles(temp);
        }
        else{
            if (selectedFiles.includes(fileName)){
                let indx = selectedFiles.indexOf(fileName);
                let temp = "";
                if (indx === 0){
                    temp = selectedFiles.splice(1);
                }
                else{
                    temp = selectedFiles.splice(0, indx).concat(selectedFiles.splice(indx));
                }
                setSelectedFiles(temp);
            }
        }
    }

    // function to send files to the assistant
    async function addFiles(){
       const files = document.getElementById("files");
       let rslt  = await addfiles(files, course);
        //console.log("addFiles got return value: " + rslt);
        //
        /* This calls the REST API directly.
       const formData = new FormData();
       //formData.append("name", name.value);
       formData.append("course", course);
       for(let i =0; i < files.files.length; i++) {
            formData.append("files", files.files[i]);
       }
       await fetch('http://20.169.159.21:21960/addfiles', {
           method: 'POST',
           body: formData,
           //headers: { "Content-Type": "multipart/form-data" }
       })
        .then((res) => console.log(res))
        .catch((err) => {
            console.log("Error occured calling /addfiles" + err);
            setAddedFilesError(true);
        })
        */
    };

    const filesToAdd = () => {
       const rslt = document.getElementById("files");
       //console.log("selected files:");
       let tempFiles = [];
       for(let i =0; i < rslt.files.length; i++) {
          //console.log(rslt.files[i].name);
          tempFiles.push(rslt.files[i].name);
          setAddedFiles(tempFiles);
       }
    }

    const toggleEditAttr = () => {
        setEditAttr(!editAttr);
    }

    const toggleEditFiles = () => {
        setEditFiles(!editFiles);
    }

  return(
  <div className="attributes">
      <h2>Edit Attributes or Files</h2>
      <button className="button" type="button" onClick={toggleEditAttr}>
        Edit Attributes
      </button>
      {editAttr && (
      <div>
    <h2>Attributes for { course }</h2>
     <h3>Authenticated as { account }</h3>
    <label htmlFor="name">Assistant Name:</label>
    <input type="text" id="name" name="name" defaultValue={data.name} /><br /><br />
      {invalidAN && (
        <p> Bad assistant name entered. </p>
      )}

    <label htmlFor="store">Store Name (cannot be changed):</label>
    <input type="text" id="store" name="store" defaultValue={data.store} readOnly /><br /><br />
      {invalidSN && (
        <p> Bad store name entered. </p>
      )}

    <label htmlFor="model">Model (newest to oldest, newer models are cheaper):</label> 
      <select name="model" id="model">
        <option value="gpt-4o">gpt-4o</option>
        <option value="gpt-4-turbo">gpt-4-turbo</option>
        <option value="gpt-4">gpt-4</option>
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
      </select> <br /><br />
      {invalidM && (
        <p> Bad Model entered. </p>
      )}

    <label htmlFor="temp">Temperature (between 0 and 1): </label>
    <input type="text" id="temp" name="temp" defaultValue={data.temp} /> <br /><br /> 
      Lower values for temperature result in more consistent outputs (e.g. 0.2). <br /> <br />Higher values generate more diverse and creative results (e.g. 1.0)<br /><br />
      {invalidT && (
        <p> Bad Temperature entered. </p>
      )}
    <label htmlFor="maxT">Max Token (currently ignored)</label>
    <input type="text" id="maxT" name="maxT" defaultValue={data.max_token} /><br /><br />
      {invalidMT && (
        <p> Bad Max Token entered. </p>
      )}
    <label htmlFor="maxM">Max number of messages per thread:</label>
    <input type="text" id="maxM" name="maxM" defaultValue={data.max_messages} /><br /><br />
      {invalidMM && (
        <p> Bad Maximum for number of messages per thread entered. </p>
      )}
    <label htmlFor="instr">Instructions <br />(these instructsions will be used exactly as you enter them):</label>
    <textarea id="instr" name="instr" cols="80" rows="15" defaultValue={data.instructions} /><br /><br />
      {invalidI && (
        <p> Bad Instructions entered. </p>
      )}
      <button className="button" type="button" onClick={() => update()}>
        Replace current assistant
      </button>
       {result && (
         <p> {result.rslt} </p>  
       )}
     </div>
      )}
      <br /><br />
      <hr />
      <br /><br />
      <button className="button" type="button" onClick={toggleEditFiles}>
        Edit Files
      </button>
      {editFiles && (
      <div>
     <br /><br />
        <fieldset>
        <legend>Select a file to remove</legend>
          {files.map((file, indx) => 
              <div key={indx} >
              <input type="checkbox" name={file} id={file} value={file} defaultChecked={false} onClick={() => addToSelected(file)} />
              &nbsp; {file}<br /></div>)
          }
        <br /><br />
        </fieldset>
        <b>Selected Files:</b><br /> {selectedFiles.map((file, indx) => <div key={indx}>{file}</div>)}
        <br /><br />
      <button className="button" type="button" onClick={() => deleteFiles()}>
        Delete Selected Files
      </button>
       {delRslt && (
         <p> Files deleted! </p>  
       )}
      {/*
    <br /> <br />
    <button className="button" onClick={() => {openFilePicker()} }>Choose files to add</button>
    */}
       <br /> <br />
      <div>
      <h2>Files to add:</h2><br />To Change the chosen list of files, re-choose the files
      </div>
      <br /><br />
      <div className="input_container">
      <label htmlFor="files" className="custom-file-upload">
        Select Files to Add
      </label>
      <input type="file" name="files" id="files" multiple 
          onChange={filesToAdd}/> 
      </div>
      <br /><br />
      <b>Files to add:</b>
      <div>
      {addedFiles.map((file, index) => (<p key={index}>{file}</p>))}
      </div>
      <br /><br />
      <button className="button" type="button" onClick={() => addFiles()}>
        Add Selected Files
      </button>
       {addedFilesError && (
         <p> There is a corrupted file! </p>  
       )}
     </div>
      )}
  </div>
  )};

export default Edit;
