import { useRole } from '../hooks/useRole';

const RoleGuard = ({ children, requiredRoles, fallback = null }) => {
  const { hasAccess, loading } = useRole();

  if (loading) {
    return <div className="flex justify-center items-center p-4">Loading...</div>;
  }

  if (!hasAccess(requiredRoles)) {
    return fallback || (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500">You don't have permission to view this content.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleGuard;