import { AuthContext } from "../authContext";
import { useContext } from "react";

// Products
const Assistant = () => {
  const token = useContext(AuthContext);
  return(
  <div>
    <h2>Assistant</h2>
    <p>Authenticated as {token}</p>
    <p>Ask Questions.</p>
  </div>
  );
};

export default Assistant;
