import { Navigate } from 'react-router-dom';

//import { useContext } from "react";

const ProtectedRoute = ({ value, children }) => {
  //const token  = useContext(AuthContext);

  if (!value || value.includes("fail")) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
