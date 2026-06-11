import { Navigate } from 'react-router';
//import { useAuth } from '../contexts/AuthContext.jsx';
import useAuth from '../hooks/useAuth.js';

function ProtectedRoute({ children }) {
  const { loggedIn, checkingAuth } = useAuth();

  if (checkingAuth) {
    return <p>Loading...</p>;
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;