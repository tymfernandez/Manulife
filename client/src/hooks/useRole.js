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
      const { supabase } = await import('../supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('No session token, defaulting to FA');
        return 'FA';
      }
      
      // Clear cache if different user
      if (currentUserId && currentUserId !== session.user.id) {
        cachedRole = null;
        rolePromise = null;
      }
      currentUserId = session.user.id;
      
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/user/role`;
      console.log('Fetching role from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        credentials: 'include'
      });
      const result = await response.json();
      
      console.log('Role fetch response:', result);
      
      if (result.success) {
        console.log('User role:', result.role);
        return result.role;
      } else {
        console.log('Role fetch failed, defaulting to FA');
        return 'FA';
      }
    } catch (error) {
      console.error('Error fetching role:', error);
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