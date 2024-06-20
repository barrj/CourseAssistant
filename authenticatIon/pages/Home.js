// import { AuthContext } from "../authContext";
// import { useContext } from "react";

const Home = ({onLogin}) => {
    // const token = useContext(AuthContext);
    //console.log("Home, onLogin: " + value.onLogin);
  const auth = () => {
    const val = document.getElementById('account').value; 
    const pass = document.getElementById('pword').value; 
    onLogin(val, pass);
  }

  return (
    <>
      <h2>Home (Public)</h2>

      <div className="form">
        <label htmlFor="account">Account name:</label>
        <input type="text" id="account" name="account" defaultValue="John" /><br /><br />
        <label htmlFor="pword">Password:</label>
        <input type="password" id="pword" name="pword" defaultValue="abc123" /><br /><br />

      <button type="button" onClick={() => auth()}>
        Sign In
      </button>
      </div>
    </>
  );
};
export default Home;
