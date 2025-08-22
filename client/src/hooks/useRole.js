import { useState, useEffect } from 'react';

// Cache role globally to prevent refetching
let cachedRole = null;
let rolePromise = null;

export const useRole = () => {
  const [role, setRole] = useState(cachedRole);
  const [loading, setLoading] = useState(!cachedRole);

  useEffect(() => {
    // If role is already cached, use it immediately
    if (cachedRole) {
      setRole(cachedRole);
      setLoading(false);
      return;
    }

    // If already fetching, wait for existing promise
    if (rolePromise) {
      rolePromise.then((fetchedRole) => {
        setRole(fetchedRole);
        setLoading(false);
      });
      return;
    }

    // Start new fetch
    rolePromise = fetchRole();
    rolePromise.then((fetchedRole) => {
      cachedRole = fetchedRole;
      setRole(fetchedRole);
      setLoading(false);
    });
  }, []);

  const fetchRole = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/role', {
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) {
        return result.role;
      } else {
        return 'FA'; // Default fallback
      }
    } catch (error) {
      console.error('Error fetching role:', error);
      return 'FA'; // Default fallback
    }
  };

  const hasAccess = (requiredRoles) => {
    if (loading && !cachedRole) return false; // Only block if no cached role
    if (!role) return false;
    if (role === 'Sys Admin') return true;
    return requiredRoles.includes(role);
  };

  const canAccessPage = (page) => {
    if (loading && !cachedRole) return false; // Only block if no cached role
    
    const pagePermissions = {
      dashboard: ['FA', 'BH', 'UH', 'UHA', 'Region Head', 'Sys Admin'],
      recruitment: ['BH', 'UH', 'UHA', 'Region Head', 'Sys Admin'],
      accounts: ['Region Head', 'Sys Admin'],
      settings: ['FA', 'BH', 'UH', 'UHA', 'Region Head', 'Sys Admin'],
      profile: ['FA', 'BH', 'UH', 'UHA', 'Region Head', 'Sys Admin']
    };

    return hasAccess(pagePermissions[page] || []);
  };

  return { role, loading, hasAccess, canAccessPage };
};