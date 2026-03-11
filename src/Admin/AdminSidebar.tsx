import React, { useState } from "react";
import "./AdminSidebar.css";
import {
  FiGrid,
  FiUsers,
  FiClipboard,
  FiCalendar,
  FiCreditCard,
  FiPackage,
  FiBarChart2,
  FiSettings,
  FiFileText,
  FiAlertCircle,
  FiLogOut,
  FiUser,
  FiGlobe,
  FiSun,
} from "react-icons/fi";
import type { AdminPage } from "./AdminDashboard";
import { useAppSettings } from "../Contexts/AppSettingsContext";

interface AdminSidebarProps {
  activePage: AdminPage;
  setActivePage: React.Dispatch<React.SetStateAction<AdminPage>>;
  name: string;
  email: string;
  avatar?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activePage,
  setActivePage,
  name,
  email,
  avatar,
}) => {
  const [expandedSettings, setExpandedSettings] = useState(false);
  const { t } = useAppSettings();

  const menuItems = [
    { id: "overview", labelKey: "overview", icon: <FiGrid /> },
    { id: "users", labelKey: "users", icon: <FiUsers /> },
    { id: "vendors", labelKey: "vendors", icon: <FiClipboard /> },
    { id: "events", labelKey: "events", icon: <FiCalendar /> },
    { id: "payments", labelKey: "payments", icon: <FiCreditCard /> },
    { id: "packages", labelKey: "packages", icon: <FiPackage /> },
    { id: "reports", labelKey: "reports", icon: <FiFileText /> },
    { id: "analytics", labelKey: "analytics", icon: <FiBarChart2 /> },
    { id: "update", labelKey: "systemContent", icon: <FiSettings /> },
    { id: "systemlog", labelKey: "systemLogs", icon: <FiAlertCircle /> },
  ];

  const settingsMenuItems = [
    { id: "profile", labelKey: "profile", icon: <FiUser /> },
    { id: "language", labelKey: "language", icon: <FiGlobe /> },
    { id: "appearance", labelKey: "appearance", icon: <FiSun /> },
  ];

  const handleLogout = () => console.log("Logging out...");

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="profile-card">
          <div className="profile-avatar">
            {avatar ? <img src={avatar} alt={name} /> : <FiUser />}
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{name}</h3>
            <p className="profile-role">{email}</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activePage === item.id ? "active" : ""}
              onClick={() => setActivePage(item.id as AdminPage)}
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
                onClick={() => setActivePage(item.id as AdminPage)}
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

export default AdminSidebar;
