import React, { useEffect, useRef, useCallback, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Home.css";
import { Calendar, CheckCircle, Users, Briefcase, CreditCard, TrendingUp, Gift, Truck, ClipboardList } from "lucide-react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { useAppSettings } from "../Contexts/AppSettingsContext";

// Local image imports (replace with your actual images)
import heroImage from "../assets/c.jpg";
import recent1 from "../assets/x.jpg";
import recent2 from "../assets/y.jpg";
import recent3 from "../assets/v.jpg";
import recent4 from "../assets/wedding-kiss.jpg";
import aboutImage from "../assets/wedding-kiss.jpg";

const recentImages = [recent1, recent2, recent3, recent4];

type User = { id: string; name?: string; email?: string };
type EventItem = { id: string; name?: string; date?: string };
type Vendor = { id: string; name?: string; service?: string };
type Payment = { id: string; amount?: number; status?: string };
type Guest = { id: string; eventId: string; name: string };
type Assignment = { id: string; staffId?: string; taskId?: string };

const Home: React.FC = () => {
  const { t } = useAppSettings();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());
  
  // Dashboard data states
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all data for the dashboard
    const timer = setTimeout(() => {
      setUsers(getFromStorage<User[]>(STORAGE_KEYS.USERS, []));
      setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
      setVendors(getFromStorage<Vendor[]>(STORAGE_KEYS.VENDORS, []));
      setPayments(getFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []));
      setGuests(getFromStorage<Guest[]>(STORAGE_KEYS.GUESTS, []));
      setAssignments(getFromStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, []));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const observeElements = useCallback(() => {
    if (observerRef.current) {
      elementsRef.current.forEach(el => observerRef.current?.unobserve(el));
      elementsRef.current.clear();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerRef.current?.unobserve(entry.target);
            elementsRef.current.delete(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    document.querySelectorAll(".fade-in").forEach((el) => {
      observerRef.current?.observe(el);
      elementsRef.current.add(el);
    });
  }, []);

  useEffect(() => {
    observeElements();
    return () => observerRef.current?.disconnect();
  }, [observeElements]);

  // Calculate statistics
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const upcomingEvents = events.filter(e => e.date && new Date(e.date) >= new Date()).length;
  const pendingPayments = payments.filter(p => p.status === "pending" || !p.status).length;

  const companyStats = [
    {
      label: "Total Users",
      value: users.length,
      icon: <Users className="h-6 w-6" />,
      trend: "+15%",
      color: "blue"
    },
    {
      label: "Active Events",
      value: events.length,
      icon: <Calendar className="h-6 w-6" />,
      subtitle: `${upcomingEvents} upcoming`,
      color: "green"
    },
    {
      label: "Partner Vendors",
      value: vendors.length,
      icon: <Truck className="h-6 w-6" />,
      trend: "+8%",
      color: "purple"
    },
    {
      label: "Total Guests",
      value: guests.length,
      icon: <Users className="h-6 w-6" />,
      subtitle: "across all events",
      color: "orange"
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <CreditCard className="h-6 w-6" />,
      trend: "+23%",
      color: "emerald"
    },
    {
      label: "Assignments",
      value: assignments.length,
      icon: <ClipboardList className="h-6 w-6" />,
      subtitle: "active tasks",
      color: "pink"
    }
  ];

  return (
    <div className="home-page"  id="top">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-backdrop"></div>
        <div className="hero-image-wrapper">
          <img src={heroImage} alt="Luxury wedding couple" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content-wrapper">
          <div className="hero-content fade-in">
            <span className="hero-badge">
              <span className="badge-dot"></span>
              WEMS – Wedding Management Simplified
            </span>
            <h1>
              Plan Your <span className="gradient-text">Perfect Wedding</span>
            </h1>
            <p className="hero-description">
              WEMS is the all in one platform that empowers couples to design,
              organize, and celebrate their dream wedding without stress.
            </p>
            <p className="hero-sub-description">
              From guest lists to budgets, timelines to design – we handle the
              details so you can focus on forever.
            </p>
            <div className="hero-cta">
              <a href="#features" className="btn btn-primary">
                <span>Explore Features</span>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#about" className="btn btn-outline">
                <span>Our Story</span>
              </a>
            </div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Company Dashboard Overview */}
      <section className="dashboard-section">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">Company Overview</span>
            <h2>
              WEMS <span className="gradient-text">by the numbers</span>
            </h2>
            <p className="section-description">
              See how we're transforming wedding planning across the globe
            </p>
          </div>

          <div className="dashboard-grid">
            {companyStats.map((stat, index) => (
              <div
                key={index}
                className={`dashboard-card fade-in stat-${stat.color}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="dashboard-card-inner">
                  <div className="dashboard-card-header">
                    <div className={`stat-icon-wrapper stat-${stat.color}`}>
                      {stat.icon}
                    </div>
                    {stat.trend && (
                      <span className="trend-badge">
                        <TrendingUp className="trend-icon" />
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  <div className="dashboard-card-content">
                    <h3 className="stat-value">
                      {isLoading ? "..." : stat.value}
                    </h3>
                    <p className="stat-label">{stat.label}</p>
                    {stat.subtitle && (
                      <p className="stat-subtitle">{stat.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="recent-activity fade-in">
            <div className="activity-header">
              <h3>Recent Platform Activity</h3>
              <a href="#" className="view-all-link">
                View All
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="activity-grid">
              <div className="activity-card">
                <div className="activity-icon new-event">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="activity-content">
                  <p className="activity-title">New event created</p>
                  <p className="activity-meta">Sarah & Michael • 2 hours ago</p>
                </div>
              </div>
              <div className="activity-card">
                <div className="activity-icon new-vendor">
                  <Truck className="h-4 w-4" />
                </div>
                <div className="activity-content">
                  <p className="activity-title">Vendor partnered</p>
                  <p className="activity-meta">Elegant Flowers • 5 hours ago</p>
                </div>
              </div>
              <div className="activity-card">
                <div className="activity-icon new-payment">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="activity-content">
                  <p className="activity-title">Payment received</p>
                  <p className="activity-meta">$2,500.00 • Yesterday</p>
                </div>
              </div>
              <div className="activity-card">
                <div className="activity-icon new-guest">
                  <Users className="h-4 w-4" />
                </div>
                <div className="activity-content">
                  <p className="activity-title">Guest RSVP confirmed</p>
                  <p className="activity-meta">45 new responses • Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-content fade-in">
              <span className="section-badge">About WEMS</span>
              <h2>
                We're on a mission to make wedding planning{' '}
                <span className="gradient-text">Joyful</span>
              </h2>
              <p className="about-text">
                Founded by a team of wedding enthusiasts and tech experts, WEMS was born
                from the belief that planning your special day should be as beautiful as
                the day itself. We combine intuitive design with powerful tools to give you
                complete control – and complete peace of mind.
              </p>
              <p className="about-text">
                Whether you're organising an intimate gathering or a grand celebration,
                WEMS adapts to your needs. Thousands of happy couples have used our
                platform to bring their vision to life. Let us help you write your story.
              </p>

              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">5,000+</span>
                  <span className="stat-label">Happy Couples</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Stress‑Free Planning</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Dedicated Support</span>
                </div>
              </div>
            </div>

            <div className="about-media fade-in">
              <div className="image-frame">
                <div className="image-frame-inner">
                  <img src={aboutImage} alt="Happy couple planning their wedding" className="about-image" />
                  <div className="image-frame-decoration"></div>
                </div>
              </div>
              <div className="experience-badge">
                <span className="years">10+</span>
                <span className="text">Years of Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">What We Offer</span>
            <h2>
              Powerful <span className="gradient-text">features</span> for your perfect day
            </h2>
          </div>

          <div className="features-grid">
            {[
              { icon: "👰", title: "Guest Management", desc: "Track RSVPs, seating, dietary preferences, and plus‑ones – all in one place." },
              { icon: "💰", title: "Budget Planner", desc: "Set your budget, track expenses, and get smart suggestions to stay on track." },
              { icon: "📅", title: "Timeline & Reminders", desc: "Automated schedules, countdowns, and alerts so you never miss a milestone." },
              { icon: "🎨", title: "Design Studio", desc: "Create stunning invitations, matching websites, and cohesive themes." }
            ].map((feature, index) => (
              <div key={index} className="feature-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-card-inner">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">{feature.icon}</span>
                    <div className="feature-icon-glow"></div>
                  </div>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                  <div className="feature-card-decoration"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Weddings Section */}
      <section className="recent-section" id="recent">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">Real Weddings</span>
            <h2>
              Inspiration from <span className="gradient-text">recent celebrations</span>
            </h2>
          </div>

          <div className="recent-grid">
            {recentImages.map((img, i) => {
              // Different wedding examples for each card
              const weddingExamples = [
                {
                  couple: "Emily & James",
                  description: "Elegant garden ceremony with 150 guests",
                  date: "June 2024",
                  location: "London, UK"
                },
                {
                  couple: "Sophia & Alexander",
                  description: "Beachfront sunset wedding with 80 guests",
                  date: "May 2024",
                  location: "Miami, FL"
                },
                {
                  couple: "Olivia & William",
                  description: "Rustic barn celebration with 200 guests",
                  date: "April 2024",
                  location: "Nashville, TN"
                },
                {
                  couple: "Isabella & Benjamin",
                  description: "Modern ballroom wedding with 250 guests",
                  date: "March 2024",
                  location: "New York, NY"
                }
              ];

              const wedding = weddingExamples[i];
              
              return (
                <div key={i} className="recent-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="recent-card-inner">
                    <div className="recent-image-wrapper">
                      <img src={img} alt={`Wedding of ${wedding.couple}`} loading="lazy" />
                      <div className="recent-overlay">
                        <button className="gallery-button" aria-label="View gallery">
                          <span>View Gallery</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7M17 7H8M17 7V16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="recent-content">
                      <h4>{wedding.couple}</h4>
                      <p>{wedding.description}</p>
                      <div className="recent-meta">
                        <span className="recent-date">{wedding.date}</span>
                        <span className="recent-location">{wedding.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="section-footer fade-in">
            <a href="#" className="btn btn-secondary">
              <span>See All Weddings</span>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;