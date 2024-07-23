import { useState } from "react";
import fakeAuth from "../doAuth";
import { AuthContext } from "../authContext";
var CryptoJS = require("crypto-js");

// export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    /* ********************* Test encryption ***************/
      // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'my-secret-key@123').toString();
    //log encrypted data
    console.log('Encrypt Data -')
    console.log(ciphertext);

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'my-secret-key@123');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    //log decrypted Data
    console.log('decrypted Data -')
    console.log(decryptedData);

    /* ********************* Test encryption ***************/

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
