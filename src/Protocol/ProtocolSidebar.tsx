// src/Protocol/ProtocolSidebar.tsx
import React, { useState } from "react";
import "./ProtocolSidebar.css";
import {
  FiGrid,
  FiClipboard,
  FiCalendar,
  FiCheckSquare,
  FiUsers,
  FiUser,
  FiGlobe,
  FiSun,
  FiLogOut,
} from "react-icons/fi";
import type { ProtocolPage } from "./ProtocolDashboard";
import { useAppSettings } from "../Contexts/AppSettingsContext";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface ProtocolSidebarProps {
  activePage: ProtocolPage;
  setActivePage: React.Dispatch<React.SetStateAction<ProtocolPage>>;
  userProfile: UserProfile;
}

const ProtocolSidebar: React.FC<ProtocolSidebarProps> = ({
  activePage,
  setActivePage,
  userProfile,
}) => {
  const [expandedSettings, setExpandedSettings] = useState(false);
  const { t } = useAppSettings(); // translation function

  const menuItems: { id: ProtocolPage; labelKey: string; icon: React.ReactNode }[] = [
    { id: "overview", labelKey: "overview", icon: <FiGrid /> },
    { id: "assignments", labelKey: "assignments", icon: <FiClipboard /> },
    { id: "agenda", labelKey: "agenda", icon: <FiCalendar /> },
    { id: "event-day-checklist", labelKey: "eventDayChecklist", icon: <FiCheckSquare /> },
    { id: "task-checklist", labelKey: "taskChecklist", icon: <FiCheckSquare /> },
    { id: "manage-events", labelKey: "manageEvents", icon: <FiUsers /> },
  ];

  const settingsMenuItems: { id: ProtocolPage; labelKey: string; icon: React.ReactNode }[] = [
    { id: "profile", labelKey: "profile", icon: <FiUser /> },
    { id: "language", labelKey: "language", icon: <FiGlobe /> },
    { id: "appearance", labelKey: "appearance", icon: <FiSun /> },
  ];

  const handleLogout = () => {
    console.log("Protocol logging out...");
    // implement actual logout logic here
  };

  return (
    <aside className="protocol-sidebar">
      {/* Header */}
      <div className="sidebar-header">
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
      </div>

      {/* Main Menu */}
      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activePage === item.id ? "active" : ""}
              onClick={() => setActivePage(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{t(item.labelKey)}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings */}
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
                onClick={() => setActivePage(item.id)}
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

export default ProtocolSidebar;
