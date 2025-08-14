import { activityLogService } from '../services/activityLogService';

export const logActivity = async (activityType, description, user = null, userProfile = null) => {
  try {
    if (!user) {
      console.warn('Cannot log activity: No user information available');
      return;
    }

    // Build user name from profile or fallback to email
    const userName = userProfile 
      ? `${userProfile.firstName} ${userProfile.lastName}`.trim() || user.email
      : user.email || 'Unknown User';

    const logData = {
      user_id: user.id,
      user_name: userName,
      user_role: userProfile?.role || user.role || 'User',
      activity_type: activityType,
      description: description
    };

    await activityLogService.createActivityLog(logData);
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error to avoid breaking the main functionality
  }
};

// Activity types for significant actions only
export const ACTIVITY_TYPES = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  CREATE: 'Create',
  EDIT: 'Edit',
  DELETE: 'Delete',
  EXPORT: 'Export',
  APPROVAL: 'Approval',
  REFERRAL: 'Referral'
};

// Helper functions for significant activities only
export const logLogin = (user, userProfile) => logActivity(ACTIVITY_TYPES.LOGIN, 'User logged into the system', user, userProfile);
export const logLogout = (user, userProfile) => logActivity(ACTIVITY_TYPES.LOGOUT, 'User logged out of the system', user, userProfile);
export const logCreate = (entityType, entityName, user, userProfile) => logActivity(ACTIVITY_TYPES.CREATE, `Created ${entityType}: ${entityName}`, user, userProfile);
export const logEdit = (entityType, entityName, user, userProfile) => logActivity(ACTIVITY_TYPES.EDIT, `Updated ${entityType}: ${entityName}`, user, userProfile);
export const logDelete = (entityType, entityName, user, userProfile) => logActivity(ACTIVITY_TYPES.DELETE, `Deleted ${entityType}: ${entityName}`, user, userProfile);
export const logExport = (entityType, user, userProfile) => logActivity(ACTIVITY_TYPES.EXPORT, `Exported ${entityType} data`, user, userProfile);
export const logApproval = (entityType, entityName, status, user, userProfile) => logActivity(ACTIVITY_TYPES.APPROVAL, `${status} ${entityType}: ${entityName}`, user, userProfile);
export const logReferral = (referralCode, user, userProfile) => logActivity(ACTIVITY_TYPES.REFERRAL, `Used referral code: ${referralCode}`, user, userProfile);