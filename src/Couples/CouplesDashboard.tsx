// src/Couple/CouplesDashboard.tsx
import React, { useState } from "react";
import CouplesSidebar from "./CouplesSidebar";
import CouplesOverview from "./CouplesOverview";
import CoupleManageEvents from "./CouplesManageEvents";
import CoupleGuestList from "./CouplesGuestList";
import CoupleSeatingArrangement from "./CouplesSeatingArrangement";
import CoupleBudgetSummary from "./CouplesBudgetSummary";
import CoupleRSVPTracking from "./CouplesRSVPTracking";
import CoupleVendorCoordination from "./CouplesVendorCoordination";
import CoupleInventory from "./CouplesInventory";
import CoupleTaskChecklist from "./CouplesTaskChecklist";
import CoupleProfile from "./CoupleProfile";
import CoupleLanguage from "./Couplelanguage";
import CoupleAppearance from "./CoupleAppearance";
import "./CouplesDashboard.css";

export type CouplePage =
  | "overview"
  | "manage-events"
  | "guest-list"
  | "seating-arrangement"
  | "budget-summary"
  | "rsvp-tracking"
  | "vendor-coordination"
  | "inventory"
  | "task-checklist"
  | "profile"
  | "language"
  | "appearance";

interface UserProfile {
  name: string;
  email: string;
  avatar: string; // always string to satisfy TS
}

const CouplesDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<CouplePage>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // TS-safe userProfile object
  const userProfile: UserProfile = {
    name: "Couple Name",
    email: "couple@example.com",
    avatar: "", // empty string default
  };

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <CouplesOverview />;
      case "manage-events":
        return <CoupleManageEvents />;
      case "guest-list":
        return <CoupleGuestList />;
      case "seating-arrangement":
        return <CoupleSeatingArrangement />;
      case "budget-summary":
        return <CoupleBudgetSummary />;
      case "rsvp-tracking":
        return <CoupleRSVPTracking />;
      case "vendor-coordination":
        return <CoupleVendorCoordination />;
      case "inventory":
        return <CoupleInventory />;
      case "task-checklist":
        return <CoupleTaskChecklist />;
      case "profile":
        return <CoupleProfile userProfile={userProfile} />; // pass profile safely
      case "language":
        return <CoupleLanguage />;
      case "appearance":
        return <CoupleAppearance />;
      default:
        return <CouplesOverview />;
    }
  };

  return (
    <div className="couple-dashboard-container">
      {/* Mobile Hamburger */}
      <button
        className="couple-mobile-hamburger"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="couple-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`couple-sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <CouplesSidebar
          activePage={activePage}
          setActivePage={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false);
          }}
          userProfile={userProfile}
        />
      </aside>

      {/* Main Content */}
      <main className="couple-main-content">{renderPage()}</main>
    </div>
  );
};

export default CouplesDashboard;
