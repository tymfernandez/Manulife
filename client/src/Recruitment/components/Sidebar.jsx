import {
  FiHome,
  FiUsers,
  FiUser,
  FiFileText,
  FiSettings,
} from "react-icons/fi";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", icon: FiHome, label: "Dashboard" },
    { id: "recruits", icon: FiUsers, label: "Recruits" },
    { id: "users", icon: FiUser, label: "Users" },
    { id: "logs", icon: FiFileText, label: "Logs" },
    { id: "profile", icon: FiUser, label: "Profile" },
    { id: "settings", icon: FiSettings, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-slate-700 text-white h-screen">
      <nav className="pt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center px-6 py-3 cursor-pointer transition-colors ${
                activeTab === item.id
                  ? "bg-green-600 border-r-2 border-green-400"
                  : "hover:bg-slate-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="ml-3 font-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
