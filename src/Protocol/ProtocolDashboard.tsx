// src/Protocol/ProtocolDashboard.tsx
import React, { useState } from "react";
import ProtocolSidebar from "./ProtocolSidebar";

// Import all Protocol pages
import ProtocolOverview from "./ProtocolOverview";
import ProtocolAssignments from "./ProtocolAssignments";
import ProtocolAgenda from "./ProtocolAgenda";
import ProtocolEventDayChecklist from "./ProtocolEventDayChecklist";
import ProtocolTaskChecklist from "./ProtocolTaskChecklist";
import ProtocolManageEvents from "./ProtocolManageEvents";
import ProtocolAppearance from "./ProtocolAppearance";
import Protocollanguage from "./Protocollanguage";
import ProtocolProfile from "./ProtocolProfile";

import "./ProtocolDashboard.css";

export type ProtocolPage =
  | "overview"
  | "assignments"
  | "agenda"
  | "event-day-checklist"
  | "task-checklist"
  | "manage-events"
  | "profile"
  | "language"
  | "appearance";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

const ProtocolDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<ProtocolPage>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: localStorage.getItem("protocol-name") || "Jane Smith",
    email: localStorage.getItem("protocol-email") || "protocol@example.com",
    avatar: localStorage.getItem("protocol-avatar") || "",
  });

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <ProtocolOverview />;
      case "assignments":
        return <ProtocolAssignments />;
      case "agenda":
        return <ProtocolAgenda />;
      case "event-day-checklist":
        return <ProtocolEventDayChecklist />;
      case "task-checklist":
        return <ProtocolTaskChecklist />;
      case "manage-events":
        return <ProtocolManageEvents />;
      case "profile":
        return (
          <ProtocolProfile
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        );
      case "language":
        return <Protocollanguage />;
      case "appearance":
        return <ProtocolAppearance />;
      default:
        return <ProtocolOverview />;
    }
  };

  return (
    <div className="protocol-dashboard-container">
      {/* Mobile Hamburger */}
      <button
        className="protocol-mobile-hamburger"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="protocol-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`protocol-sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}
      >
        <ProtocolSidebar
          activePage={activePage}
          setActivePage={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false);
          }}
          userProfile={userProfile}
        />
      </aside>

      {/* Main Content */}
      <main className="protocol-main-content">{renderPage()}</main>
    </div>
  );
};

export default ProtocolDashboard;
