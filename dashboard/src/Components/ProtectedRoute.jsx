import { Navigate } from 'react-router-dom';
import TokenService from '../services/token-service';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = TokenService.getUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
