// src/Couple/CouplesSidebar.tsx
import React, { useState } from "react";
import "./CouplesSidebar.css";
import {
  FiGrid,
  FiClipboard,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiCheckSquare,
  FiUser,
  FiGlobe,
  FiSun,
  FiLogOut,
} from "react-icons/fi";
import type { CouplePage } from "./CouplesDashboard";
import { useAppSettings } from "../Contexts/AppSettingsContext"; // for translations

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface CouplesSidebarProps {
  activePage: CouplePage;
  setActivePage: React.Dispatch<React.SetStateAction<CouplePage>>;
  userProfile?: UserProfile;
}

const CouplesSidebar: React.FC<CouplesSidebarProps> = ({
  activePage,
  setActivePage,
  userProfile,
}) => {
  const [expandedSettings, setExpandedSettings] = useState(false);
  const { t } = useAppSettings();

  const menuItems = [
    { id: "overview", labelKey: "overview", icon: <FiGrid /> },
    { id: "manage-events", labelKey: "manageEvents", icon: <FiCalendar /> },
    { id: "guest-list", labelKey: "guestList", icon: <FiUsers /> },
    { id: "seating-arrangement", labelKey: "seatingArrangement", icon: <FiPackage /> },
    { id: "budget-summary", labelKey: "budgetSummary", icon: <FiDollarSign /> },
    { id: "rsvp-tracking", labelKey: "rsvpTracking", icon: <FiClipboard /> },
    { id: "vendor-coordination", labelKey: "vendorCoordination", icon: <FiUsers /> },
    { id: "inventory", labelKey: "inventory", icon: <FiPackage /> },
    { id: "task-checklist", labelKey: "taskChecklist", icon: <FiCheckSquare /> },
  ];

  const settingsMenuItems = [
    { id: "profile", labelKey: "profile", icon: <FiUser /> },
    { id: "language", labelKey: "language", icon: <FiGlobe /> },
    { id: "appearance", labelKey: "appearance", icon: <FiSun /> },
  ];

  const handleLogout = () => {
    console.log("Couple logging out...");
  };

  return (
    <aside className="couples-sidebar">
      <div className="sidebar-header">
        {userProfile && (
          <div className="profile-card">
            <div className="profile-avatar">
              {userProfile.avatar ? <img src={userProfile.avatar} alt={userProfile.name} /> : <FiUser />}
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{userProfile.name}</h3>
              <p className="profile-role">{userProfile.email}</p>
            </div>
          </div>
        )}
      </div>

      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activePage === item.id ? "active" : ""}
              onClick={() => setActivePage(item.id as CouplePage)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{t(item.labelKey)}</span>
            </li>
          ))}
        </ul>
      </nav>

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
                onClick={() => setActivePage(item.id as CouplePage)}
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

export default CouplesSidebar;
