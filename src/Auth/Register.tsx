import "./Register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, Check, Sparkles, Calendar, Gift, Heart, Briefcase } from "lucide-react";
import RegisterImage from "../images/login-left.jpg";

// Update interface to include staff and vendor only
interface RegisterProps {
  setRole: (
    role: "user" | "manager" | "protocol" | "attendee" | "vendor"
  ) => void;
}



export default function Register({ setRole }: RegisterProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    weddingDate: "",
    partnerName: "",
    companyName: "",
  });
  const [role, setLocalRole] = useState<
  "user" | "manager" | "protocol" | "attendee" | "vendor"
>("user");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    // Wedding date only required for user role
    if (role === "user" && !formData.weddingDate) {
      newErrors.weddingDate = "Wedding date is helpful for planning";
    }
    // Company name required for vendor role
    if (role === "vendor" && !formData.companyName.trim()) {
      newErrors.companyName = "Company name is required for vendors";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && formData.fullName && formData.email) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setRole(role);
      setIsLoading(false);
      // Navigate to appropriate dashboard based on role
      navigate(
        role === "manager"
          ? "/manager/dashboard"
          : role === "protocol"
          ? "/protocol/dashboard"
          : role === "attendee"
          ? "/attendee/dashboard"
          : role === "vendor"
          ? "/vendor/dashboard"
          : "/onboarding"
      );
      
    }, 1500);
  };

  const passwordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  };

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

  // Show different fields based on role
  const showWeddingFields = role === "user";
  const showCompanyField = role === "vendor";

  return (
    <div className="register-container">
      {/* Left Panel - Registration Form */}
      <div className="register-panel">
        <div className="register-card-wrapper">
          <div className="register-card">
            {/* Header */}
            <div className="register-header">
              <div className="logo-wrapper">
                <Sparkles className="logo-icon" size={28} />
                <div>
                  <h1 className="logo-text">ElegantEvents</h1>
                  <p className="logo-subtitle">Create Your Account</p>
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="progress-steps">
                <div className={`step ${currentStep === 1 ? "active" : ""}`}>
                  <div className="step-number">1</div>
                  <span className="step-label">Personal</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${currentStep === 2 ? "active" : ""}`}>
                  <div className="step-number">2</div>
                  <span className="step-label">Details</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form className="register-form" onSubmit={(e) => e.preventDefault()}>
              {currentStep === 1 ? (
                <>
                  <h2 className="form-title">Tell Us About You</h2>
                  <p className="form-subtitle">Start your wedding planning journey</p>

                  {/* Full Name */}
                  <div className="form-group">
                    <div className="input-with-icon">
                      <User size={20} />
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={errors.fullName ? "error" : ""}
                      />
                    </div>
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <div className="input-with-icon">
                      <Mail size={20} />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "error" : ""}
                      />
                    </div>
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  {/* Username */}
                  <div className="form-group">
                    <div className="input-with-icon">
                      <User size={20} />
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <p className="input-hint">This will be your display name</p>
                  </div>

                  {/* Next Step Button */}
                  <button
                    type="button"
                    className="next-step-button"
                    onClick={handleNextStep}
                    disabled={!formData.fullName || !formData.email}
                  >
                    Continue to Account Details
                    <svg className="arrow-icon" viewBox="0 0 24 24">
                      <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <h2 className="form-title">Account Details</h2>
                  <p className="form-subtitle">Complete your registration</p>

                  {/* Conditional Fields Based on Role */}
                  
                  {/* Wedding Date (only for users) */}
                  {showWeddingFields && (
                    <div className="form-group">
                      <div className="input-with-icon">
                        <Calendar size={20} />
                        <input
                          type="date"
                          name="weddingDate"
                          value={formData.weddingDate}
                          onChange={handleChange}
                          className={errors.weddingDate ? "error" : ""}
                        />
                      </div>
                      {errors.weddingDate && <span className="error-message">{errors.weddingDate}</span>}
                      <p className="input-hint">Your wedding date helps us personalize your experience</p>
                    </div>
                  )}

                  {/* Partner Name (only for users) */}
                  {showWeddingFields && (
                    <div className="form-group">
                      <div className="input-with-icon">
                        <Heart size={20} />
                        <input
                          type="text"
                          name="partnerName"
                          placeholder="Partner's Name (Optional)"
                          value={formData.partnerName}
                          onChange={handleChange}
                        />
                      </div>
                      <p className="input-hint">Share your partner's name for personalized features</p>
                    </div>
                  )}

                  {/* Company Name (only for vendors) */}
                  {showCompanyField && (
                    <div className="form-group">
                      <div className="input-with-icon">
                        <Briefcase size={20} />
                        <input
                          type="text"
                          name="companyName"
                          placeholder="Company/Business Name"
                          value={formData.companyName}
                          onChange={handleChange}
                          className={errors.companyName ? "error" : ""}
                        />
                      </div>
                      {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                      <p className="input-hint">Your business name as you want it to appear to clients</p>
                    </div>
                  )}

                  {/* Password */}
                  <div className="form-group">
                    <div className="password-input-wrapper">
                      <div className="input-with-icon">
                        <Lock size={20} />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          className={errors.password ? "error" : ""}
                        />
                      </div>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    
                    {/* Password Strength Meter */}
                    {formData.password && (
                      <div className="password-strength">
                        <div className="strength-meter">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`strength-bar ${passwordStrength() >= i ? "filled" : ""}`}
                              style={{ backgroundColor: passwordStrength() >= i ? strengthColors[passwordStrength() - 1] : "" }}
                            />
                          ))}
                        </div>
                        <span className="strength-label">
                          {strengthLabels[passwordStrength() - 1] || "Very Weak"}
                        </span>
                      </div>
                    )}
                    
                    {/* Password Hints */}
                    <div className="password-hints">
                      <div className={`hint-item ${formData.password.length >= 8 ? "valid" : ""}`}>
                        <Check size={14} />
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`hint-item ${/[A-Z]/.test(formData.password) ? "valid" : ""}`}>
                        <Check size={14} />
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`hint-item ${/[0-9]/.test(formData.password) ? "valid" : ""}`}>
                        <Check size={14} />
                        <span>One number</span>
                      </div>
                    </div>
                    
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <div className="password-input-wrapper">
                      <div className="input-with-icon">
                        <Lock size={20} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={errors.confirmPassword ? "error" : ""}
                        />
                      </div>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="error-message">{errors.confirmPassword}</span>
                    )}
                  </div>

                  {/* Role Selection - */}
                  <div className="form-group">
                    <label className="role-label">Account Type</label>
                    <div className="role-selection">

{/* Couple / User */}
<div
  className={`role-option ${role === "user" ? "selected" : ""}`}
  onClick={() => setLocalRole("user")}
>
  <div className="role-icon"><Heart size={24} /></div>
  <div className="role-content">
    <h4>Couple / User</h4>
    <p>Plan your wedding with our tools</p>
  </div>
  {role === "user" && <Check className="role-check" size={20} />}
</div>

{/* Manager */}
<div
  className={`role-option ${role === "manager" ? "selected" : ""}`}
  onClick={() => setLocalRole("manager")}
>
  <div className="role-icon"><User size={24} /></div>
  <div className="role-content">
    <h4>Manager</h4>
    <p>Coordinate and manage events</p>
  </div>
  {role === "manager" && <Check className="role-check" size={20} />}
</div>

{/* Protocol */}
<div
  className={`role-option ${role === "protocol" ? "selected" : ""}`}
  onClick={() => setLocalRole("protocol")}
>
  <div className="role-icon"><User size={24} /></div>
  <div className="role-content">
    <h4>Protocol Staff</h4>
    <p>Assist on the event day</p>
  </div>
  {role === "protocol" && <Check className="role-check" size={20} />}
</div>

{/* Attendee */}
<div
  className={`role-option ${role === "attendee" ? "selected" : ""}`}
  onClick={() => setLocalRole("attendee")}
>
  <div className="role-icon"><Gift size={24} /></div>
  <div className="role-content">
    <h4>Attendee</h4>
    <p>Access event information</p>
  </div>
  {role === "attendee" && <Check className="role-check" size={20} />}
</div>

{/* Vendor */}
<div
  className={`role-option ${role === "vendor" ? "selected" : ""}`}
  onClick={() => setLocalRole("vendor")}
>
  <div className="role-icon"><Briefcase size={24} /></div>
  <div className="role-content">
    <h4>Vendor</h4>
    <p>Provide wedding services</p>
  </div>
  {role === "vendor" && <Check className="role-check" size={20} />}
</div>
</div>
</div>


                  {/* Terms and Conditions */}
                  <div className="terms-group">
                    <label className="terms-label">
                      <input type="checkbox" className="terms-checkbox" required />
                      <span>
                        I agree to the <a href="/terms">Terms of Service</a> and{" "}
                        <a href="/privacy">Privacy Policy</a>
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="form-actions">
                    <button
                      type="button"
                      className="back-button"
                      onClick={handlePrevStep}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className={`register-button ${isLoading ? "loading" : ""}`}
                      onClick={handleRegister}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="button-loader"></span>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Already have account */}
              <div className="login-link">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="login-link-text">
                    Sign in here
                  </Link>
                </p>
                <p className="trial-notice">
                  Start your 14-day free trial • No credit card required
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Panel - Hero Section */}
      <div className="register-hero">
        <div className="hero-overlay"></div>
        <img src={RegisterImage} alt="Wedding celebration" className="hero-image" />
        
        <div className="hero-content">
          <div className="hero-badge">
            <Gift size={16} />
            <span>Free 14-day trial</span>
          </div>
          
          <h1 className="hero-title">
            Begin Your<br />
            <span className="highlight">Love Story</span>
          </h1>
          
          <p className="hero-description">
            Join thousands of couples who've planned their perfect day with our platform.
            Every detail matters, and we're here to help with all of them.
          </p>
          
          {/* Features List - Updated for all roles */}
          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">👰</div>
              <h4>For Couples</h4>
              <p>Plan your dream wedding</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👔</div>
              <h4>For Staff</h4>
              <p>Manage events efficiently</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h4>For Vendors</h4>
              <p>Grow your business</p>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="testimonial">
            <div className="testimonial-content">
              "ElegantEvents made our wedding planning stress-free and organized.
              Highly recommend to every couple!"
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">S&J</div>
              <div className="author-info">
                <strong>Sarah & James</strong>
                <span>Married June 2023</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="floating-hearts">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="floating-heart"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                fontSize: `${Math.random() * 20 + 16}px`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Creating your {role} account...</p>
          </div>
        </div>
      )}
    </div>
  );
}