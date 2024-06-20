import { useState } from "react";
import fakeAuth from "../doAuth";
import { AuthContext } from "../authContext";

// export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    const token = await fakeAuth();

    setToken(token);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
      auth: token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

    console.log("AuthProvider, value.auth: " + value.auth);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
