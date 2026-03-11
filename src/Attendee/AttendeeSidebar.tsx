// src/Attendee/AttendeeSidebar.tsx
import React, { useState } from "react";
import "./AttendeeSidebar.css";
import {
  FiGrid,
  FiCalendar,
  FiClock,
  FiCheckSquare,
  FiUsers,
  FiGift,
  FiUser,
  FiGlobe,
  FiSun,
  FiLogOut,
} from "react-icons/fi";
import type { AttendeePage } from "./AttendeeDashboard";
import { useAppSettings } from "../Contexts/AppSettingsContext";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface AttendeeSidebarProps {
  activePage: AttendeePage;
  setActivePage: React.Dispatch<React.SetStateAction<AttendeePage>>;
  userProfile: UserProfile;
}

const AttendeeSidebar: React.FC<AttendeeSidebarProps> = ({
  activePage,
  setActivePage,
  userProfile,
}) => {
  const [expandedSettings, setExpandedSettings] = useState(false);
  const { t } = useAppSettings(); // translation function

  const mainMenuItems: { id: AttendeePage; labelKey: string; icon: React.ReactNode }[] = [
    { id: "overview", labelKey: "overview", icon: <FiGrid /> },
    { id: "event-info", labelKey: "eventInfo", icon: <FiCalendar /> },
    { id: "schedule", labelKey: "schedule", icon: <FiClock /> },
    { id: "rsvp", labelKey: "rsvp", icon: <FiCheckSquare /> },
    { id: "seat-info", labelKey: "seatInfo", icon: <FiUsers /> },
    { id: "gift-registry", labelKey: "giftRegistry", icon: <FiGift /> },
  ];

  const settingsMenuItems: { id: AttendeePage; labelKey: string; icon: React.ReactNode }[] = [
    { id: "profile", labelKey: "profile", icon: <FiUser /> },
    { id: "language", labelKey: "language", icon: <FiGlobe /> },
    { id: "appearance", labelKey: "appearance", icon: <FiSun /> },
  ];

  const handleLogout = () => {
    console.log("Attendee logging out...");
    // implement actual logout logic here
  };

  const handleSettingClick = (id: AttendeePage) => {
    setActivePage(id);
  };

  return (
    <aside className="attendee-sidebar">
      {/* Profile Header */}
      <div className="sidebar-header">
        <div className="profile-card">
          <div className="profile-avatar">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt={userProfile.name} />
            ) : (
              <FiUser size={24} />
            )}
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{userProfile.name}</h3>
            <p className="profile-email">{userProfile.email}</p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="sidebar-menu">
        <ul>
          {mainMenuItems.map((item) => (
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
                onClick={() => handleSettingClick(item.id)}
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

export default AttendeeSidebar;
