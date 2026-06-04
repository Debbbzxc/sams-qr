import { Navigate } from 'react-router-dom';
import { getDefaultRouteForRole, getUserFromToken } from '../utils/auth';

const PublicRoute = ({ children }) => {
  const user = getUserFromToken();

  if (user?.role) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return children;
};

export default PublicRoute;
