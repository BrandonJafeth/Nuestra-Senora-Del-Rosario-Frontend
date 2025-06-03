
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? children : <Navigate to="/session-expired" state={{ from: location }} replace />;
};

export default PrivateRoute;
