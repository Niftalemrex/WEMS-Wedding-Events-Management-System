// src/Manager/ManagerDashboard.tsx
import React, { useState } from "react";
import ManagerSidebar from "./ManagerSidebar";

// Import all Manager pages
import ManagerOverview from "./ManagerOverview";
import ManagerManageEvents from "./ManagerManageEvents";
import ManagerManageGuests from "./ManagerManageGuests";
import ManagerVendorCoordination from "./ManagerVendorCoordination";
import ManagerTaskChecklist from "./ManagerTaskChecklist";
import ManagerBudget from "./ManagerBudget";
import ManagerInventory from "./ManagerInventory";
import ManagerAdminSystemlog from "./ManagerAdminSystemlog";
import ManagerProfile from "./ManagerProfile";
import Managerlanguage from "./Managerlanguage";
import ManagerAppearance from "./ManagerAppearance";

import "./ManagerDashboard.css";

export type ManagerPage =
  | "overview"
  | "manage-events"
  | "manage-guests"
  | "vendor-coordination"
  | "task-checklist"
  | "budget"
  | "inventory"
  | "system-log"
  | "profile"
  | "language"
  | "appearance";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

const ManagerDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<ManagerPage>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userProfile: UserProfile = {
    name: "John Doe",
    email: "manager@example.com",
    avatar: "", // optional
  };

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <ManagerOverview />;
      case "manage-events":
        return <ManagerManageEvents />;
      case "manage-guests":
        return <ManagerManageGuests />;
      case "vendor-coordination":
        return <ManagerVendorCoordination />;
      case "task-checklist":
        return <ManagerTaskChecklist />;
      case "budget":
        return <ManagerBudget />;
      case "inventory":
        return <ManagerInventory />;
      case "system-log":
        return <ManagerAdminSystemlog />;
      case "profile":
        return <ManagerProfile userProfile={userProfile} />;
      case "language":
        return <Managerlanguage />;
      case "appearance":
        return <ManagerAppearance />;
      default:
        return <ManagerOverview />;
    }
  };

  return (
    <div className="manager-dashboard-container">
      {/* Mobile Hamburger */}
      <button
        className="manager-mobile-hamburger"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="manager-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`manager-sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <ManagerSidebar
          activePage={activePage}
          setActivePage={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false);
          }}
          userProfile={userProfile}
        />
      </aside>

      {/* Main Content */}
      <main className="manager-main-content">{renderPage()}</main>
    </div>
  );
};

export default ManagerDashboard;
