import { Navigate } from 'react-router-dom';
import { getDefaultRouteForRole, getUserFromToken } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
