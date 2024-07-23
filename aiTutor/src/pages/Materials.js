import { Outlet, Link } from "react-router-dom";

// Categories
const Materials = ( {token} ) => {
  //const token = useContext(AuthContext);
  return(
  <div>
    <h2>Categories</h2>
    <p>Authenticated as {token}</p>
    <p>Browse items by category.</p>
    <nav>
      <ul>
        <li>
          <Link to="slides">Slides</Link>
        </li>
        <li>
          <Link to="videos">Videos</Link>
        </li>
      </ul>
    </nav>

    <Outlet />
  </div>
  );
};

export default Materials;
