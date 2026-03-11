// src/Vendor/VendorDashboard.tsx
import React, { useState } from "react";
import VendorSidebar from "./VendorSidebar";
import VendorOverview from "./VendorOverview";
import VendorManageServices from "./VendorManageServices";
import VendorAssignedEvents from "./VendorAssignedEvents";
import VendorPayments from "./VendorPayments";
import VendorSchedule from "./VendorSchedule";
import VendorInventory from "./VendorInventory";
import VendorReports from "./VendorReports";
import VendorProfile from "./VendorProfile";
import VendorLanguage from "./Vendorlanguage";
import VendorAppearance from "./VendorAppearance";
import "./VendorDashboard.css";

export type VendorPage =
  | "overview"
  | "manage-services"
  | "assigned-events"
  | "payments"
  | "schedule"
  | "inventory"
  | "reports"
  | "profile"
  | "language"
  | "appearance";

// TS-safe UserProfile: avatar always string
interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

const VendorDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<VendorPage>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ensure avatar is always a string to satisfy VendorProfile
  const userProfile: UserProfile = {
    name: "Vendor Name",
    email: "vendor@example.com",
    avatar: "/default-avatar.png", // default avatar
  };

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <VendorOverview />;
      case "manage-services":
        return <VendorManageServices />;
      case "assigned-events":
        return <VendorAssignedEvents />;
      case "payments":
        return <VendorPayments />;
      case "schedule":
        return <VendorSchedule />;
      case "inventory":
        return <VendorInventory />;
      case "reports":
        return <VendorReports />;
      case "profile":
        return <VendorProfile userProfile={userProfile} />; // pass full profile
      case "language":
        return <VendorLanguage />;
      case "appearance":
        return <VendorAppearance />;
      default:
        return <VendorOverview />;
    }
  };

  return (
    <div className="vendor-dashboard-container">
      {/* Mobile Hamburger */}
      <button
        className="vendor-mobile-hamburger"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="vendor-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`vendor-sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <VendorSidebar
          activePage={activePage}
          setActivePage={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false);
          }}
          userProfile={userProfile}
        />
      </aside>

      {/* Main Content */}
      <main className="vendor-main-content">{renderPage()}</main>
    </div>
  );
};

export default VendorDashboard;
