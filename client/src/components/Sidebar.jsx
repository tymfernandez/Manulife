import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  UserCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useRole } from "../hooks/useRole";

const Sidebar = ({
  activeItem,
  setActiveItem,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = () => {},
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isMobile, setIsMobile] = useState(false);
  const { canAccessPage } = useRole();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isMobile]);
  const navigate = useNavigate();

  const allMenuItems = [
    {
      id: "dashboard",
      icon: BarChart3,
      label: "Dashboard",
      path: "/dashboard",
      page: "dashboard",
    },
    {
      id: "recruits",
      icon: UserCheck,
      label: "Recruits",
      path: "/recruitment",
      page: "recruitment",
    },
    {
      id: "accounts",
      icon: Users,
      label: "Accounts",
      path: "/account-management",
      page: "accounts",
    },
    {
      id: "activity-logs",
      icon: Activity,
      label: "Activity Logs",
      path: "/activity-logs",
      page: "accounts",
    },
    {
      id: "profile",
      icon: UserCheck,
      label: "Profile",
      path: "/profile",
      page: "profile",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "/settings",
      page: "settings",
    },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) => canAccessPage(item.page));

  if (isMobile) {
    return (
      <>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside className="fixed left-0 top-0 w-64 bg-emerald-800 text-white h-full z-50 transform transition-transform duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-white">
                      Royal Eagles
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setIsMobileMenuOpen && setIsMobileMenuOpen(false)
                    }
                    className="p-1 rounded hover:bg-emerald-700 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveItem(item.id);
                          navigate(item.path);
                          setIsMobileMenuOpen && setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                          isActive
                            ? "bg-orange-500 text-white"
                            : "text-emerald-100 hover:bg-emerald-700"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          </div>
        )}
      </>
    );
  }

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-emerald-800 text-white h-screen flex-shrink-0 transition-all duration-300 hidden lg:block`}
    >
      <div className="p-6">
        {/* Logo Section - only show when expanded */}
        {!isCollapsed && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <img src="/Light-Logo.png" width={30} height={30} />
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-emerald-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Collapse button when sidebar is collapsed */}
        {isCollapsed && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-emerald-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    setActiveItem(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center ${
                    isCollapsed ? "justify-center px-4" : "space-x-3 px-4"
                  } py-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-emerald-100 hover:bg-emerald-700"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
