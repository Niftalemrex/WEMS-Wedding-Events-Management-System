// src/Attendee/AttendeeDashboard.tsx
import React, { useState } from "react";
import AttendeeSidebar from "./AttendeeSidebar";
import AttendeeOverview from "./AttendeeOverview";
import AttendeeEventInfo from "./AttendeeEventInfo";
import AttendeeSchedule from "./AttendeeSchedule";
import AttendeeRSVP from "./AttendeeRSVP";
import AttendeeSeatInfo from "./AttendeeSeatInfo";
import AttendeeGiftRegistry from "./AttendeeGiftRegistry";
import AttendeeAppearance from "./AttendeeAppearance";
import AttendeeProfile from "./AttendeeProfile";
import Attendeelanguage from "./Attendeelanguage";
import "./AttendeeDashboard.css";

export type AttendeePage =
  | "overview"
  | "event-info"
  | "schedule"
  | "rsvp"
  | "seat-info"
  | "gift-registry"
  | "profile"
  | "language"
  | "appearance";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

const AttendeeDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<AttendeePage>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userProfile: UserProfile = {
    name: "Attendee Name",
    email: "attendee@example.com",
    avatar: "", // optional
  };

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <AttendeeOverview />;
      case "event-info":
        return <AttendeeEventInfo />;
      case "schedule":
        return <AttendeeSchedule />;
      case "rsvp":
        return <AttendeeRSVP />;
      case "seat-info":
        return <AttendeeSeatInfo />;
      case "gift-registry":
        return <AttendeeGiftRegistry />;
      case "profile":
        return <AttendeeProfile userProfile={userProfile} />;
      case "language":
        return <Attendeelanguage />;
      case "appearance":
        return <AttendeeAppearance />;
      default:
        return <AttendeeOverview />;
    }
  };

  return (
    <div className="attendee-dashboard-container">
      {/* Mobile Hamburger */}
      <button
        className="attendee-mobile-hamburger"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="attendee-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`attendee-sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <AttendeeSidebar
          activePage={activePage}
          setActivePage={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false);
          }}
          userProfile={userProfile}
        />
      </aside>

      {/* Main Content */}
      <main className="attendee-main-content">{renderPage()}</main>
    </div>
  );
};

export default AttendeeDashboard;
