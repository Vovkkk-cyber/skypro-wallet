import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { usersFromLS } from "../utils/usersFromLS";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(usersFromLS());
  const navigate = useNavigate();

  const updateUserInfo = (userData) => {
    setUser(userData);

    if (userData) {
      localStorage.setItem("userInfo", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userInfo");
    }
  };

  const login = (userLogin) => {
    updateUserInfo(userLogin);
    return true;
  };

  const logout = () => {
    updateUserInfo(null);
    navigate("/");
    return true;
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
