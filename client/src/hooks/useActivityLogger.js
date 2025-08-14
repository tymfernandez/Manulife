import { useAuth } from '../lib/authContext';
import { logActivity, ACTIVITY_TYPES } from '../utils/activityLogger';
import { useState, useEffect } from 'react';

export const useActivityLogger = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const response = await fetch("http://localhost:3000/api/auth/profile", {
          credentials: "include",
        });
        const result = await response.json();

        if (result.success && result.data) {
          setUserProfile({
            firstName: result.data.first_name || "",
            lastName: result.data.last_name || "",
            role: result.data.role || "User",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const log = (activityType, description) => {
    if (user) {
      logActivity(activityType, description, user, userProfile);
    }
  };

  return {
    log,
    logCreate: (entityType, entityName) => log(ACTIVITY_TYPES.CREATE, `Created ${entityType}: ${entityName}`),
    logEdit: (entityType, entityName) => log(ACTIVITY_TYPES.EDIT, `Updated ${entityType}: ${entityName}`),
    logDelete: (entityType, entityName) => log(ACTIVITY_TYPES.DELETE, `Deleted ${entityType}: ${entityName}`),
    logExport: (entityType) => log(ACTIVITY_TYPES.EXPORT, `Exported ${entityType} data`),
    logApproval: (entityType, entityName, status) => log(ACTIVITY_TYPES.APPROVAL, `${status} ${entityType}: ${entityName}`),
    logReferral: (referralCode) => log(ACTIVITY_TYPES.REFERRAL, `Used referral code: ${referralCode}`),
    user,
    userProfile
  };
};