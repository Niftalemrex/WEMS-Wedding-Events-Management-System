// src/Vendor/VendorSidebar.tsx
import React, { useState } from "react";
import "./VendorSidebar.css";
import {
  FiGrid,
  FiClipboard,
  FiDollarSign,
  FiCalendar,
  FiPackage,
  FiBarChart2,
  FiUser,
  FiGlobe,
  FiSun,
  FiLogOut,
} from "react-icons/fi";
import type { VendorPage } from "./VendorDashboard";
import { useAppSettings } from "../Contexts/AppSettingsContext";

// ✅ User profile interface
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface VendorSidebarProps {
  activePage: VendorPage;
  setActivePage: React.Dispatch<React.SetStateAction<VendorPage>>;
  userProfile?: UserProfile;
}

const VendorSidebar: React.FC<VendorSidebarProps> = ({
  activePage,
  setActivePage,
  userProfile,
}) => {
  const [expandedSettings, setExpandedSettings] = useState(false);
  const { t } = useAppSettings(); // translation function

  const menuItems = [
    { id: "overview", labelKey: "overview", icon: <FiGrid /> },
    { id: "manage-services", labelKey: "manageServices", icon: <FiPackage /> },
    { id: "assigned-events", labelKey: "assignedEvents", icon: <FiClipboard /> },
    { id: "payments", labelKey: "payments", icon: <FiDollarSign /> },
    { id: "schedule", labelKey: "schedule", icon: <FiCalendar /> },
    { id: "inventory", labelKey: "inventory", icon: <FiPackage /> },
    { id: "reports", labelKey: "reports", icon: <FiBarChart2 /> },
  ];

  const settingsMenuItems = [
    { id: "profile", labelKey: "profile", icon: <FiUser /> },
    { id: "language", labelKey: "language", icon: <FiGlobe /> },
    { id: "appearance", labelKey: "appearance", icon: <FiSun /> },
  ];

  const handleLogout = () => {
    console.log("Vendor logging out...");
    // Add logout logic here
  };

  return (
    <aside className="vendor-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        {userProfile && (
          <div className="profile-card">
            <div className="profile-avatar">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt={userProfile.name} />
              ) : (
                <FiUser />
              )}
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{userProfile.name}</h3>
              <p className="profile-role">{userProfile.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Menu */}
      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activePage === item.id ? "active" : ""}
              onClick={() => setActivePage(item.id as VendorPage)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{t(item.labelKey)}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings Section */}
      <div className="settings-section">
        <div
          className={`settings-toggle ${expandedSettings ? "expanded" : ""}`}
          onClick={() => setExpandedSettings(!expandedSettings)}
        >
          <span className="settings-label">{t("settings")}</span>
        </div>

        {expandedSettings && (
          <ul className="settings-submenu">
            {settingsMenuItems.map((item) => (
              <li
                key={item.id}
                className={activePage === item.id ? "active" : ""}
                onClick={() => setActivePage(item.id as VendorPage)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{t(item.labelKey)}</span>
              </li>
            ))}
            <li className="logout-button" onClick={handleLogout}>
              <FiLogOut className="menu-icon" />
              <span>{t("logout")}</span>
            </li>
          </ul>
        )}
      </div>
    </aside>
  );
};

export default VendorSidebar;
