import { React, useState } from "react";
import { Routes, Route, useNavigate} from "react-router-dom";
//import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Navigation from "./pages/Navigation";
import ProtectedRoute from "./pages/Protected";
// import AuthProvider from "./pages/AuthProvider";
import { AuthContext } from "./authContext";
import Assistant from "./pages/Assistant";
import Materials from "./pages/Materials";
import Slides from "./pages/Slides";
import Videos from "./pages/Videos";
import makeAuth from "./doAuth";
// import Blogs from "./pages/Blogs"; 
// import Contact from "./pages/Contact"; 
// import NoPage from "./pages/NoPage"; 

// const AuthContext = createContext(null);

export default function App() {

  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (name, pass) => {
    const newToken = await makeAuth(name, pass);
    if (newToken[0].full_name !== "fail"){
        setToken(newToken[0].full_name);
        navigate('/assistant');
    }
    else{
        setToken();
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
      <AuthContext.Provider value={token}>
       <div className="content">
        <h1> React Rounter Authenticated </h1>
        <Navigation token = {token} onLogout = {handleLogout} />
        <Routes>
          <Route path="/" element={ <Home onLogin={handleLogin}/>  } />
          <Route path="/home" element={ <Home onLogin={handleLogin} /> } />
          <Route path="/materials/" element={<Materials />}>
            <Route path="slides" element={<Slides />} />
            <Route path="videos" element={<Videos />} />
          </Route>
          <Route path="/assistant" element={
              <ProtectedRoute value = {token}>
                <Assistant /> 
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NoMatch />} />
        </Routes>
       </div>
      </ AuthContext.Provider>
  );
}

// Page not found
const NoMatch = () => (
  <>
    <h1>404</h1>
    Page not found.
  </>
  );
