import React, { useState } from "react";
import SideBar from "../components/Sidebar";
import Header from "../components/Header";
import UserAccount from "./Components/userAccount";
import HelpSupport from "./Components/helpSupport";

const SettingsPage = () => {
  const [activeItem, setActiveItem] = useState("settings");
  const tabs = ["User Account", "Support & Help"];
  const [activeTab, setActiveTab] = useState("User Account");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SideBar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col">
        <Header activeItem={activeItem} setActiveItem={setActiveItem} />
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Top Header */}
          <div className="flex items-center justify-between p-6 ">
            <h1 className="text-3xl font-bold text-green-800text-3xl font-bold text-emerald-800">
              SETTINGS
            </h1>
          </div>

          {/* Settings Content */}
          <div className="px-6">
            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content Based on Active Tab */}
            {activeTab === "User Account" && <UserAccount />}
            {activeTab === "Data & Exports" && <DataExports />}
            {activeTab === "Support & Help" && <HelpSupport />}
          </div>
        </div>

        <style>{`
          .toggle-checkbox:checked {
            right: 0;
            border-color: #10b981;
            background-color: #10b981;
          }
          .toggle-checkbox {
            transition: all 0.3s ease;
            top: 0;
            left: 0;
          }
          .toggle-label {
            transition: all 0.3s ease;
          }
          .toggle-checkbox:checked + .toggle-label {
            background-color: #10b981;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SettingsPage;
