import "./SplashScreen.css";
import { useClerk, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSync } from "../hooks/useUserSync";

export default function SplashScreen() {
  const { redirectToSignIn } = useClerk();
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { dbUser, isSyncing } = useUserSync();

  useEffect(() => {
    if (isLoaded && isSignedIn && !isSyncing) {
      const selectedRole = dbUser?.selectedRole || localStorage.getItem("selectedRole");
      if (selectedRole) {
        const dashboardMap = {
          ADMIN: "/admin/dashboard",
          MANAGER: "/manager/dashboard",
          PROTOCOL: "/protocol/dashboard",
          ATTENDEE: "/attendee/dashboard",
          VENDOR: "/vendor/dashboard",
          USER: "/couple/dashboard",
        };
        navigate(dashboardMap[selectedRole] || "/couple/dashboard");
      } else {
        navigate("/onboarding");
      }
    }
  }, [isSignedIn, isLoaded, isSyncing, dbUser, navigate]);

  const handleLogin = () => {
    redirectToSignIn({
      redirectUrl: "/onboarding",
    });
  };

  const handleSecondaryLogin = () => {
    navigate("/login");
  };

  return (
    <div className="splash-screen">
      <div className="splash-hero-container">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070"
          alt="Wedding Hero"
          className="splash-hero-image"
        />
        <div className="splash-overlay"></div>
      </div>

      <div className="splash-content">
        <div className="editorial-header">
          <p className="pre-title">ESTABLISHED MMXXV</p>
          <div className="title-wrapper">
            <h1 className="title-main">Elegant</h1>
            <div className="ampersand-box">
              <span className="ampersand">&</span>
            </div>
            <h1 className="title-sub">Events</h1>
          </div>
          <div className="luxury-divider"></div>
          <p className="tagline">FOR EXTRAORDINARY LOVE STORIES</p>
        </div>

        <div className="bottom-section">
          {!isSignedIn ? (
            <>
              <div className="glass-button-wrapper">
                <button className="premium-button" onClick={handleLogin}>
                  <div className="icon-circle">
                    <span className="g-text">G</span>
                  </div>
                  <span className="premium-button-text">Continue with Google</span>
                </button>
              </div>

              <button className="secondary-button" onClick={handleSecondaryLogin}>
                <span className="secondary-button-text">Login as Staff</span>
                <div className="button-underline"></div>
              </button>
            </>
          ) : (
            <div className="loading-state">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
