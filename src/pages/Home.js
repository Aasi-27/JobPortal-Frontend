import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content container">
          <div className="hero-badge">🚀 100+ Companies Hiring</div>
          <h1 className="hero-title">
            Find Your <span className="gradient-text">Dream Job</span> Today
          </h1>
          <p className="hero-subtitle">
            Connect with top companies and land your perfect role. Browse
            curated opportunities across India's best tech companies.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn-hero-primary">
              Browse All Jobs →
            </Link>
            {!user && (
              <Link to="/register" className="btn-hero-secondary">
                Create Account
              </Link>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">25+</span>
              <span className="stat-label">Job Listings</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-num">15+</span>
              <span className="stat-label">Top Companies</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-num">Free</span>
              <span className="stat-label">To Apply</span>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
      </div>

      <div className="features-section container">
        <h2 className="section-title">Why Choose JobPortal?</h2>
        <div className="features-grid">
          {[
            {
              icon: "🔍",
              title: "Smart Search",
              desc: "Find jobs by title, company or location instantly",
            },
            {
              icon: "⚡",
              title: "One-Click Apply",
              desc: "Apply to your dream job with a single click",
            },
            {
              icon: "📊",
              title: "Track Applications",
              desc: "Monitor your application status in real-time",
            },
            {
              icon: "🏆",
              title: "Top Companies",
              desc: "Jobs from India's leading tech companies",
            },
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of job seekers who found their dream role</p>
          <Link to={user ? "/jobs" : "/register"} className="btn-cta">
            {user ? "Browse Jobs Now" : "Get Started Free"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
