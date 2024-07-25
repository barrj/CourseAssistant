import { useState } from "react";
import ask from "../utilities/doAsk";
import newThread from "../utilities/doThread";
import PacmanLoader from "react-spinners/PacmanLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

  const Assistant = ( {account, aType} ) => {
    const [resp, setResp] = useState("<p>No Response Yet!</p>");
    const [loading, setLoading] = useState(false);
    const [thread, setThread] = useState("No New Conversation Yet!");
    const [addedFiles, setAddedFiles] = useState([]);
    const [addRslt, setAddRslt] = useState(false);
    const [addedFilesError, setAddedFilesError] = useState(false);
    

    //setTheA(aType);

    const askAssistant = async () => {
      setLoading(true);
      const quest = document.getElementById('question').value; 
      const files = document.getElementById("files");
      const temp = await ask(account, aType, quest, files);
      // console.log("the Assistant received this from doAsk: \n\n" + temp);
      setResp(temp);
      setLoading(false);
      const convers = "Conversation continues!";
      setThread(convers);
      setAddedFiles([]);
      files.value = null;
      //const answer = document.getElementById('response');
      //answer.innerHtml = temp;
    }

    const startThread = async () => {
      setLoading(true);
      const temp = await newThread(account, aType);
      //console.log("the request for a new thread received this from newThread: \n\n" + temp);
      setThread(temp);
      setLoading(false);
      //const answer = document.getElementById('response');
      //answer.innerHtml = temp;
    }

      /*
    async function addFiles(){
       const files = document.getElementById("files");
       let rslt  = await addfiles(files, course);
       if (rslt !== "fail"){
           setAddRslt(true);
       }
    };
    */

    const filesToAdd = () => {
       setAddRslt(false);
       const rslt = document.getElementById("files");
       let tempFiles = [];
       let extension = "";
       let acceptedFiles = ["jpg", "jpeg", "png", "gif", "webp"];
       let goodFiles = true;
       for(let i =0; i < rslt.files.length; i++) {
          // check to see that the file type is correct
          extension = (rslt.files[i].name).split(".").pop();
          if (!(acceptedFiles.includes(extension))){
              let rslt = extension + " is not accepted image type";
              setAddedFiles([rslt]);
              goodFiles = false;
              rslt.value = null;
              break;
          }
          else{
            tempFiles.push(rslt.files[i].name);
          }
       }
       if (goodFiles){
         setAddedFiles(tempFiles);
       }
    }

    //<div id="response" className="response">{resp}</div><br /><br />
  return(
  <div>
    <div className="left">
    <h2 className={aType}>{aType} Assistant</h2>
      <h3> You are logged in as {account} </h3>
    <div className="rightpadding">
    <PacmanLoader
        color={"green"}
        loading={loading}
        cssOverride={override}
        size={40}
        aria-label="Loading!"
        data-testid="loader"
    />
    </div>
    <div className="form">
    <h2>Ask a question:</h2>
    <input type="text" id="question" name="question" defaultValue="Question" /><br /><br />
    <button type="button" className="button" onClick={() => askAssistant()}>
      Ask Question
    </button>
    <h2>Response:</h2>
      <div className="response" dangerouslySetInnerHTML={{ __html: resp}} />
    </div>
    </div>

      <div className="rightpadding">
          <h2>Add Images</h2>
          <br />
          To Change the chosen list of images, re-choose the images
      <br /><br />
      <div className="input_container">
      <label htmlFor="files" className="custom-file-upload">
        Click to select images
      </label>
      <input type="file" className="noinput" name="files" id="files" multiple 
          onChange={filesToAdd}/> 
      </div>
      <br /><br />
      <b>Images added:</b>
      <div>
      {addedFiles.map((file, index) => (<p key={index}>{file}</p>))}
      </div>
      </div>

    <div className="rightpadding">
      <p>
      The assistant remembers past questions.  
      </p>
      <p>
      Start a new conversation if you
      want to start a new line of questioning.
      </p>
    <button type="button" className="round" onClick={() => startThread()}>
      Start a new conversation
    </button>
    <p><b> { thread } </b></p>
    </div>
  </div>
  );
};

export default Assistant;
