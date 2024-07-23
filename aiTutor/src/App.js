import { React, useState } from "react";
import { Routes, Route, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Navigation from "./pages/Navigation";
import ProtectedRoute from "./pages/Protected";
import Assistant from "./pages/Assistant";
import Materials from "./pages/Materials";
import Slides from "./pages/Slides";
import Videos from "./pages/Videos";
import Profile from "./pages/Profile";
import Edit from "./pages/Edit";
import makeAuth from "./utilities/doAuth";

export default function App() {

  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (name, pass) => {
    /* This is a regular expression that matches if a string */
    /* is NOT a lower/upper case letter or a number */
    const validLett = /^[a-zA-Z0-9]+$/;

    if (!validLett.test(name)){
        setToken("fail"); // there is a character that is NOT a-zA-Z0-9 in the name
    }
    else if (!validLett.test(pass)){
        setToken("fail"); //there is a character that is NOT a-zA-Z0-9 in the password
    }
    else{
      const newToken = await makeAuth(name, pass);
      if (newToken[0].full_name !== "fail"){
        setToken(newToken[0].account);
        navigate('/assistant1');
      }
      else{
        setToken("fail");
      }
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
       <div className="content">
        <h1> Computer Science AI Assistant</h1>
        <Navigation token = {token} onLogout = {handleLogout} />
        <Routes>
          <Route path="/" element={ <Home token = {token} onLogin={handleLogin}/>  } />
          <Route path="/home" element={ <Home token = {token} onLogin={handleLogin} /> } />
          <Route path="/materials/" element={<Materials token = {token} />}>
            <Route path="slides" element={<Slides />} />
            <Route path="videos" element={<Videos />} />
          </Route>
          <Route path="/assistant1" element={
              <ProtectedRoute value = {token}>
                <Assistant account={token} aType={"COMP171"} /> 
              </ProtectedRoute>
            }
          />
          <Route path="/assistant2" element={
              <ProtectedRoute value = {token}>
                <Assistant account={token} aType={"COMP210"} /> 
              </ProtectedRoute>
            }
          />
          <Route path="/profile" token = { token } element={
              <ProtectedRoute value = {token}>
                <Profile token = { token }/> 
              </ProtectedRoute>
            }
          />
          <Route path="/edit171" token = { token } element={
              <ProtectedRoute value = {token}>
                <Edit account = {token} course = {"COMP171"} /> 
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NoMatch />} />
        </Routes>
       </div>
  );
}

// Page not found
const NoMatch = () => (
  <>
    <h1>404</h1>
    Page not found.
  </>
  );
