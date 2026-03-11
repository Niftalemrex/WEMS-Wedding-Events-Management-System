// src/Admin/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminOverview from "./AdminOverview";
import AdminManageUsers from "./AdminManageUsers";
import AdminManageVendors from "./AdminManageVendors";
import AdminManageEvents from "./AdminManageEvents";
import AdminManagePayments from "./AdminManagePayments";
import AdminManagePackages from "./AdminManagePackages";
import AdminFullReports from "./AdminFullReports";
import AdminViewAnalytics from "./AdminViewAnalytics";
import AdminUpdateSystemContent from "./AdminUpdateSystemContent";
import AdminLanguage from "./adminlanguage";
import AdminSystemLog from "./AdminSystemlog";
import AdminAppearance from "./AdminAppearance";
import AdminProfile from "./AdminProfile";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminDashboard.css";

export type AdminPage =
  | "overview"
  | "users"
  | "vendors"
  | "events"
  | "payments"
  | "packages"
  | "reports"
  | "analytics"
  | "update"
  | "systemlog"
  | "language"
  | "appearance"
  | "profile";

interface Profile {
  name: string;
  email: string;
  avatar: string;
}

const AdminDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<AdminPage>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useAppSettings();

  const [userProfile, setUserProfile] = useState<Profile>({
    name: "Admin User",
    email: "admin@example.com",
    avatar: "",
  });

  // Load profile from localStorage on mount
  useEffect(() => {
    const loadProfile = () => {
      setUserProfile({
        name: localStorage.getItem("admin-name") || "Admin User",
        email: localStorage.getItem("admin-email") || "admin@example.com",
        avatar: localStorage.getItem("admin-avatar") || "",
      });
    };
    loadProfile();
  }, []);

  // Render selected page content
  const renderContent = () => {
    switch (activePage) {
      case "overview": return <AdminOverview />;
      case "users": return <AdminManageUsers />;
      case "vendors": return <AdminManageVendors />;
      case "events": return <AdminManageEvents />;
      case "payments": return <AdminManagePayments />;
      case "packages": return <AdminManagePackages />;
      case "reports": return <AdminFullReports />;
      case "analytics": return <AdminViewAnalytics />;
      case "update": return <AdminUpdateSystemContent />;
      case "systemlog": return <AdminSystemLog />;
      case "language": return <AdminLanguage />;
      case "appearance": return <AdminAppearance />;
      case "profile":
        return (
          <AdminProfile
            onProfileChange={(profile) => setUserProfile(profile)}
          />
        );
      default: return null;
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Mobile Hamburger */}
      <button
        className="mobile-hamburger"
        onClick={() => setIsSidebarOpen(true)}
        aria-label={t("openSidebar") || "Open sidebar"}
      >
        ☰
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <AdminSidebar
          activePage={activePage}
          setActivePage={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false);
          }}
          name={userProfile.name}
          email={userProfile.email}
          avatar={userProfile.avatar}
        />
      </aside>

      {/* Main content */}
      <main className="admin-dashboard-content">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
