import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Contexts */
import { AppSettingsProvider } from "./Contexts/AppSettingsContext";
import { AppAppearanceProvider } from "./Contexts/AppAppearanceContext";
import { AppSystemLogProvider } from "./Contexts/AppSystemLog";

import Splash from "./Splash";
import Home from "./Intro/Home";
/* Auth */
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import CouplePayVendor from "./Couples/CouplePayVendor";

/* Dashboards */
import AdminDashboard from "./Admin/AdminDashboard";
import CoupleDashboard from "./Couples/CouplesDashboard";
import ManagerDashboard from "./Manager/ManagerDashboard";
import ProtocolDashboard from "./Protocol/ProtocolDashboard";
import AttendeeDashboard from "./Attendee/AttendeeDashboard";
import VendorDashboard from "./Vendor/VendorDashboard";

type UserRole =
  | "admin"
  | "user"
  | "manager"
  | "protocol"
  | "attendee"
  | "vendor"
  | null;

/* =====================================================
   ROUTES
===================================================== */
function AppContent() {
  const [role, setRole] = useState<UserRole>(null);

  return (
    <Routes>
      {/* Default route → Splash */}
      <Route path="/" element={<Splash />} />
      <Route path="/Splash/*" element={<Splash />} />
      <Route path="/Home/*" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login setRole={setRole} />} />
      <Route path="/register" element={<Register setRole={setRole} />} />

      {/* Dashboards */}
      <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
      <Route path="/couple/dashboard/*" element={<CoupleDashboard />} />
      <Route path="/manager/dashboard/*" element={<ManagerDashboard />} />
      <Route path="/protocol/dashboard/*" element={<ProtocolDashboard />} />
      <Route path="/attendee/dashboard/*" element={<AttendeeDashboard />} />
      <Route path="/vendor/dashboard/*" element={<VendorDashboard />} />

      {/* Payments */}
      <Route path="/couple/pay/:paymentId" element={<CouplePayVendor />} />
    </Routes>
  );
}

/* =====================================================
   APP ROOT
   ✅ Dynamic basename for dev vs GitHub Pages
===================================================== */
export default function App() {
  const basename =
    import.meta.env.PROD
      ? "/WEMS-Wedding-Events-Management-System"
      : "/"; // local dev

  return (
    <BrowserRouter basename={basename}>
      <AppSettingsProvider>
        <AppAppearanceProvider>
          <AppSystemLogProvider>
            <AppContent />
          </AppSystemLogProvider>
        </AppAppearanceProvider>
      </AppSettingsProvider>
    </BrowserRouter>
  );
}