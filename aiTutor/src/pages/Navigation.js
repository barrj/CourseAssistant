import { NavLink } from "react-router-dom";

const Navigation = ({token, onLogout}) => {
  return (
    <nav className="nav">
      <ul>
        <li> <NavLink to="/home">Home</NavLink> </li>
        <li> <NavLink to="/materials">Materials</NavLink> </li>
        <li> <NavLink to="/assistant1">COMP 171 Assistant</NavLink> </li>
        <li> <NavLink to="/assistant2">COMP 210 Assistant</NavLink> </li>
        <li> <NavLink to="/profile">Profile</NavLink> </li>
        <li> <NavLink to="/edit171">Edit COMP 171</NavLink> </li>
      {token && token !== "fail" && (
        <button type="button" onClick={onLogout}>
          Sign Out
        </button>
      )}
      </ul>
    </nav>
  );
};

export default Navigation;
