import { Navigate } from 'react-router-dom';
import isTokenValid from '../utils/TokenHandler';

const AuthProtectedRoute = ({ children }) => {
  return isTokenValid() ? children : <Navigate to="/" />;
};

export default AuthProtectedRoute;
