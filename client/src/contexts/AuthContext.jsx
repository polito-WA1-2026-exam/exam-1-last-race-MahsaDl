import { useEffect, useState } from 'react';
import API from '../api/API.js';
import AuthContext from './AuthContextObject.js';

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkCurrentUser() {
      try {
        const currentUser = await API.getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkCurrentUser();
  }, []);

  async function login(username, password) {
    const loggedUser = await API.login(username, password);
    setUser(loggedUser);
    return loggedUser;
  }

  async function logout() {
    await API.logout();
    setUser(null);
  }

  const value = {
    user,
    loggedIn: user !== null,
    checkingAuth,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}



export { AuthProvider };