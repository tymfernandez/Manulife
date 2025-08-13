import { activityLogService } from '../services/activityLogService';

export const logActivity = async (activityType, description, user = null) => {
  try {
    // If no user provided, try to get from localStorage or context
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    }

    if (!user) {
      console.warn('Cannot log activity: No user information available');
      return;
    }

    const logData = {
      user_name: user.name || user.email || 'Unknown User',
      user_role: user.role || 'Unknown Role',
      activity_type: activityType,
      description: description,
      user_id: user.id || null
    };

    await activityLogService.createActivityLog(logData);
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error to avoid breaking the main functionality
  }
};

// Common activity types
export const ACTIVITY_TYPES = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  CREATE: 'Create',
  EDIT: 'Edit',
  DELETE: 'Delete',
  VIEW: 'View',
  EXPORT: 'Export',
  APPROVAL: 'Approval',
  REFERRAL: 'Referral'
};

// Helper functions for common activities
export const logLogin = (user) => logActivity(ACTIVITY_TYPES.LOGIN, 'User logged into the system', user);
export const logLogout = (user) => logActivity(ACTIVITY_TYPES.LOGOUT, 'User logged out of the system', user);
export const logCreate = (entityType, user) => logActivity(ACTIVITY_TYPES.CREATE, `Created new ${entityType}`, user);
export const logEdit = (entityType, entityId, user) => logActivity(ACTIVITY_TYPES.EDIT, `Edited ${entityType} (ID: ${entityId})`, user);
export const logDelete = (entityType, entityId, user) => logActivity(ACTIVITY_TYPES.DELETE, `Deleted ${entityType} (ID: ${entityId})`, user);
export const logView = (entityType, user) => logActivity(ACTIVITY_TYPES.VIEW, `Viewed ${entityType} list`, user);
export const logExport = (entityType, user) => logActivity(ACTIVITY_TYPES.EXPORT, `Exported ${entityType} data`, user);