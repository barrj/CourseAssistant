import { useState, useEffect} from "react";
//import { useState, useContext, useEffect} from "react";
//import { AuthContext } from "../authContext";
import getProfile from "../utilities/doProfile";
import updateProfile from "../utilities/doUpdate";

// Categories
const Profile = ( {token} ) => {
  // const [ptoken, setPtoken]  = useState(useContext(AuthContext));
  //const [ptoken, setPtoken]  = useState(token);
  const [data, setData] = useState({});
  const [invalidN, setInvalidN] = useState(false);
  const [invalidE, setInvalidE] = useState(false);
  const [invalidGY, setInvalidGY] = useState(false);
  const [invalidG, setInvalidG] = useState(false);
  const [invalidM, setInvalidM] = useState(false);
  const [invalidY, setInvalidY] = useState(false);
  const [invalidW, setInvalidW] = useState(false);
  const [invalidL, setInvalidL] = useState(false);
  const [success, setSuccess] = useState(false);

  const reSet = () =>{
    setInvalidN(false);
    setInvalidE(false);
    setInvalidGY(false);
    setInvalidG(false);
    setInvalidM(false);
    setInvalidY(false);
    setInvalidW(false);
    setInvalidL(false);
    setSuccess(false);
  }

  const update = () => {
    let newProfile = {
          name: document.getElementById('name').value, 
          //account: document.getElementById('account').value, 
          account: data.account,
          email: document.getElementById('email').value, 
          gender: document.getElementById('gender').value, 
          major: document.getElementById('major').value, 
          year: document.getElementById('year').value, 
          grad: document.getElementById('gradyear').value, 
          web: document.getElementById('web').value, 
          linkedin: document.getElementById('linkedin').value, 
    }
    if (newProfile.web === ""){
        newProfile.web = "http://none";
    }
    if (newProfile.linkedin === ""){
        newProfile.linkedin = "https://linkedin.com/none";
    }
    /* This is a regular expression that matches if a string */
    /* is NOT a lower/upper case letter or a number */
    const validLett = /^[a-zA-Z" "]+$/;
    const validBoth = /^[a-zA-Z0-9]+$/;
    const validEmail = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
    const validLink = /^https:\/\/linkedin\.com\/[a-zA-Z0-9]+$/;
    const validWeb = /^https?:\/\/[a-zA-Z0-9./]+$/;
    reSet();
    if (!validLett.test(newProfile.name)){
        setInvalidN(true);
        console.log("Found invalid name or account");
    }
    else if (!validLett.test(newProfile.major)){
        setInvalidM(true);
        console.log("Found invalid major");
    }
    else if (!validLett.test(newProfile.gender) && newProfile.gender !== "") {
        setInvalidG(true);
        console.log("Found invalid gender ");
    }
    else if (!validBoth.test(newProfile.year)){
        setInvalidY(true);
        console.log("Found invalid year");
    }
    else if (!validBoth.test(newProfile.gradyear)){
        setInvalidGY(true);
        console.log("Found invalid grad year ");
    }
    else if (!validEmail.test(newProfile.email)){
        setInvalidE(true);
        console.log("Found invalid age ");
    }
    else if (!validWeb.test(newProfile.web) && newProfile.web !== ""){
        setInvalidW(true);
        console.log("Found invalid age ");
    }
    else if (!validLink.test(newProfile.linkedin) && newProfile.linkedin !== ""){
        setInvalidL(true);
        console.log("Found invalid age ");
    }
    else{
      let rslt = updateProfile(newProfile);
      if (rslt){
        setSuccess(true);
      }
    }
  }

  useEffect( () => {
    var pdata;
    setInvalidN(false);
    setInvalidE(false);
    setInvalidGY(false);
    setInvalidG(false);
    setInvalidM(false);
    setInvalidY(false);
    setInvalidW(false);
    setInvalidL(false);
    async function getData(){
       pdata  = await getProfile(token);
       setData(pdata[0]);
    };
    getData();
  }, []);


  return(
  <div>
    <h2>Profile</h2>
    <p>Authenticated as {token}</p>
    <label htmlFor="name">Name:</label>
    <input type="text" id="name" name="name" defaultValue={data.full_name} /><br /><br />
      {invalidN && (
        <p> Bad Name entered. </p>
      )}

    <label htmlFor="email">email:</label>
    <input type="text" id="email" name="email" defaultValue={data.email} /><br /><br />
      {invalidE && (
        <p> Bad email address entered. </p>
      )}

    <label htmlFor="account">Account:</label>
    <input type="text" id="account" name="account" defaultValue={data.account} readOnly /><br /><br />

    <label htmlFor="gradyear">Graduation Year:</label>
    <input type="text" id="gradyear" name="gradyear" defaultValue={data.grad_year} /><br /><br />
      {invalidGY && (
        <p> Bad Graduation Year entered. </p>
      )}
    <label htmlFor="major">Major:</label>
    <input type="text" id="major" name="major" defaultValue={data.major} /><br /><br />
      {invalidM && (
        <p> Bad Major entered. </p>
      )}
    <label htmlFor="year">Year:</label>
    <input type="text" id="year" name="year" defaultValue={data.year} /><br /><br />
      {invalidY && (
        <p> Bad Year entered. </p>
      )}
    <label htmlFor="gender">Gender:</label>
    <input type="text" id="gender" name="gender" defaultValue={data.gender} /><br /><br />
      {invalidG && (
        <p> Bad Gender entered. </p>
      )}
    <label htmlFor="web">Web Page:</label>
    <input type="text" id="web" name="web" defaultValue={data.web_page} /><br /><br />
      {invalidW && (
        <p> Bad Web Page entered. </p>
      )}
    <label htmlFor="linkedin">Linkedin Page:</label>
    <input type="text" id="linkedin" name="linkedin" defaultValue={data.linkedin} /><br /><br />
      {invalidL && (
        <p> Bad Linkedin Page entered. </p>
      )}

      <button type="button" onClick={() => update()}>
        Update Profile
      </button>
      {success && (
        <p> Profile successfully updated. </p>
      )}
  </div>
  );
};

export default Profile;
