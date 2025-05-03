import  { createContext, useState, useContext } from 'react';

import Auth from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(Auth.loggedIn());

  const login = (token) => {
    Auth.login(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Auth.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);