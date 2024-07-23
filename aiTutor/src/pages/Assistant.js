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
    

    //setTheA(aType);

    const askAssistant = async () => {
      setLoading(true);
      const quest = document.getElementById('question').value; 
      const temp = await ask(account, aType, quest);
      // console.log("the Assistant received this from doAsk: \n\n" + temp);
      setResp(temp);
      setLoading(false);
      const convers = "Conversation continues!";
      setThread(convers);
      //const answer = document.getElementById('response');
      //answer.innerHtml = temp;
    }

    const startThread = async () => {
      setLoading(true);
      const temp = await newThread(account, aType);
      console.log("the request for a new thread received this from newThread: \n\n" + temp);
      setThread(temp);
      setLoading(false);
      //const answer = document.getElementById('response');
      //answer.innerHtml = temp;
    }

    //<div id="response" className="response">{resp}</div><br /><br />
  return(
  <div>
    <h2 className={aType}>{aType} Assistant</h2>
      <h3> You are logged in as {account} </h3>
    <div className="form">
    <h2>Ask a question:</h2>
    <input type="text" id="question" name="question" defaultValue="Question" /><br /><br />
    <button type="button" className="button" onClick={() => askAssistant()}>
      Ask Question
    </button>
    <div className="right">
    <button type="button" className="round" onClick={() => startThread()}>
      Start a new conversation
    </button>
    <p><b> { thread } </b></p>
    </div>
    <h2>Response:</h2>
      <div className="response" dangerouslySetInnerHTML={{ __html: resp}} />
    </div>
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
  </div>
  );
};

export default Assistant;
