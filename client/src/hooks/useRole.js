import { useState, useEffect } from 'react';

// Cache role globally to prevent refetching
let cachedRole = null;
let rolePromise = null;
let currentUserId = null;

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
      const storedSession = localStorage.getItem('supabase.auth.token');
      
      if (!storedSession) {
        return 'FA';
      }
      
      const sessionData = JSON.parse(storedSession);
      
      if (!sessionData.access_token || sessionData.expires_at <= Date.now() / 1000) {
        localStorage.removeItem('supabase.auth.token');
        return 'FA';
      }
      
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/user/role`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${sessionData.access_token}`
        },
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.role;
      } else {
        return 'FA';
      }
    } catch (error) {
      return 'FA';
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
      'activity-logs': ['Region Head', 'Sys Admin'],
      settings: ['FA', 'BH', 'UH', 'UHA', 'Region Head', 'Sys Admin'],
      profile: ['FA', 'BH', 'UH', 'UHA', 'Region Head', 'Sys Admin']
    };

    const hasPageAccess = hasAccess(pagePermissions[page] || []);
    console.log(`Role check for page '${page}': role='${role}', hasAccess=${hasPageAccess}`);
    return hasPageAccess;
  };

  const clearRoleCache = () => {
    cachedRole = null;
    rolePromise = null;
    currentUserId = null;
  };

  return { role, loading, hasAccess, canAccessPage, clearRoleCache };
};

// Export function to clear cache from outside
export const clearRoleCache = () => {
  cachedRole = null;
  rolePromise = null;
  currentUserId = null;
};