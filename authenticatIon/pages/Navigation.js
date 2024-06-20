import { NavLink } from "react-router-dom";
//import { useContext } from "react";
//import AuthContext from "../doAuth";

const Navigation = ({token, onLogout}) => {
    //const token = useContext(AuthContext);
    //const onLogout = useContext(AuthContext);
  return (
    <nav className="nav">
      <ul>
        <li> <NavLink to="/home">Home</NavLink> </li>
        <li> <NavLink to="/materials">Materials</NavLink> </li>
        <li> <NavLink to="/assistant">Assistant</NavLink> </li>
      {token && (
        <button type="button" onClick={onLogout}>
          Sign Out
        </button>
      )}
      </ul>
    </nav>
  );
};

export default Navigation;
