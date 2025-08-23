import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

const ProtectedRoute = ({ children, requiredRoles, redirectTo = '/dashboard' }) => {
  const { hasAccess, loading } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!hasAccess(requiredRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;