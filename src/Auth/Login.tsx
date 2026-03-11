import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import HeroImage from "../images/login-left.jpg";

// 1️⃣ Update the types to include staff
interface LoginProps {
  setRole: (
    role: "admin" | "user" | "manager" | "protocol" | "attendee" | "vendor"
  ) => void;
}


export default function Login({ setRole }: LoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [role, setLocalRole] = useState<
  "admin" | "user" | "manager" | "protocol" | "attendee" | "vendor"
>("user");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
  };

  // 2️⃣ Updated demo login to include staff
  const handleDemoLogin = (
    type: "user" | "admin" | "manager" | "protocol" | "attendee" | "vendor"
  ) => {
    setFormData({
      email:
        type === "admin"
          ? "admin@example.com"
          : type === "manager"
          ? "manager@example.com"
          : type === "protocol"
          ? "protocol@example.com"
          : type === "attendee"
          ? "attendee@example.com"
          : type === "vendor"
          ? "vendor@example.com"
          : "user@example.com",
      password: "demo123",
    });
    setLocalRole(type);
  };
  

  // 3️⃣ Update handleLogin navigation to handle staff
  const handleLogin = async () => {
    if (!validateForm()) return;
  
    setIsLoading(true);
    setErrors({});
  
    setTimeout(() => {
      /* ===============================
         1️⃣ DEMO ACCOUNTS
      =============================== */
      const DEMO_USERS: Record<
        "admin" | "manager" | "protocol" | "attendee" | "vendor" | "user",
        string
      > = {
        admin: "admin@example.com",
        manager: "manager@example.com",
        protocol: "protocol@example.com",
        attendee: "attendee@example.com",
        vendor: "vendor@example.com",
        user: "user@example.com",
      };
  
      const isDemoLogin =
        formData.password === "demo123" &&
        formData.email === DEMO_USERS[role];
  
      /* ===============================
         2️⃣ REAL USERS (LocalStorage)
         (later → replace with API)
      =============================== */
      const storedUsers = JSON.parse(
        localStorage.getItem("users") || "[]"
      );
  
      const realUser = storedUsers.find(
        (u: any) =>
          u.email === formData.email &&
          u.password === formData.password &&
          u.role === role
      );
  
      /* ===============================
         3️⃣ LOGIN DECISION
      =============================== */
      if (isDemoLogin || realUser) {
        setRole(role);
  
        // Optional persistence
        localStorage.setItem(
          "authUser",
          JSON.stringify({
            email: formData.email,
            role,
          })
        );
  
        navigate(
          role === "admin"
            ? "/admin/dashboard"
            : role === "manager"
            ? "/manager/dashboard"
            : role === "protocol"
            ? "/protocol/dashboard"
            : role === "attendee"
            ? "/attendee/dashboard"
            : role === "vendor"
            ? "/vendor/dashboard"
            : "/couple/dashboard"
        );
  
        setIsLoading(false);
      } else {
        setLoginAttempts((prev) => prev + 1);
        setErrors({
          general:
            loginAttempts >= 2
              ? "Too many failed attempts. Please try again later."
              : "Invalid email or password. Please try again.",
        });
        setIsLoading(false);
      }
    }, 1200);
  };
  

  return (
    <div className="login-page-container">
      {/* LEFT SIDE - Login Form */}
      <div className="left-side">
        <div className="login-card-wrapper">
          <div className="login-card">
            {/* Branding Header */}
            <div className="brand-header">
              <div className="brand-logo">
                <div className="brand-icon">
                  <Sparkles size={28} />
                </div>
                <div className="brand-text">
                  <h1 className="brand-name">ElegantEvents</h1>
                  <p className="brand-tagline">Where Dreams Become Reality</p>
                </div>
              </div>
              <div className="welcome-message">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to continue your wedding planning journey</p>
              </div>
            </div>

            {/* Demo Login Buttons */}
            <div className="demo-login-section">
              <p className="demo-label">Try demo accounts:</p>
              <div className="demo-buttons">
              <button
  className="demo-button user"
  onClick={() => handleDemoLogin("user")}
  disabled={isLoading}
>
  <User size={16} />
  User Demo
</button>

<button
  className="demo-button staff"
  onClick={() => handleDemoLogin("manager")}
  disabled={isLoading}
>
  <User size={16} />
  Manager Demo
</button>

<button
  className="demo-button staff"
  onClick={() => handleDemoLogin("protocol")}
  disabled={isLoading}
>
  <User size={16} />
  Protocol Demo
</button>

<button
  className="demo-button staff"
  onClick={() => handleDemoLogin("attendee")}
  disabled={isLoading}
>
  <User size={16} />
  Attendee Demo
</button>

<button
  className="demo-button staff"
  onClick={() => handleDemoLogin("vendor")}
  disabled={isLoading}
>
  <User size={16} />
  Vendor Demo
</button>

<button
  className="demo-button admin"
  onClick={() => handleDemoLogin("admin")}
  disabled={isLoading}
>
  <Sparkles size={16} />
  Admin Demo
</button>

              </div>
            </div>

            {/* Form Inputs */}
            <div className="form-inputs">
              {/* General Error */}
              {errors.general && (
                <div className="error-alert">
                  <AlertCircle size={18} />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="form-group">
                <div className={`input-with-icon ${errors.email ? "error" : formData.email ? "success" : ""}`}>
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  {formData.email && !errors.email && (
                    <CheckCircle className="success-icon" size={18} />
                  )}
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Password Input */}
              <div className="form-group">
                <div className={`password-input-wrapper ${errors.password ? "error" : formData.password ? "success" : ""}`}>
                  <div className="input-with-icon">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="password-actions">
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {formData.password && !errors.password && (
                      <CheckCircle className="success-icon" size={18} />
                    )}
                  </div>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-meter">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`strength-bar ${
                            formData.password.length >= i * 2 ? "active" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="strength-text">
                      {formData.password.length < 6 ? "Weak" : 
                       formData.password.length < 10 ? "Fair" : 
                       formData.password.length < 14 ? "Good" : "Strong"}
                    </span>
                  </div>
                )}
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <div className="role-selection-wrapper">
                  <div className="input-with-icon">
                    <User className="input-icon" size={20} />
                  <select
  name="role"
  value={role}
  onChange={(e) =>
    setLocalRole(
      e.target.value as
        | "admin"
        | "user"
        | "manager"
        | "protocol"
        | "attendee"
        | "vendor"
    )
  }
  className="role-select"
  disabled={isLoading}
>
  <option value="user">👰 Couple / User</option>
  <option value="manager">📋 Manager / Event Planner</option>
  <option value="protocol">🕴 Protocol Staff</option>
  <option value="attendee">🎟 Attendee / Guest</option>
  <option value="vendor">💼 Vendor / Service Provider</option>
  <option value="admin">👑 Admin</option>
</select>

                  </div>
                  <div className="role-hint">
                    Select your account type to access relevant features
                  </div>
                </div>
              </div>

              {/* Form Options */}
              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember">
                    <span className="checkbox-label">Remember me</span>
                    <span className="checkbox-sub">Stay signed in for 30 days</span>
                  </label>
                </div>
                <Link to="/forgot-password" className="forgot-password" tabIndex={isLoading ? -1 : 0}>
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button 
                className={`login-button ${isLoading ? "loading" : ""} ${Object.keys(errors).length > 0 ? "has-errors" : ""}`}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="button-loader"></span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="arrow-icon" viewBox="0 0 24 24">
                      <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                    </svg>
                  </>
                )}
              </button>

              {/* Social Login Divider */}
              <div className="social-divider">
                <span>Or sign in with</span>
              </div>

              {/* Social Login Options */}
              <div className="social-login">
                <button 
                  className="social-button google" 
                  disabled={isLoading}
                  onClick={() => {/* Implement Google OAuth */}}
                >
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button 
                  className="social-button apple" 
                  disabled={isLoading}
                  onClick={() => {/* Implement Apple OAuth */}}
                >
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.76 3.28-.76 2 .76 3.3.73 2.22-1.24 3.06-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.04z"/>
                  </svg>
                  Apple
                </button>
              </div>

              {/* Register Link */}
              <div className="register-section">
                <div className="register-prompt">
                  <p className="register-text">
                    New to ElegantEvents?{" "}
                    <Link to="/register" className="register-link" tabIndex={isLoading ? -1 : 0}>
                      Create an account
                    </Link>
                  </p>
                  <p className="trial-text">
                    Start your 14-day free trial • No credit card required
                  </p>
                </div>
                <div className="security-notice">
                  <Lock size={12} />
                  <span>Your data is protected with 256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Hero Image */}
      <div className="right-side">
        <div className="hero-overlay"></div>
        <img src={HeroImage} className="hero-image" alt="Luxury wedding setting" />
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Trusted by 5,000+ couples</span>
          </div>
          <h1 className="hero-title">
            Plan the Perfect<br />
            <span className="gradient-text">Wedding Celebration</span>
          </h1>
          <p className="hero-description">
            Manage guests, track events, organize vendors, and customize every detail 
            with our elegant wedding planning suite. Everything you need for your special day.
          </p>
          
          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👰</div>
              <h4>Guest Management</h4>
              <p>Track RSVPs, meal preferences & seating</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h4>Budget Planner</h4>
              <p>Real-time tracking & alerts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h4>Timeline</h4>
              <p>Automated schedule & reminders</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h4>Design Studio</h4>
              <p>Custom invitations & websites</p>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-section">
            <div className="stat">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Happy Couples</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="floral-decoration top-left">
          <svg viewBox="0 0 100 100">
            <path d="M50,10 C60,10 70,20 70,30 C70,40 60,50 50,50 C40,50 30,40 30,30 C30,20 40,10 50,10 Z" fill="rgba(255,255,255,0.1)"/>
          </svg>
        </div>
        <div className="floral-decoration bottom-right">
          <svg viewBox="0 0 100 100">
            <path d="M50,90 C40,90 30,80 30,70 C30,60 40,50 50,50 C60,50 70,60 70,70 C70,80 60,90 50,90 Z" fill="rgba(255,255,255,0.1)"/>
          </svg>
        </div>
        
        {/* Floating Elements */}
        <div className="floating-hearts">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="floating-heart"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                fontSize: `${Math.random() * 20 + 16}px`,
              }}
            >
              {i % 3 === 0 ? "💖" : i % 3 === 1 ? "✨" : "🌸"}
            </div>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              <p>Signing you in...</p>
              <p className="loading-subtext">Preparing your dashboard</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}