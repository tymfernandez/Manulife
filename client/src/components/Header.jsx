import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, X, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import Avatar from "./Avatar";

const Header = ({
  onMenuClick,
  activeItem,
  setActiveItem,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = () => {},
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("🔍 Fetching user profile for:", user.email);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/profile`, {
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log("📊 Profile API status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("📋 Full profile response:", result);
        console.log("👤 Role from API:", result.data?.role);

        if (result.success && result.data) {
          const profileData = {
            firstName: result.data.first_name || "",
            lastName: result.data.last_name || "",
            email: user?.email || "",
            role: result.data.role || "Sys Admin", // Use actual role or fallback
          };
          
          console.log("✅ Profile data set:", profileData);
          setUserProfile(profileData);
        } else {
          // Fallback with forced role
          const fallbackProfile = {
            firstName: "",
            lastName: "",
            email: user?.email || "",r
          };
          console.log("⚠️ Using fallback profile:", fallbackProfile);
          setUserProfile(fallbackProfile);
        }
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        // Fallback with forced role
        const errorProfile = {
          firstName: "",
          lastName: "",
          email: user?.email || "",
          role: "Sys Admin", // FORCE Sys Admin role
        };
        console.log("🔧 Using error fallback profile:", errorProfile);
        setUserProfile(errorProfile);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Check if user can view notifications (BH or Sys Admin)
  const canViewNotifications = userProfile.role === "BH" || userProfile.role === "Sys Admin";

  // Fetch notifications function with enhanced debugging
  const fetchNotifications = async () => {
    console.log("📡 Starting fetchNotifications...");
    
    try {
      console.log("🌐 Making request to activity-logs API...");
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/activity-logs`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("📊 Activity logs API response:");
      console.log("  - Status:", response.status);
      console.log("  - Status Text:", response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("📋 Raw activity logs response:", result);
      console.log("  - Success:", result.success);
      console.log("  - Data type:", typeof result.data);
      console.log("  - Data is array:", Array.isArray(result.data));
      console.log("  - Data length:", result.data?.length || 0);

      if (result.success && result.data && Array.isArray(result.data)) {
        console.log("🔄 Processing", result.data.length, "activity logs...");
        
        // Log first few items to see structure
        if (result.data.length > 0) {
          console.log("📝 Sample activity log structure:");
          console.log("  - First item:", result.data[0]);
          console.log("  - Keys:", Object.keys(result.data[0]));
        }

        const notificationsData = result.data.map((log, index) => {
          console.log(`🔧 Processing log ${index + 1}:`, log);
          
          try {
            const notification = {
              id: log.id || `temp-${index}`,
              title: getNotificationTitle(log.action, log.resource_type),
              message: getNotificationMessage(log),
              time: getTimeAgo(log.created_at),
              timestamp: log.created_at,
              unread: true,
              type: getNotificationType(log.action),
              userId: log.user_id,
              userName: log.user_name,
              action: log.action,
              resourceType: log.resource_type,
              details: log.details
            };
            
            console.log(`✅ Processed notification ${index + 1}:`, notification);
            return notification;
          } catch (error) {
            console.error(`❌ Error processing log ${index + 1}:`, error, log);
            // Return a fallback notification
            return {
              id: log.id || `error-${index}`,
              title: 'System Activity',
              message: `Activity by ${log.user_name || 'Unknown user'}`,
              time: getTimeAgo(log.created_at),
              timestamp: log.created_at,
              unread: true,
              type: 'info',
              userId: log.user_id,
              userName: log.user_name,
              action: log.action || 'UNKNOWN',
              resourceType: log.resource_type || 'unknown',
              details: log.details
            };
          }
        }).filter(Boolean); // Remove any null/undefined items

        // Sort by timestamp (newest first)
        notificationsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentNotifications = notificationsData.slice(0, 20);
        
        console.log("🎯 Final processed notifications:");
        console.log("  - Total processed:", notificationsData.length);
        console.log("  - Recent (showing):", recentNotifications.length);
        console.log("  - Sample titles:", recentNotifications.slice(0, 3).map(n => n.title));
        
        setNotifications(recentNotifications);
        setUnreadCount(recentNotifications.length);
        
        console.log("✅ Notifications state updated!");
        console.log("  - Notifications count:", recentNotifications.length);
        console.log("  - Unread count:", recentNotifications.length);
        
      } else {
        console.log("⚠️ Invalid response format:");
        console.log("  - Success:", result.success);
        console.log("  - Data exists:", !!result.data);
        console.log("  - Data is array:", Array.isArray(result.data));
        
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      console.error('  - Message:', error.message);
      
      // Set empty state on error
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // Fetch notifications when role changes to BH or Sys Admin
  useEffect(() => {
    console.log("🔄 Role check effect triggered:");
    console.log("  - Current role:", userProfile.role);
    console.log("  - Can view notifications:", canViewNotifications);
    console.log("  - User object:", user);
    
    if (canViewNotifications && user) {
      console.log("🚀 Fetching notifications for role:", userProfile.role);
      fetchNotifications();
      
      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(() => {
        console.log("⏰ Auto-fetching notifications (30s interval)");
        fetchNotifications();
      }, 30000);
      
      return () => {
        console.log("🧹 Cleaning up notification interval");
        clearInterval(interval);
      };
    } else {
      console.log("❌ Cannot view notifications - clearing state");
      console.log("  - Role:", userProfile.role);
      console.log("  - User exists:", !!user);
      // Clear notifications if user doesn't have permission
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [userProfile.role, user]); // Added user as dependency

  // Enhanced notification helper functions with debugging
  const getNotificationTitle = (action, resourceType) => {
    console.log(`🏷️ Getting title for action: "${action}", resource: "${resourceType}"`);
    
    const actionMap = {
      'CREATE': {
        'user_profiles': 'New User Account Created',
        'users': 'New User Registration',
        'applications': 'New Application Submitted',
        'requirements': 'New Requirement Added',
        'documents': 'New Document Uploaded',
        'scholarships': 'New Scholarship Created',
        'announcements': 'New Announcement Posted',
        'default': 'New Item Created'
      },
      'UPDATE': {
        'user_profiles': 'User Profile Updated',
        'users': 'User Information Updated',
        'applications': 'Application Status Changed',
        'requirements': 'Requirement Modified',
        'documents': 'Document Updated',
        'scholarships': 'Scholarship Updated',
        'announcements': 'Announcement Modified',
        'default': 'Item Updated'
      },
      'DELETE': {
        'user_profiles': 'User Account Deleted',
        'users': 'User Removed',
        'applications': 'Application Deleted',
        'requirements': 'Requirement Removed',
        'documents': 'Document Deleted',
        'scholarships': 'Scholarship Removed',
        'announcements': 'Announcement Deleted',
        'default': 'Item Deleted'
      },
      'LOGIN': {
        'default': 'User Login Activity'
      },
      'LOGOUT': {
        'default': 'User Logout Activity'
      },
      'APPROVE': {
        'applications': 'Application Approved',
        'requirements': 'Requirement Approved',
        'documents': 'Document Approved',
        'default': 'Item Approved'
      },
      'REJECT': {
        'applications': 'Application Rejected',
        'requirements': 'Requirement Rejected',
        'documents': 'Document Rejected',
        'default': 'Item Rejected'
      },
      'SUBMIT': {
        'applications': 'Application Submitted',
        'requirements': 'Requirement Submitted',
        'documents': 'Document Submitted',
        'default': 'Item Submitted'
      }
    };

    const actionGroup = actionMap[action];
    let title;
    
    if (actionGroup) {
      title = actionGroup[resourceType] || actionGroup['default'];
    } else {
      title = 'System Activity';
    }
    
    console.log(`📝 Generated title: "${title}"`);
    return title;
  };

  const getNotificationMessage = (log) => {
    const { action, resource_type, user_name, details } = log;
    console.log(`💬 Getting message for:`, { action, resource_type, user_name });
    
    // Safe function to handle resource_type formatting
    const formatResourceType = (resourceType) => {
      if (!resourceType) return 'item';
      return resourceType.replace('_', ' ');
    };
    
    let message;
    
    // Enhanced message generation based on action and resource type
    switch (action) {
      case 'CREATE':
        switch (resource_type) {
          case 'user_profiles':
          case 'users':
            message = `${user_name || 'Someone'} created a new user account`;
            break;
          case 'applications':
            message = `New scholarship application submitted${user_name ? ` by ${user_name}` : ''}`;
            break;
          case 'requirements':
            message = `${user_name || 'Someone'} added a new requirement`;
            break;
          case 'documents':
            message = `${user_name || 'Someone'} uploaded a new document`;
            break;
          case 'scholarships':
            message = `${user_name || 'Someone'} created a new scholarship program`;
            break;
          case 'announcements':
            message = `${user_name || 'Someone'} posted a new announcement`;
            break;
          default:
            message = `${user_name || 'Someone'} created a new ${formatResourceType(resource_type)}`;
        }
        break;
      
      case 'UPDATE':
        switch (resource_type) {
          case 'applications':
            message = `${user_name || 'Someone'} updated application status or information`;
            break;
          case 'user_profiles':
            message = `${user_name || 'Someone'} updated their profile information`;
            break;
          case 'scholarships':
            message = `${user_name || 'Someone'} modified scholarship details`;
            break;
          case 'requirements':
            message = `${user_name || 'Someone'} updated requirement information`;
            break;
          default:
            message = `${user_name || 'Someone'} updated ${formatResourceType(resource_type)}`;
        }
        break;
      
      case 'DELETE':
        message = `${user_name || 'Someone'} deleted ${formatResourceType(resource_type)}`;
        break;
      
      case 'LOGIN':
        message = `${user_name || 'Someone'} logged into the system`;
        break;
      
      case 'LOGOUT':
        message = `${user_name || 'Someone'} logged out of the system`;
        break;
      
      case 'APPROVE':
        switch (resource_type) {
          case 'applications':
            message = `${user_name || 'Someone'} approved an application`;
            break;
          case 'requirements':
            message = `${user_name || 'Someone'} approved a requirement`;
            break;
          default:
            message = `${user_name || 'Someone'} approved ${formatResourceType(resource_type)}`;
        }
        break;
      
      case 'REJECT':
        switch (resource_type) {
          case 'applications':
            message = `${user_name || 'Someone'} rejected an application`;
            break;
          case 'requirements':
            message = `${user_name || 'Someone'} rejected a requirement`;
            break;
          default:
            message = `${user_name || 'Someone'} rejected ${formatResourceType(resource_type)}`;
        }
        break;
      
      case 'SUBMIT':
        switch (resource_type) {
          case 'applications':
            message = `${user_name || 'Someone'} submitted an application for review`;
            break;
          case 'documents':
            message = `${user_name || 'Someone'} submitted documents for verification`;
            break;
          default:
            message = `${user_name || 'Someone'} submitted ${formatResourceType(resource_type)}`;
        }
        break;
      
      default:
        message = `${action || 'Action'} performed by ${user_name || 'someone'} on ${formatResourceType(resource_type)}`;
    }
    
    console.log(`📨 Generated message: "${message}"`);
    return message;
  };

  const getNotificationType = (action) => {
    const typeMap = {
      'CREATE': 'success',
      'UPDATE': 'info',
      'DELETE': 'warning',
      'LOGIN': 'info',
      'LOGOUT': 'info',
      'APPROVE': 'success',
      'REJECT': 'warning',
      'SUBMIT': 'info'
    };
    return typeMap[action] || 'info';
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      'success': 'bg-green-500',
      'info': 'bg-blue-500',
      'warning': 'bg-yellow-500',
      'error': 'bg-red-500'
    };
    return colorMap[type] || 'bg-blue-500';
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    // Mark all notifications as read
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
    // Set unread count to 0
    setUnreadCount(0);
    console.log("✅ All notifications marked as read");
  };

  // Enhanced sign out function with proper error handling
  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    try {
      setIsSigningOut(true);
      console.log("🔐 Starting sign out process...");
      
      // Close dropdowns first
      setIsProfileOpen(false);
      setIsNotificationOpen(false);
      
      // Call the auth context signOut function
      console.log("📡 Calling signOut function...");
      await signOut();
      
      console.log("✅ Sign out successful, navigating to signin...");
      
      // Clear any local state
      setUserProfile({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
      });
      setNotifications([]);
      setUnreadCount(0);
      
      // Navigate to signin page
      navigate("/signin", { replace: true });
      
    } catch (error) {
      console.error("❌ Error during sign out:", error);
      
      // Even if signOut fails, still navigate to signin for security
      console.log("🔄 Force navigating to signin despite error...");
      navigate("/signin", { replace: true });
      
      // Force reload to clear any cached state
      window.location.href = "/signin";
      
    } finally {
      setIsSigningOut(false);
    }
  };

  // Debug logging when state changes
  useEffect(() => {
    console.log("🔔 Notifications state changed:");
    console.log("  - Count:", notifications.length);
    console.log("  - Unread:", unreadCount);
    console.log("  - Sample:", notifications.slice(0, 2));
  }, [notifications, unreadCount]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-2 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setIsMobileMenuOpen && setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden relative z-50"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <div className="flex items-center space-x-3">
            <img src="/Dark-Logo-Name.png" width={120} height={100} alt="Logo" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications - Only for BH and Sys Admin */}
          {canViewNotifications && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  console.log("🔔 Notification bell clicked");
                  console.log("  - Current notifications:", notifications.length);
                  console.log("  - Unread count:", unreadCount);
                  setIsNotificationOpen(!isNotificationOpen);
                }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </div>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        Notifications {unreadCount > 0 && `(${unreadCount})`}
                      </h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="font-medium">No notifications yet</p>
                        <p className="text-xs mt-1">Activity logs will appear here when users perform actions</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            notification.unread ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            if (notification.unread) {
                              markAsRead(notification.id);
                            }
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notification.unread 
                                  ? getNotificationColor(notification.type)
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 text-sm">
                                {notification.title}
                              </div>
                              <div className="text-sm text-gray-600 mt-1 break-words">
                                {notification.message}
                              </div>
                              <div className="text-xs text-gray-400 mt-2 flex items-center justify-between">
                                <span>{notification.time}</span>
                                {notification.userName && (
                                  <span className="text-emerald-600 font-medium">
                                    {notification.userName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        setActiveItem('reports');
                        navigate('/activity-logs');
                        setIsNotificationOpen(false);
                      }}
                      className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                    >
                      View all activity logs →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Avatar
                name={
                  userProfile.firstName && userProfile.lastName
                    ? `${userProfile.firstName} ${userProfile.lastName}`
                    : userProfile.email?.split("@")[0] || "User"
                }
                className="w-8 h-8"
              />
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      name={
                        userProfile.firstName && userProfile.lastName
                          ? `${userProfile.firstName} ${userProfile.lastName}`
                          : userProfile.email?.split("@")[0] || "User"
                      }
                      className="w-12 h-12"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {userProfile.firstName && userProfile.lastName
                          ? `${userProfile.firstName} ${userProfile.lastName}`
                          : userProfile.email?.split("@")[0] || "User"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {userProfile.email}
                      </div>
                      <div className="text-xs text-emerald-600 mt-1">
                        Role: {userProfile.role || "Loading..."}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Settings</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-red-600 ${
                      isSigningOut ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;