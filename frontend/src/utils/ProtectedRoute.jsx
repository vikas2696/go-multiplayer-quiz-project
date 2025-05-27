import { Navigate } from 'react-router-dom';
import isTokenValid from './TokenHandler';

const ProtectedRoute = ({ children }) => {
  return isTokenValid() ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
